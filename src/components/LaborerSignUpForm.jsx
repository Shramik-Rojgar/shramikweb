import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import {
  HardHat,
  Check,
  ShieldCheck,
  ArrowRight,
  Camera,
  FileText,
  MapPin,
  Plus,
  Minus,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { translations } from '../lib/translations';
import { supabase } from '../lib/supabase';
import { uploadToR2 } from '../lib/r2';

// ── Icon helpers ────────────────────────────────────────────────────────────
const I = {
  plus:      'M12 5v14 M5 12h14',
  people:    'M9 11a3 3 0 100-6 3 3 0 000 6z M2 20c.6-3 2.8-4.6 6-4.6 1 0 1.9.15 2.7.45 M16 11a3 3 0 100-6 M14.5 15.4c2.6.2 4.4 1.8 4.9 4.6',
  brick:     'M4 7h16v5H4z M4 12h16v5H4z M9 7v5 M14 12v5',
  roller:    'M5 5h12v5H5z M17 7h2.5v4H12v4 M12 15v5',
  bolt:      'M13 3L6 13.5h5L10 21l7-10.5h-5l1-7.5z',
  droplet:   'M12 4c3 4 6 6.8 6 10a6 6 0 11-12 0c0-3.2 3-6 6-10z',
  hammer:    'M14 6l4 4 M11.5 8.5l4 4-6.5 6.5-4-4 6.5-6.5z M13 4.5l6.5 6.5',
  welder:    'M12 2v3 M12 19v3 M3 12h3 M18 12h3 M5.5 5.5l2 2 M16.5 16.5l2 2 M16.5 7.5l2-2 M5.5 18.5l2-2',
  rebar:     'M4 5h16 M4 12h16 M4 19h16 M9 4v16 M15 4v16',
  tile:      'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  hardhat:   'M3 18h18 M5 18v-2a7 7 0 0114 0v2 M10 8.5V5.5h4v3',
  home:      'M4 11l8-7 8 7 M6 10v9h12v-9 M10 19v-5h4v5',
};

function Ic({ d, size = 22, color = 'currentColor', sw = 2, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: 'block' }}>
      <path d={d} fill={fill} stroke={fill === 'none' ? color : 'none'}
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SKILLS = [
  { key: 'Mason',        ic: 'brick',   hi: 'मिस्त्री',          en: 'Mason' },
  { key: 'Carpenter',    ic: 'hammer',  hi: 'बढ़ई',               en: 'Carpenter' },
  { key: 'Painter',      ic: 'roller',  hi: 'पेंटर',              en: 'Painter' },
  { key: 'Welder',       ic: 'welder',  hi: 'वेल्डर',             en: 'Welder' },
  { key: 'Plumber',      ic: 'droplet', hi: 'नलसाज',              en: 'Plumber' },
  { key: 'Electrician',  ic: 'bolt',    hi: 'बिजली मिस्त्री',     en: 'Electrician' },
  { key: 'Bar bender',   ic: 'rebar',   hi: 'सरिया',              en: 'Bar bender' },
  { key: 'Tiler',        ic: 'tile',    hi: 'टाइल',               en: 'Tiler' },
  { key: 'Site helper',  ic: 'hardhat', hi: 'निर्माण सहायक',       en: 'Site helper' },
  { key: 'Labourer',     ic: 'people',  hi: 'मजदूर',              en: 'Labourer' },
  { key: 'Domestic help',ic: 'home',    hi: 'घरेलू सहायक',        en: 'Domestic help' },
];

// Maps to DB enum values
const EXPERIENCE_OPTIONS = [
  { id: 'Fresher',    hi: 'नया (फ्रेशर)',    en: 'Fresher' },
  { id: '1-3 Years',  hi: '१–३ साल',         en: '1–3 Years' },
  { id: '3-5 Years',  hi: '३–५ साल',         en: '3–5 Years' },
  { id: '5+ Years',   hi: '५+ साल',           en: '5+ Years' },
];

const GENDER_OPTIONS = [
  { value: 'Male',   hi: 'पुरुष',   en: 'Male' },
  { value: 'Female', hi: 'महिला',   en: 'Female' },
  { value: 'Other',  hi: 'अन्य',    en: 'Other' },
];

export default function LaborerSignUpForm({ onNavigate, onBack, language = 'hi', onLanguageChange }) {
  const [formData, setFormData] = useState({
    name:        '',
    phone:       '',
    dob:         '',
    gender:      '',
    skills:      [],   // max 3 — mapped to skill_1, skill_2, skill_3
    experience:  '',
    dailyWage:   600,
  });

  const [photoFile,   setPhotoFile]   = useState(null);
  const [photoPreview,setPhotoPreview]= useState(null);
  const [govIdFile,   setGovIdFile]   = useState(null);
  const [govIdName,   setGovIdName]   = useState('');

  const [errors,      setErrors]      = useState({});
  const [isSubmitting,setIsSubmitting]= useState(false);
  const [submitStage, setSubmitStage] = useState(''); // progress label
  const [isSuccess,   setIsSuccess]   = useState(false);
  const [isLocating,  setIsLocating]  = useState(false);

  const t = translations[language].laborer;
  const L = (hi, en) => language === 'hi' ? hi : en;

  // ── Field helpers ────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    if (errors.photo) setErrors(p => ({ ...p, photo: '' }));
  };

  const handleGovIdChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGovIdFile(file);
    setGovIdName(file.name);
    if (errors.govId) setErrors(p => ({ ...p, govId: '' }));
  };

  const toggleSkill = (key) => {
    setFormData(p => {
      const exists = p.skills.includes(key);
      if (!exists && p.skills.length >= 3) {
        setErrors(e => ({ ...e, skills: L('आप अधिकतम ३ हुनर ही चुन सकते हैं', 'You can select up to 3 skills') }));
        return p;
      }
      const skills = exists ? p.skills.filter(k => k !== key) : [...p.skills, key];
      setErrors(e => ({ ...e, skills: '' }));
      return { ...p, skills };
    });
  };

  const adjustRate = (amount) => {
    setFormData(p => ({ ...p, dailyWage: Math.max(300, p.dailyWage + amount) }));
  };

  const detectLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
        },
        () => { setIsLocating(false); }
      );
    } else {
      setIsLocating(false);
    }
  };

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.name.trim())  e.name     = L('पूरा नाम आवश्यक है', 'Full name is required');
    if (!formData.phone.trim()) e.phone    = L('मोबाइल नंबर आवश्यक है', 'Mobile number is required');
    else if (!/^\d{10}$/.test(formData.phone))
                                 e.phone    = L('१०-अंकों का नंबर दर्ज करें', 'Enter a valid 10-digit mobile number');
    if (!formData.dob)           e.dob      = L('जन्म तिथि आवश्यक है', 'Date of birth is required');
    if (!formData.gender)        e.gender   = L('लिंग चुनें', 'Select gender');
    if (!photoFile)              e.photo    = L('प्रोफ़ाइल फ़ोटो अनिवार्य है', 'Profile photo is required');
    if (!govIdFile)              e.govId    = L('सरकारी ID अनिवार्य है', 'Government ID is required');
    if (formData.skills.length === 0)
                                 e.skills   = L('कम से कम एक हुनर चुनें', 'Select at least one skill');
    if (!formData.experience)    e.experience = L('अनुभव चुनें', 'Select experience level');
    return e;
  };

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // 1. Create auth user (phone → pseudo email so no OTP required at this stage)
      setSubmitStage(L('खाता बना रहे हैं…', 'Creating account…'));
      const pseudoEmail = `worker${formData.phone}@shramik.workers`;
      const pseudoPass  = `${formData.phone}${formData.dob.replace(/-/g, '')}`;

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email:    pseudoEmail,
        password: pseudoPass,
      });

      if (authError) throw new Error(authError.message);
      const userId = authData.user?.id;
      if (!userId) throw new Error('Could not create account. Please try again.');

      // 2. Upload profile photo to R2
      setSubmitStage(L('फ़ोटो अपलोड हो रही है…', 'Uploading photo…'));
      const photoUrl = await uploadToR2(photoFile, 'photos', userId);

      // 3. Upload government ID to R2
      setSubmitStage(L('सरकारी ID अपलोड हो रही है…', 'Uploading government ID…'));
      const govIdUrl = await uploadToR2(govIdFile, 'govids', userId);

      // 4. Insert into labourers table
      setSubmitStage(L('प्रोफ़ाइल सहेज रहे हैं…', 'Saving profile…'));
      const [skill1, skill2, skill3] = formData.skills;

      const { error: insertError } = await supabase.from('labourers').insert({
        id:                userId,
        full_name:         formData.name.trim(),
        mobile_no:         formData.phone.trim(),
        date_of_birth:     formData.dob,
        gender:            formData.gender,
        skill_1:           skill1,
        skill_2:           skill2 ?? null,
        skill_3:           skill3 ?? null,
        experience_level:  formData.experience,
        daily_wage:        formData.dailyWage,
        photo_url:         photoUrl,
        government_id_url: govIdUrl,
        status:            'pending',
      });

      if (insertError) throw new Error(insertError.message);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onNavigate('home');
      }, 3000);

    } catch (err) {
      setErrors({ submit: err.message || L('कुछ गलत हो गया। दोबारा कोशिश करें।', 'Something went wrong. Please try again.') });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
      setSubmitStage('');
    }
  };

  // ── Success state ────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-screen text-[#1C2733] font-sans flex flex-col justify-between">
        <Header theme="light" onNavigate={onNavigate} onBack={onBack} language={language} onLanguageChange={onLanguageChange} />
        <main className="flex-grow flex flex-col items-center justify-center text-center px-6 gap-6">
          <div className="w-20 h-20 rounded-full bg-[#E4F7EC] border border-[#16B364]/20 flex items-center justify-center animate-bounce">
            <Check className="w-10 h-10 text-[#16B364] stroke-[3]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--ink)] font-display">{t.successTitle}</h2>
          <p className="text-sm text-slate-500 font-semibold max-w-xs">{t.successSubtitle}</p>
        </main>
        <Footer theme="light" />
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-[#1C2733] font-sans flex flex-col justify-between">
      <Header theme="light" onNavigate={onNavigate} onBack={onBack} language={language} onLanguageChange={onLanguageChange} />
      <BackgroundOrbs />

      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 flex-grow flex flex-col justify-center text-left">
        <div className="glass-card rounded-3xl p-5 sm:p-8 md:p-10">
          <h2 className="text-3xl font-bold text-brand-grad mb-2 font-display">{t.title}</h2>
          <p className="text-slate-500 text-sm mb-8 font-semibold">{t.subtitle}</p>

          {/* Global submit error */}
          {errors.submit && (
            <div className="flex items-start gap-3 bg-[rgba(201,29,94,0.08)] border border-[rgba(201,29,94,0.2)] rounded-2xl px-4 py-3 mb-6">
              <AlertCircle size={15} className="text-[var(--accent)] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className="text-xs font-semibold text-[var(--accent)] leading-relaxed">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* ── Full Name ──────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.fullName}</Label>
              <Input type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder={L('अपना पूरा नाम दर्ज करें', 'Enter your full name')}
                className={`glass-input h-12 border rounded-xl px-4 focus:outline-none ${errors.name ? 'border-red-400' : ''}`}
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </div>

            {/* ── Mobile ─────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.phone}</Label>
              <Input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                maxLength={10}
                placeholder={L('१०-अंकों का मोबाइल नंबर', 'Enter 10-digit mobile number')}
                className={`glass-input h-12 border rounded-xl px-4 focus:outline-none ${errors.phone ? 'border-red-400' : ''}`}
              />
              {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
            </div>

            {/* ── DOB + Gender ───────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.dob}</Label>
                <Input type="date" name="dob" value={formData.dob} onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 focus:outline-none ${errors.dob ? 'border-red-400' : ''}`}
                />
                {errors.dob && <span className="text-xs text-red-500">{errors.dob}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.gender}</Label>
                <select name="gender" value={formData.gender} onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 focus:outline-none bg-white/85 text-sm font-semibold cursor-pointer ${errors.gender ? 'border-red-400' : ''}`}
                >
                  <option value="">{L('लिंग चुनें', 'Select Gender')}</option>
                  {GENDER_OPTIONS.map(g => (
                    <option key={g.value} value={g.value}>{language === 'hi' ? g.hi : g.en}</option>
                  ))}
                </select>
                {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
              </div>
            </div>

            {/* ── Profile Photo ──────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.profilePhoto}</Label>
              <div className="flex items-center gap-5 mt-1">
                <div className="relative w-20 h-20 rounded-full bg-slate-100 border border-[#DDE3EA] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {photoPreview
                    ? <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                    : <HardHat className="w-8 h-8 text-slate-400" />
                  }
                </div>
                <div>
                  <input type="file" accept="image/*" id="photo-input" className="hidden" onChange={handlePhotoChange} />
                  <label htmlFor="photo-input"
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300/60 cursor-pointer transition-all text-xs md:text-sm"
                  >
                    <Camera className="w-4 h-4 text-slate-500" />
                    <span>{t.photoPrompt}</span>
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">{t.photoSubtext}</p>
                  {errors.photo && <span className="text-xs text-red-500 block mt-1">{errors.photo}</span>}
                </div>
              </div>
            </div>

            {/* ── Government ID ──────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {L('सरकारी पहचान पत्र (आधार / वोटर ID)', 'Government ID (Aadhaar / Voter ID)')}
              </Label>
              <div className="flex items-center gap-4 mt-1">
                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center flex-shrink-0 ${govIdFile ? 'bg-[#E4F7EC] border-[#16B364]/30' : 'bg-slate-100 border-[#DDE3EA]'}`}>
                  {govIdFile
                    ? <Check className="w-7 h-7 text-[#16B364] stroke-[3]" />
                    : <FileText className="w-7 h-7 text-slate-400" />
                  }
                </div>
                <div>
                  <input type="file" accept="image/*,application/pdf" id="govid-input" className="hidden" onChange={handleGovIdChange} />
                  <label htmlFor="govid-input"
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300/60 cursor-pointer transition-all text-xs md:text-sm"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>{L('ID अपलोड करें', 'Upload ID')}</span>
                  </label>
                  {govIdName && <p className="text-[10px] text-slate-500 mt-1.5 font-semibold truncate max-w-[200px]">{govIdName}</p>}
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{L('आधार, वोटर ID, पैन — JPG/PNG/PDF', 'Aadhaar, Voter ID, PAN — JPG/PNG/PDF')}</p>
                  {errors.govId && <span className="text-xs text-red-500 block mt-1">{errors.govId}</span>}
                </div>
              </div>
            </div>

            {/* ── Skills ─────────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.primarySkills}</Label>
              <p className="text-[10px] text-slate-400 mb-2 font-semibold">{t.skillsSubtext}</p>
              <div className="skill-grid mt-1">
                {SKILLS.map((sk) => {
                  const on = formData.skills.includes(sk.key);
                  return (
                    <button type="button" key={sk.key}
                      className={cn('skill hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer', on && 'on')}
                      onClick={() => toggleSkill(sk.key)}
                    >
                      <Ic d={I[sk.ic]} size={21} color="currentColor" sw={2}
                        fill={sk.ic === 'bolt' && on ? 'currentColor' : 'none'} />
                      <span className="lab">{language === 'hi' ? sk.hi : sk.en}</span>
                    </button>
                  );
                })}
              </div>
              {errors.skills && <span className="text-xs text-red-500 mt-1">{errors.skills}</span>}
            </div>

            {/* ── Experience ─────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.experienceLevel}</Label>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {EXPERIENCE_OPTIONS.map((exp) => {
                  const selected = formData.experience === exp.id;
                  return (
                    <button type="button" key={exp.id}
                      onClick={() => {
                        setFormData(p => ({ ...p, experience: exp.id }));
                        setErrors(e => ({ ...e, experience: '' }));
                      }}
                      className={`py-2 px-4 rounded-xl border font-semibold text-xs md:text-sm transition-all duration-150 cursor-pointer ${
                        selected ? 'bg-[#7A3BFF] border-transparent text-white shadow-sm' : 'glass-chip hover:border-slate-350 text-slate-700'
                      }`}
                    >
                      {language === 'hi' ? exp.hi : exp.en}
                    </button>
                  );
                })}
              </div>
              {errors.experience && <span className="text-xs text-red-500 mt-1">{errors.experience}</span>}
            </div>

            {/* ── Daily Wage ─────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.expectedWage}</Label>
              <p className="text-[10px] text-slate-400 font-semibold mb-2">{t.wageSubtext}</p>
              <div className="flex items-center gap-3 w-fit bg-surface-gray-2/50 border border-slate-200 p-1.5 rounded-2xl">
                <Button type="button" onClick={() => adjustRate(-50)} variant="outline" size="icon"
                  className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center border border-slate-200 cursor-pointer"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </Button>
                <div className="min-w-28 text-center">
                  <span className="text-2xl font-black text-ink font-display">₹{formData.dailyWage}</span>
                  <span className="block text-[9px] text-slate-400 font-semibold">{t.wagePerDay}</span>
                </div>
                <Button type="button" onClick={() => adjustRate(50)} variant="outline" size="icon"
                  className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center border border-slate-200 cursor-pointer"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </Button>
              </div>
            </div>

            {/* ── Submit ─────────────────────────────────── */}
            <Button type="submit" disabled={isSubmitting}
              className="w-full h-14 bg-brand-grad hover:opacity-90 text-white font-bold rounded-2xl mt-4 cursor-pointer flex items-center justify-center gap-2 font-display text-lg shadow-md transition-all border-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{submitStage || t.submittingProfile}</span>
                </>
              ) : (
                <>
                  <span>{t.submitProfile}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>

          </form>
        </div>
      </main>
      <Footer theme="light" />
    </div>
  );
}

// Import BackgroundOrbs inline to avoid circular dep issues
function BackgroundOrbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none', overflow: 'hidden', background: '#FFFAEF' }}>
      <span style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(8px)', width: 520, height: 520, top: -180, left: -140, background: 'radial-gradient(circle, #FFCB5E66, transparent 64%)' }} />
      <span style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(8px)', width: 560, height: 560, top: -120, right: -200, background: 'radial-gradient(circle, #FFB05444, transparent 64%)' }} />
      <span style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(8px)', width: 520, height: 520, top: 880, left: -180, background: 'radial-gradient(circle, #FFD98A55, transparent 64%)' }} />
      <span style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(8px)', width: 560, height: 560, bottom: -200, right: -160, background: 'radial-gradient(circle, #FFC15e4d, transparent 64%)' }} />
    </div>
  );
}
