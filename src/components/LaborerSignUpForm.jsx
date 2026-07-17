import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackgroundOrbs from './bg';
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
  PhoneCall,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { translations } from '../lib/translations';
import { supabase } from '../lib/supabase';
import { uploadFile, validateImageFile, validateDocFile } from '../lib/storage';
import { usePageMeta } from '../lib/usePageMeta';

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
  more:      'M12 5h.01 M12 12h.01 M12 19h.01',
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
  { key: 'Others',       ic: 'more',    hi: 'अन्य',               en: 'Others' },
];

// Experience: 1–15 + 15+ (DB stores the number string, display adds Year/Years)
const EXPERIENCE_OPTIONS = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: String(i + 1),
    label: `${i + 1} ${i === 0 ? 'Year' : 'Years'}`,
  })),
  { id: '15+', label: '15+ Years' },
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
    skills:      [],
    experience:  '',
    dailyWage:   600,
    city:        '',
    state:       '',
  });

  const [otherSkill,   setOtherSkill]   = useState('');
  const [wageInput,    setWageInput]    = useState('600');

  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [govIdFile,    setGovIdFile]    = useState(null);
  const [govIdName,    setGovIdName]    = useState('');

  const [errors,       setErrors]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage,  setSubmitStage]  = useState('');
  const [isSuccess,    setIsSuccess]    = useState(false);
  const [isDuplicate,  setIsDuplicate]  = useState(false);

  // Client-side rate limiting: one submission per 30 seconds
  const lastSubmitAt = React.useRef(0);

  const t = translations[language].laborer;
  const L = (hi, en) => language === 'hi' ? hi : en;

  usePageMeta({
    title: 'Worker Registration | Shramik — Find Daily Wage Jobs',
    description: 'Register as a skilled worker on Shramik. Get verified, find daily wage jobs near you as a mason, carpenter, plumber, electrician, painter, welder and more.',
    keywords: 'worker registration shramik, daily wage jobs, skilled labour registration, mason jobs, carpenter jobs, plumber jobs, electrician jobs india, construction work near me',
  });

  const othersSelected = formData.skills.includes('Others');

  // ── Field helpers ────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      validateImageFile(file);
    } catch (err) {
      setErrors(p => ({ ...p, photo: err.message }));
      e.target.value = '';
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    if (errors.photo) setErrors(p => ({ ...p, photo: '' }));
  };

  const handleGovIdChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      validateDocFile(file);
    } catch (err) {
      setErrors(p => ({ ...p, govId: err.message }));
      e.target.value = '';
      return;
    }
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
      if (key === 'Others' && exists) setOtherSkill('');
      setErrors(e => ({ ...e, skills: '' }));
      return { ...p, skills };
    });
  };

  // Wage stepper — keep input in sync
  const adjustRate = (amount) => {
    setFormData(p => {
      const next = Math.max(300, p.dailyWage + amount);
      setWageInput(String(next));
      return { ...p, dailyWage: next };
    });
  };

  const handleWageInput = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setWageInput(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) setFormData(p => ({ ...p, dailyWage: num }));
  };

  const handleWageBlur = () => {
    const num = Math.max(300, parseInt(wageInput, 10) || 300);
    setFormData(p => ({ ...p, dailyWage: num }));
    setWageInput(String(num));
  };

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const e = {};
    const name = formData.name.trim();
    if (!name)
      e.name = L('पूरा नाम आवश्यक है', 'Full name is required');
    else if (name.length > 100)
      e.name = L('नाम बहुत लंबा है', 'Name is too long');

    if (!formData.phone.trim())
      e.phone = L('मोबाइल नंबर आवश्यक है', 'Mobile number is required');
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      e.phone = L('वैध भारतीय मोबाइल नंबर दर्ज करें', 'Enter a valid Indian mobile number');

    if (!formData.dob) {
      e.dob = L('जन्म तिथि आवश्यक है', 'Date of birth is required');
    } else {
      const today = new Date();
      const dob   = new Date(formData.dob);
      const age   = today.getFullYear() - dob.getFullYear() -
        (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
      if (age < 18)
        e.dob = L('आपकी आयु कम से कम 18 वर्ष होनी चाहिए', 'You must be at least 18 years old');
      if (age > 80)
        e.dob = L('कृपया सही जन्म तिथि दर्ज करें', 'Please enter a valid date of birth');
    }

    if (!formData.gender)       e.gender     = L('लिंग चुनें', 'Select gender');
    if (!photoFile)             e.photo      = L('प्रोफ़ाइल फ़ोटो अनिवार्य है', 'Profile photo is required');
    if (!govIdFile)             e.govId      = L('सरकारी ID अनिवार्य है', 'Government ID is required');
    if (formData.skills.length === 0)
                                e.skills     = L('कम से कम एक हुनर चुनें', 'Select at least one skill');
    if (othersSelected && !otherSkill.trim())
                                e.otherSkill = L('कृपया अपना हुनर लिखें', 'Please enter your skill');
    else if (othersSelected && otherSkill.trim().length > 50)
                                e.otherSkill = L('हुनर का नाम बहुत लंबा है', 'Skill name is too long');
    if (!formData.experience)   e.experience = L('अनुभव चुनें', 'Select experience level');
    if (!formData.city.trim())  e.city       = L('शहर आवश्यक है', 'City is required');
    else if (formData.city.trim().length > 100)
                                e.city       = L('शहर का नाम बहुत लंबा है', 'City name is too long');
    if (!formData.state.trim()) e.state      = L('राज्य आवश्यक है', 'State is required');
    if (formData.dailyWage > 50000)
                                e.wage       = L('कृपया वास्तविक दैनिक मजदूरी दर्ज करें', 'Please enter a realistic daily wage');
    return e;
  };

  // Resolve actual skill values (replace 'Others' with the typed value)
  const resolveSkills = () => formData.skills.map(k => k === 'Others' ? otherSkill.trim() : k);

  // ── Submit ───────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitAt.current < 30_000) {
      setErrors({ submit: L('कृपया दोबारा कोशिश करने से पहले 30 सेकंड प्रतीक्षा करें।', 'Please wait 30 seconds before trying again.') });
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    lastSubmitAt.current = now;
    setIsSubmitting(true);
    setErrors({});

    try {
      const phone = formData.phone.trim();
      const [skill1, skill2, skill3] = resolveSkills();

      // 0. Pre-check for duplicate mobile before uploading anything
      setSubmitStage(L('जाँच हो रही है…', 'Checking…'));
      const { data: existing } = await supabase
        .from('labourers')
        .select('id')
        .eq('mobile_no', phone)
        .limit(1);

      if (existing && existing.length > 0) {
        setIsDuplicate(true);
        return;
      }

      setSubmitStage(L('फ़ोटो अपलोड हो रही है…', 'Uploading photo…'));
      const photoPath = await uploadFile(photoFile, 'laborprofile');

      setSubmitStage(L('सरकारी ID अपलोड हो रही है…', 'Uploading government ID…'));
      const govIdPath = await uploadFile(govIdFile, 'laborgovid');

      setSubmitStage(L('प्रोफ़ाइल सहेज रहे हैं…', 'Saving profile…'));
      const { error: insertError } = await supabase
        .from('labourers')
        .insert({
          full_name:          formData.name.trim().slice(0, 100),
          mobile_no:          phone,
          date_of_birth:      formData.dob,
          gender:             formData.gender,
          skill_1:            skill1?.slice(0, 50),
          skill_2:            skill2?.slice(0, 50) ?? null,
          skill_3:            skill3?.slice(0, 50) ?? null,
          experience_level:   formData.experience,
          daily_wage:         Math.min(Math.max(300, formData.dailyWage), 50000),
          city:               formData.city.trim().slice(0, 100),
          state:              formData.state.trim().slice(0, 100),
          status:             'pending',
          photo_url:          photoPath,
          government_id_url:  govIdPath,
        });

      if (insertError) {
        if (insertError.code === '23505' && insertError.message.includes('mobile_no')) {
          setIsDuplicate(true);
          return;
        }
        throw new Error(insertError.message);
      }

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

  // ── Already registered card ──────────────────────────────
  if (isDuplicate) {
    return (
      <div className="min-h-screen text-[#1C2733] font-sans flex flex-col justify-between">
        <Header theme="light" onNavigate={onNavigate} onBack={onBack} language={language} onLanguageChange={onLanguageChange} />
        <BackgroundOrbs />
        <main className="flex-grow flex items-center justify-center px-6">
          <div
            className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center gap-5"
            style={{
              background: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.78)',
              boxShadow: '0 16px 48px rgba(20,16,28,0.08)',
            }}
          >
            {/* Icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#FF8A1E 0%,#E5397B 100%)' }}
            >
              <ShieldCheck size={28} color="#fff" strokeWidth={2} />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2">
              <h2 className="font-display font-black text-xl text-[var(--ink)]">
                {L('आप पहले से पंजीकृत हैं!', 'Already Registered!')}
              </h2>
              <p className="text-sm font-semibold text-[var(--mut)] leading-relaxed">
                {L(
                  'आपका मोबाइल नंबर पहले से हमारे सिस्टम में है। आपका आवेदन समीक्षाधीन है — हम जल्द ही आपको सूचित करेंगे।',
                  'Your mobile number is already in our system. Your application is under review — we\'ll notify you shortly.'
                )}
              </p>
            </div>

            {/* Status pill */}
            <div className="flex items-center gap-2 bg-[rgba(255,138,30,0.10)] border border-[rgba(255,138,30,0.2)] rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8A1E] animate-pulse inline-block" />
              <span className="text-xs font-bold text-[#FF8A1E] uppercase tracking-wider">
                {L('समीक्षाधीन', 'Under Review')}
              </span>
            </div>

            {/* Support note */}
            <div className="flex items-center gap-2.5 text-[var(--mut)]">
              <PhoneCall size={14} strokeWidth={2} />
              <p className="text-xs font-semibold">
                {L('सहायता के लिए हमसे संपर्क करें', 'Contact us for support')}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 w-full mt-1">
              <button
                onClick={() => onNavigate('home')}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm cursor-pointer transition-opacity hover:opacity-90"
                style={{ background: 'var(--grad)' }}
              >
                {L('होम पर जाएं', 'Go to Home')}
              </button>
              <button
                onClick={() => setIsDuplicate(false)}
                className="w-full py-3 rounded-2xl text-[var(--mut)] font-semibold text-sm cursor-pointer transition-colors hover:text-[var(--ink)]"
                style={{ background: 'rgba(20,16,28,0.04)', border: '1px solid rgba(20,16,28,0.08)' }}
              >
                {L('वापस जाएं', 'Go Back')}
              </button>
            </div>
          </div>
        </main>
        <Footer theme="light" onNavigate={onNavigate} />
      </div>
    );
  }

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
        <Footer theme="light" onNavigate={onNavigate} />
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
              {/* Others text input */}
              {othersSelected && (
                <div className="mt-3">
                  <Input
                    type="text"
                    value={otherSkill}
                    onChange={e => { setOtherSkill(e.target.value); setErrors(p => ({ ...p, otherSkill: '' })); }}
                    placeholder={L('अपना हुनर लिखें (जैसे: Scaffolding)', 'Enter your skill (e.g. Scaffolding)')}
                    className={`glass-input h-11 border rounded-xl px-4 focus:outline-none text-sm ${errors.otherSkill ? 'border-red-400' : ''}`}
                  />
                  {errors.otherSkill && <span className="text-xs text-red-500 mt-1 block">{errors.otherSkill}</span>}
                </div>
              )}
              {errors.skills && <span className="text-xs text-red-500 mt-1">{errors.skills}</span>}
            </div>

            {/* ── Experience ─────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.experienceLevel}</Label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className={`glass-input h-12 border rounded-xl px-4 focus:outline-none bg-white/85 text-sm font-semibold cursor-pointer ${errors.experience ? 'border-red-400' : ''}`}
              >
                <option value="">{L('अनुभव चुनें', 'Select Experience')}</option>
                {EXPERIENCE_OPTIONS.map(exp => (
                  <option key={exp.id} value={exp.id}>{exp.label}</option>
                ))}
              </select>
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
                <div className="min-w-32 flex flex-col items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-xl font-black text-ink font-display">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={wageInput}
                      onChange={handleWageInput}
                      onBlur={handleWageBlur}
                      className="w-20 text-center text-2xl font-black text-ink font-display bg-transparent border-none outline-none"
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold">{t.wagePerDay}</span>
                </div>
                <Button type="button" onClick={() => adjustRate(50)} variant="outline" size="icon"
                  className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center border border-slate-200 cursor-pointer"
                  aria-label="Increase"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </Button>
              </div>
            </div>

            {/* ── City + State ───────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {L('शहर', 'City')}
                </Label>
                <Input type="text" name="city" value={formData.city} onChange={handleChange}
                  placeholder={L('जैसे: गुरुग्राम', 'e.g. Gurugram')}
                  className={`glass-input h-12 border rounded-xl px-4 focus:outline-none ${errors.city ? 'border-red-400' : ''}`}
                />
                {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {L('राज्य', 'State')}
                </Label>
                <Input type="text" name="state" value={formData.state} onChange={handleChange}
                  placeholder={L('जैसे: हरियाणा', 'e.g. Haryana')}
                  className={`glass-input h-12 border rounded-xl px-4 focus:outline-none ${errors.state ? 'border-red-400' : ''}`}
                />
                {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
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
      <Footer theme="light" onNavigate={onNavigate} />
    </div>
  );
}
