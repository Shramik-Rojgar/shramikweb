import React, { useState } from 'react';
import BackgroundOrbs from './bg';
import Header from './Header';
import Footer from './Footer';
import { Check, Loader2, ArrowRight, AlertCircle, ShieldCheck, PhoneCall, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { translations } from '../lib/translations';

import { usePageMeta } from '../lib/usePageMeta';

export default function HirerSignUpForm({ onNavigate, onBack, language = 'hi', onLanguageChange }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    password: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [submitStage, setSubmitStage] = useState('');

  const lastSubmitAt = React.useRef(0);

  const t = translations[language].hirer;
  const L = (hi, en) => language === 'hi' ? hi : en;

  usePageMeta({
    title: 'Hire Verified Workers | Shramik — Post Jobs, Find Labour',
    description: 'Register as a hirer on Shramik to find verified, skilled blue-collar workers for construction, home services and more. Trusted by contractors and builders across India.',
    keywords: 'hire labour india, find workers india, contractor registration shramik, hire mason carpenter plumber, construction workers, blue collar hiring platform india',
  });

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



  const validate = () => {
    const e = {};
    if (!formData.firstName.trim())
      e.firstName = L('पहला नाम आवश्यक है', 'First name is required');
    else if (formData.firstName.trim().length > 50)
      e.firstName = L('नाम बहुत लंबा है', 'First name is too long');
    if (!formData.lastName.trim())
      e.lastName = L('अंतिम नाम आवश्यक है', 'Last name is required');
    else if (formData.lastName.trim().length > 50)
      e.lastName = L('नाम बहुत लंबा है', 'Last name is too long');
    if (!formData.mobile.trim())
      e.mobile = L('मोबाइल नंबर आवश्यक है', 'Mobile number is required');
    else if (!/^[6-9]\d{9}$/.test(formData.mobile))
      e.mobile = L('वैध भारतीय मोबाइल नंबर दर्ज करें', 'Enter a valid Indian mobile number');
    if (!formData.email.trim())
      e.email = L('ईमेल आवश्यक है', 'Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(formData.email))
      e.email = L('कृपया वैध ईमेल दर्ज करें', 'Please enter a valid email address');
    else if (formData.email.length > 254)
      e.email = L('ईमेल बहुत लंबा है', 'Email is too long');
    if (!formData.password)
      e.password = L('पासवर्ड आवश्यक है', 'Password is required');
    else if (formData.password.length < 8)
      e.password = L('पासवर्ड कम से कम 8 अक्षरों का होना चाहिए', 'Password must be at least 8 characters');
    else if (!/[A-Z]/.test(formData.password))
      e.password = L('कम से कम एक बड़ा अक्षर चाहिए', 'Must contain at least one uppercase letter');
    else if (!/[0-9]/.test(formData.password))
      e.password = L('कम से कम एक अंक चाहिए', 'Must contain at least one number');
    else if (!/[^A-Za-z0-9]/.test(formData.password))
      e.password = L('कम से कम एक विशेष अक्षर चाहिए (जैसे @, #, !)', 'Must contain at least one special character (e.g. @, #, !)');

    if (!formData.agreeTerms)
      e.agreeTerms = L('आपको शर्तों से सहमत होना होगा', 'You must agree to the terms');
    return e;
  };

  const handleHirerSubmit = async (e) => {
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
      const phone = formData.mobile.trim();
      const email = formData.email.trim().toLowerCase();

      setSubmitStage(L('खाता बना रहे हैं…', 'Creating account…'));

      const res = await fetch('https://kpkmrcieprtwnzjtftki.supabase.co/functions/v1/hirer-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName.trim().slice(0, 50),
          last_name: formData.lastName.trim().slice(0, 50),
          mobile_no: phone,
          email,
          password: formData.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        // 409 = duplicate (email or mobile already registered)
        if (res.status === 409) {
          setIsDuplicate(true);
          return;
        }
        throw new Error(result.error || L('कुछ गलत हो गया।', 'Something went wrong.'));
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onNavigate('home');
      }, 2500);
    } catch (err) {
      setErrors({ submit: err.message || L('कुछ गलत हो गया। दोबारा कोशिश करें।', 'Something went wrong. Please try again.') });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
      setSubmitStage('');
    }
  };

  // ── Duplicate card ───────────────────────────────────────
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
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#FF8A1E 0%,#E5397B 100%)' }}
            >
              <ShieldCheck size={28} color="#fff" strokeWidth={2} />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-display font-black text-xl text-[var(--ink)]">
                {L('आप पहले से पंजीकृत हैं!', 'Already Registered!')}
              </h2>
              <p className="text-sm font-semibold text-[var(--mut)] leading-relaxed">
                {L(
                  'आपका मोबाइल नंबर या ईमेल पहले से हमारे सिस्टम में है। आपका आवेदन समीक्षाधीन है — हम जल्द ही आपको सूचित करेंगे।',
                  'Your mobile number or email is already in our system. Your application is under review — we\'ll notify you shortly.'
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[rgba(255,138,30,0.10)] border border-[rgba(255,138,30,0.2)] rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-[#FF8A1E] animate-pulse inline-block" />
              <span className="text-xs font-bold text-[#FF8A1E] uppercase tracking-wider">
                {L('समीक्षाधीन', 'Under Review')}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[var(--mut)]">
              <PhoneCall size={14} strokeWidth={2} />
              <p className="text-xs font-semibold">
                {L('सहायता के लिए हमसे संपर्क करें', 'Contact us for support')}
              </p>
            </div>

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

  // ── Success State ─────────────────────────────────────────
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

  // ── Form ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-[#1C2733] font-sans flex flex-col justify-between">
      <BackgroundOrbs />
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

          {/* Global submit error */}
          {errors.submit && (
            <div className="flex items-start gap-3 bg-[rgba(201,29,94,0.08)] border border-[rgba(201,29,94,0.2)] rounded-2xl px-4 py-3 mb-6">
              <AlertCircle size={15} className="text-[var(--accent)] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              <p className="text-xs font-semibold text-[var(--accent)] leading-relaxed">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleHirerSubmit} className="flex flex-col gap-5 text-left">

            {/* ── First Name + Last Name ──────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.firstName}</Label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder={L('पहला नाम दर्ज करें', 'Enter first name')}
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.firstName ? 'border-red-400' : ''}`}
                />
                {errors.firstName && <span className="text-xs text-red-500">{errors.firstName}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.lastName}</Label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder={L('अंतिम नाम दर्ज करें', 'Enter last name')}
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.lastName ? 'border-red-400' : ''}`}
                />
                {errors.lastName && <span className="text-xs text-red-500">{errors.lastName}</span>}
              </div>
            </div>

            {/* ── Mobile Number ───────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.mobile}</Label>
              <Input
                type="tel"
                name="mobile"
                placeholder={L('10-अंकों का मोबाइल नंबर दर्ज करें', 'Enter 10-digit mobile number')}
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.mobile ? 'border-red-400' : ''}`}
              />
              {errors.mobile && <span className="text-xs text-red-500">{errors.mobile}</span>}
            </div>

            {/* ── Email ───────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.email}</Label>
              <Input
                type="email"
                name="email"
                placeholder={L('ईमेल दर्ज करें', 'Enter email address')}
                value={formData.email}
                onChange={handleChange}
                className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.email ? 'border-red-400' : ''}`}
              />
              {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
            </div>

            {/* ── Password ─────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {L('पासवर्ड', 'Password')}
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={L('पासवर्ड बनाएं', 'Create a password')}
                  value={formData.password}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 pr-12 focus:outline-none ${errors.password ? 'border-red-400' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold">
                {L('कम से कम 8 अक्षर, 1 बड़ा अक्षर, 1 अंक, 1 विशेष अक्षर', 'Min 8 chars, 1 uppercase, 1 number, 1 special char')}
              </p>
              {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
            </div>
            {/* ── Terms of Service Checkbox ───────────────── */}
            <div className="flex gap-3.5 items-start mt-2">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded cursor-pointer accent-[var(--accent)]"
              />
              <div className="flex flex-col text-left">
                <label htmlFor="agreeTerms" className="text-xs text-[#5B6B7B] cursor-pointer font-semibold leading-relaxed select-none">
                  {t.agreeTerms}
                </label>
                {errors.agreeTerms && <span className="text-xs text-red-500 mt-0.5">{errors.agreeTerms}</span>}
              </div>
            </div>

            {/* ── Submit Button ───────────────────────────── */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-brand-grad hover:opacity-90 text-white font-bold rounded-2xl mt-4 cursor-pointer flex items-center justify-center gap-2 font-display text-lg shadow-md transition-all border-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{submitStage || t.submittingBtn}</span>
                </>
              ) : (
                <>
                  <span>{t.submitBtn}</span>
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
