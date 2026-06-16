import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { 
  HardHat, 
  Check, 
  Wallet, 
  ShieldCheck, 
  Lock, 
  Clock, 
  ArrowRight, 
  Camera, 
  MapPin, 
  Plus, 
  Minus, 
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { translations } from '../lib/translations';

// Icon paths
const I = {
  plus: 'M12 5v14 M5 12h14',
  people: 'M9 11a3 3 0 100-6 3 3 0 000 6z M2 20c.6-3 2.8-4.6 6-4.6 1 0 1.9.15 2.7.45 M16 11a3 3 0 100-6 M14.5 15.4c2.6.2 4.4 1.8 4.9 4.6',
  brick: 'M4 7h16v5H4z M4 12h16v5H4z M9 7v5 M14 12v5',
  roller: 'M5 5h12v5H5z M17 7h2.5v4H12v4 M12 15v5',
  bolt: 'M13 3L6 13.5h5L10 21l7-10.5h-5l1-7.5z',
  droplet: 'M12 4c3 4 6 6.8 6 10a6 6 0 11-12 0c0-3.2 3-6 6-10z',
  hammer: 'M14 6l4 4 M11.5 8.5l4 4-6.5 6.5-4-4 6.5-6.5z M13 4.5l6.5 6.5',
  welder: 'M12 2v3 M12 19v3 M3 12h3 M18 12h3 M5.5 5.5l2 2 M16.5 16.5l2 2 M16.5 7.5l2-2 M5.5 18.5l2-2',
  rebar: 'M4 5h16 M4 12h16 M4 19h16 M9 4v16 M15 4v16',
  tile: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  hardhat: 'M3 18h18 M5 18v-2a7 7 0 0114 0v2 M10 8.5V5.5h4v3',
  home: 'M4 11l8-7 8 7 M6 10v9h12v-9 M10 19v-5h4v5',
};

function Ic({ d, size = 22, color = 'currentColor', sw = 2, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: 'block' }}>
      <path d={d} fill={fill} stroke={fill === 'none' ? color : 'none'} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const SKILLS = [
  { key: 'mistri',      ic: 'brick',   hi: 'मिस्त्री',       en: 'Mason' },
  { key: 'carpenter',   ic: 'hammer',  hi: 'बढ़ई',          en: 'Carpenter' },
  { key: 'painter',     ic: 'roller',  hi: 'पेंटर',         en: 'Painter' },
  { key: 'welder',      ic: 'welder',  hi: 'वेल्डर',        en: 'Welder' },
  { key: 'plumber',     ic: 'droplet', hi: 'नलसाज',         en: 'Plumber' },
  { key: 'electrician', ic: 'bolt',    hi: 'बिजली मिस्त्री', en: 'Electrician' },
  { key: 'rebar',       ic: 'rebar',   hi: 'सरिया',         en: 'Bar bender' },
  { key: 'tiler',       ic: 'tile',    hi: 'टाइल',          en: 'Tiler' },
  { key: 'consthelper', ic: 'hardhat', hi: 'निर्माण सहायक',  en: 'Site helper' },
  { key: 'labour',      ic: 'people',  hi: 'मजदूर',         en: 'Labourer' },
  { key: 'domestic',    ic: 'home',    hi: 'घरेलू सहायक',    en: 'Domestic help' },
];

const experienceOptions = [
  { id: '0-1', label: '0-1 year (Beldaar)' },
  { id: '1-3', label: '1-3 years (Helper)' },
  { id: '3-5', label: '3-5 years (Mistri)' },
  { id: '5+', label: '5+ years (Thekedar)' }
];

export default function LaborerSignUpForm({ onNavigate, onBack, language = 'hi', onLanguageChange }) {
  const [formData, setFormData] = useState({
    name: '',
    skills: [],
    experience: '',
    dailyRate: 600,
    location: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const t = translations[language].laborer;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      if (errors.photo) {
        setErrors(prev => ({ ...prev, photo: '' }));
      }
    }
  };

  const toggleSkill = (skillId) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skillId);
      if (!exists && prev.skills.length >= 3) {
        setErrors(err => ({ ...err, skills: language === 'hi' ? 'आप अधिकतम ३ हुनर ही चुन सकते हैं' : 'You can select up to 3 skills' }));
        return prev;
      }
      const skills = exists
        ? prev.skills.filter(id => id !== skillId)
        : [...prev.skills, skillId];
      
      setErrors(err => ({ ...err, skills: '' }));
      return { ...prev, skills };
    });
  };

  const adjustRate = (amount) => {
    setFormData(prev => ({
      ...prev,
      dailyRate: Math.max(300, prev.dailyRate + amount)
    }));
  };

  const detectLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            const detectedLoc = language === 'hi' ? 'गुरुग्राम, हरियाणा (GPS द्वारा)' : 'Gurugram, Haryana (GPS Detected)';
            setFormData(prev => ({ ...prev, location: detectedLoc }));
            setIsLocating(false);
            if (errors.location) {
              setErrors(prev => ({ ...prev, location: '' }));
            }
          }, 1200);
        },
        (error) => {
          setTimeout(() => {
            const fallbackLoc = language === 'hi' ? 'नई दिल्ली, दिल्ली' : 'New Delhi, Delhi';
            setFormData(prev => ({ ...prev, location: fallbackLoc }));
            setIsLocating(false);
            if (errors.location) {
              setErrors(prev => ({ ...prev, location: '' }));
            }
          }, 1000);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleLaborerSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = language === 'hi' ? 'पूरा नाम आवश्यक है' : 'Full name is required';
    }
    if (!photoPreview) {
      newErrors.photo = language === 'hi' ? 'प्रोफ़ाइल फ़ोटो आवश्यक है' : 'Profile photo is required';
    }
    if (formData.skills.length === 0) {
      newErrors.skills = language === 'hi' ? 'कम से कम एक मुख्य हुनर चुनें' : 'Select at least one primary skill';
    }
    if (!formData.experience) {
      newErrors.experience = language === 'hi' ? 'अनुभव का स्तर चुनें' : 'Select your experience level';
    }
    if (!formData.location.trim()) {
      newErrors.location = language === 'hi' ? 'काम का स्थान / शहर आवश्यक है' : 'Work location/city is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onNavigate('home');
        }, 2000);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1C2733] font-sans flex flex-col justify-between">
      <Header 
        theme="light" 
        onNavigate={onNavigate} 
        onBack={onBack} 
        language={language}
        onLanguageChange={onLanguageChange}
      />

      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 flex-grow flex flex-col justify-center text-left">
        <div className="glass-card rounded-3xl p-5 sm:p-8 md:p-10">
          <h2 className="text-3xl font-bold text-brand-grad mb-2 font-display">{t.title}</h2>
          <p className="text-slate-500 text-sm mb-8 font-semibold">{t.subtitle}</p>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-green bg-green-soft p-5 rounded-full mb-6 border border-[#16B364]/20 animate-bounce">
                <Check className="w-12 h-12 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-ink font-display">{t.successTitle}</h3>
              <p className="text-base text-slate-500 font-semibold">{t.successSubtitle}</p>
            </div>
          ) : (
            <form onSubmit={handleLaborerSubmit} className="flex flex-col gap-8">
              
              {/* Field 1: Full Name */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.fullName}</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder={language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                  value={formData.name}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.name ? 'border-dispute-red' : ''}`}
                />
                {errors.name && <span className="text-xs text-dispute-red">{errors.name}</span>}
              </div>

              {/* Field 2: Profile Photo (Camera/Upload Mock) */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.profilePhoto}</Label>
                <div className="flex items-center gap-5 mt-1">
                  <div className="relative w-20 h-20 rounded-full bg-slate-100 border border-[#DDE3EA] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} className="w-full h-full object-cover" alt="Profile preview" />
                    ) : (
                      <HardHat className="w-8 h-8 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      id="profile-photo-input" 
                      className="hidden" 
                      onChange={handlePhotoChange}
                    />
                    <label 
                      htmlFor="profile-photo-input"
                      className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300/60 cursor-pointer transition-all duration-200 text-xs md:text-sm"
                    >
                      <Camera className="w-4 h-4 text-slate-500" />
                      <span>{t.photoPrompt}</span>
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">{t.photoSubtext}</p>
                    {errors.photo && <span className="text-xs text-dispute-red block mt-1">{errors.photo}</span>}
                  </div>
                </div>
              </div>

              {/* Field 3: Primary Skill(s) (Tile Selector Grid) */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.primarySkills}</Label>
                <p className="text-[10px] text-slate-400 mb-2 font-semibold">{t.skillsSubtext}</p>
                
                <div className="skill-grid mt-1">
                  {SKILLS.map((sk) => {
                    const on = formData.skills.includes(sk.key);
                    const skLabel = language === 'hi' ? sk.hi : sk.en;
                    return (
                      <button 
                        type="button" 
                        key={sk.key} 
                        className={cn('skill hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer', on ? 'on' : '')} 
                        onClick={() => toggleSkill(sk.key)}
                      >
                        <Ic d={I[sk.ic]} size={21} color="currentColor" sw={2} fill={sk.ic === 'bolt' && on ? 'currentColor' : 'none'} />
                        <span className="lab">{skLabel}</span>
                      </button>
                    );
                  })}
                </div>

                {errors.skills && <span className="text-xs text-dispute-red mt-1">{errors.skills}</span>}
              </div>

              {/* Field 4: Experience Level (Single-Select Chips) */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.experienceLevel}</Label>
                <div className="flex flex-wrap gap-2.5 mt-1">
                  {experienceOptions.map(exp => {
                    const isSelected = formData.experience === exp.id;
                    const expLabel = t.experienceMap[exp.id] || exp.label;
                    return (
                      <button
                        type="button"
                        key={exp.id}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, experience: exp.id }));
                          if (errors.experience) {
                            setErrors(err => ({ ...err, experience: '' }));
                          }
                        }}
                        className={`py-2 px-4 rounded-xl border font-semibold text-xs md:text-sm transition-all duration-150 cursor-pointer ${
                          isSelected 
                            ? 'bg-[#7A3BFF] border-transparent text-white shadow-sm' 
                            : 'glass-chip hover:border-slate-350 text-slate-700'
                        }`}
                      >
                        <span>{expLabel}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.experience && <span className="text-xs text-dispute-red mt-1">{errors.experience}</span>}
              </div>

              {/* Field 5: Expected Daily Rate (Numeric with +/- buttons) */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.expectedWage}</Label>
                <p className="text-[10px] text-slate-400 font-semibold mb-2">{t.wageSubtext}</p>
                
                <div className="flex items-center gap-3 w-fit bg-surface-gray-2/50 border border-slate-200 p-1.5 rounded-2xl">
                    <Button
                      type="button"
                      onClick={() => adjustRate(-50)}
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 cursor-pointer transition-colors"
                      aria-label="Decrease daily rate"
                    >
                      <Minus className="w-4 h-4 stroke-[3]" />
                    </Button>
                    
                    <div className="min-w-28 text-center">
                      <span className="text-2xl font-black text-ink font-display">₹{formData.dailyRate}</span>
                      <span className="block text-[9px] text-slate-400 font-semibold">{t.wagePerDay}</span>
                    </div>

                    <Button
                       type="button"
                       onClick={() => adjustRate(50)}
                       variant="outline"
                       size="icon"
                       className="w-10 h-10 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 border border-slate-200 cursor-pointer transition-colors"
                       aria-label="Increase daily rate"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                    </Button>
                </div>
              </div>

              {/* Field 6: Work Location / City (Autocomplete + GPS) */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.workLocation}</Label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input
                      type="text"
                      name="location"
                      placeholder={t.locationPlaceholder}
                      value={formData.location}
                      onChange={handleChange}
                      className={`glass-input h-12 border rounded-xl pl-4 pr-10 py-3 focus:outline-none ${errors.location ? 'border-dispute-red' : ''}`}
                    />
                    <MapPin className="absolute right-3 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                  
                  <Button
                    type="button"
                    onClick={detectLocation}
                    disabled={isLocating}
                    className="bg-[var(--ink)] hover:opacity-90 text-white font-bold h-12 w-12 rounded-xl cursor-pointer flex items-center justify-center flex-shrink-0 transition-colors shadow-sm border-0"
                    title={language === 'hi' ? 'वर्तमान स्थान का पता लगाएं' : 'Detect current location'}
                  >
                    {isLocating ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                {errors.location && <span className="text-xs text-dispute-red">{errors.location}</span>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-brand-grad hover:opacity-90 text-white font-bold rounded-2xl mt-4 cursor-pointer flex items-center justify-center gap-2 font-display text-lg shadow-md transition-all border-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.submittingProfile}</span>
                  </>
                ) : (
                  <>
                    <span>{t.submitProfile}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer theme="light" />
    </div>
  );
}
