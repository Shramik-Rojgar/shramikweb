import React, { useState } from 'react';
import BackgroundOrbs from './bg';
import Header from './Header';
import Footer from './Footer';
import { Check, Loader2, Building2, User, ArrowRight, AlertCircle, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { translations } from '../lib/translations';
import { supabase } from '../lib/supabase';
import { uploadFile } from '../lib/storage';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry',
];

export default function HirerSignUpForm({ onNavigate, onBack, language = 'hi', onLanguageChange }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    entityType: 'individual', // 'individual' or 'company'
    gstin: '',
    agreeTerms: false,
  });

  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarName, setAadhaarName] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitStage, setSubmitStage] = useState('');

  const t = translations[language].hirer;
  const L = (hi, en) => language === 'hi' ? hi : en;

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

  const setEntityType = (type) => {
    setFormData(prev => ({
      ...prev,
      entityType: type,
      gstin: type === 'individual' ? '' : prev.gstin,
    }));
    // Clear aadhaar if switching to company
    if (type === 'company') {
      setAadhaarFile(null);
      setAadhaarName('');
    }
    setErrors(prev => ({ ...prev, entityType: '', gstin: '', aadhaar: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.firstName.trim())
      e.firstName = L('पहला नाम आवश्यक है', 'First name is required');
    if (!formData.lastName.trim())
      e.lastName = L('अंतिम नाम आवश्यक है', 'Last name is required');
    if (!formData.mobile.trim())
      e.mobile = L('मोबाइल नंबर आवश्यक है', 'Mobile number is required');
    else if (!/^\d{10}$/.test(formData.mobile))
      e.mobile = L('कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें', 'Please enter a valid 10-digit mobile number');
    if (!formData.email.trim())
      e.email = L('ईमेल आवश्यक है', 'Email is required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = L('कृपया वैध ईमेल दर्ज करें', 'Please enter a valid email address');
    if (!formData.address.trim())
      e.address = L('पता आवश्यक है', 'Address is required');
    if (!formData.city.trim())
      e.city = L('शहर आवश्यक है', 'City is required');
    if (!formData.state.trim())
      e.state = L('राज्य आवश्यक है', 'State is required');
    if (formData.entityType === 'company' && !formData.gstin.trim())
      e.gstin = L('GSTIN आवश्यक है', 'GSTIN is required');
    else if (formData.entityType === 'company' && formData.gstin.trim() && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(formData.gstin.trim().toUpperCase()))
      e.gstin = L('कृपया वैध GSTIN दर्ज करें', 'Please enter a valid GSTIN');
    if (formData.entityType === 'individual' && !aadhaarFile)
      e.aadhaar = L('आधार कार्ड अपलोड करना अनिवार्य है', 'Aadhaar card upload is required');
    if (!formData.agreeTerms)
      e.agreeTerms = L('आपको शर्तों से सहमत होना होगा', 'You must agree to the terms');
    return e;
  };

  const handleHirerSubmit = async (e) => {
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
      const phone = formData.mobile.trim();

      // 1. Upload Aadhaar
      setSubmitStage(L('आधार अपलोड हो रहा है…', 'Uploading Aadhaar…'));
      const aadhaarUrl = await uploadFile(aadhaarFile, 'hireraadhaar', phone);

      // 2. Insert hirer record
      setSubmitStage(L('प्रोफ़ाइल सहेज रहे हैं…', 'Saving profile…'));
      const { error: insertError } = await supabase
        .from('hirers')
        .insert({
          first_name:   formData.firstName.trim(),
          last_name:    formData.lastName.trim(),
          mobile_no:    phone,
          email:        formData.email.trim().toLowerCase(),
          address:      formData.address.trim(),
          city:         formData.city.trim(),
          state:        formData.state.trim(),
          entity_type:  formData.entityType,
          gstin:        formData.entityType === 'company' ? formData.gstin.trim().toUpperCase() : null,
          aadhaar_url:  aadhaarUrl,
          status:       'pending',
        });

      if (insertError) {
        if (insertError.code === '23505' && insertError.message.includes('mobile_no')) {
          throw new Error(L(
            'यह मोबाइल नंबर पहले से पंजीकृत है।',
            'This mobile number is already registered.'
          ));
        }
        throw new Error(insertError.message);
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
        <Footer theme="light" />
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

            {/* ── Address ────────────────────────────────── */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.address}</Label>
              <textarea
                name="address"
                placeholder={L('पूरा पता दर्ज करें', 'Enter full address')}
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className={`glass-input border rounded-xl px-4 py-3 focus:outline-none resize-none text-sm font-semibold ${errors.address ? 'border-red-400' : ''}`}
                style={{ fontFamily: 'var(--body)' }}
              />
              {errors.address && <span className="text-xs text-red-500">{errors.address}</span>}
            </div>

            {/* ── City + State ────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.city}</Label>
                <Input
                  type="text"
                  name="city"
                  placeholder={L('जैसे: गुरुग्राम', 'e.g. Gurugram')}
                  value={formData.city}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.city ? 'border-red-400' : ''}`}
                />
                {errors.city && <span className="text-xs text-red-500">{errors.city}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.state}</Label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 focus:outline-none bg-white/85 text-sm font-semibold cursor-pointer ${errors.state ? 'border-red-400' : ''}`}
                >
                  <option value="">{L('राज्य चुनें', 'Select State')}</option>
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <span className="text-xs text-red-500">{errors.state}</span>}
              </div>
            </div>

            {/* ── Entity Type ────────────────────────────── */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.entityType}</Label>
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setEntityType('individual')}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    formData.entityType === 'individual'
                      ? 'border-[var(--accent)] bg-[rgba(201,29,94,0.06)] text-[var(--accent)] shadow-sm'
                      : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <User className="w-4.5 h-4.5" />
                  <span>{t.entityIndividual}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEntityType('company')}
                  className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${
                    formData.entityType === 'company'
                      ? 'border-[var(--accent)] bg-[rgba(201,29,94,0.06)] text-[var(--accent)] shadow-sm'
                      : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Building2 className="w-4.5 h-4.5" />
                  <span>{t.entityCompany}</span>
                </button>
              </div>
            </div>

            {/* ── GSTIN (conditional — only for Company) ── */}
            {formData.entityType === 'company' && (
              <div className="flex flex-col gap-1.5 animate-[fadeSlideIn_0.3s_ease-out]">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.gstin}</Label>
                <Input
                  type="text"
                  name="gstin"
                  placeholder={L('जैसे: 22AAAAA0000A1Z5', 'e.g. 22AAAAA0000A1Z5')}
                  value={formData.gstin}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                    setFormData(prev => ({ ...prev, gstin: val }));
                    if (errors.gstin) setErrors(prev => ({ ...prev, gstin: '' }));
                  }}
                  maxLength={15}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none font-mono tracking-wider ${errors.gstin ? 'border-red-400' : ''}`}
                />
                <p className="text-[10px] text-slate-400 font-semibold">{L('15-अंकों का GSTIN नंबर', '15-character GSTIN number')}</p>
                {errors.gstin && <span className="text-xs text-red-500">{errors.gstin}</span>}
              </div>
            )}

            {/* ── Aadhaar Card Upload (Individual only) ──── */}
            {formData.entityType === 'individual' && (
            <div className="flex flex-col gap-2 animate-[fadeSlideIn_0.3s_ease-out]">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {L('आधार कार्ड अपलोड करें', 'Upload Aadhaar Card')}
              </Label>
              <div className="flex items-center gap-4 mt-1">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center flex-shrink-0 transition-all ${
                  aadhaarFile
                    ? 'bg-[#E4F7EC] border-[#16B364]/30'
                    : 'bg-slate-100 border-[#DDE3EA]'
                }`}>
                  {aadhaarFile
                    ? <Check className="w-6 h-6 text-[#16B364] stroke-[3]" />
                    : <FileText className="w-6 h-6 text-slate-400" />
                  }
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    id="aadhaar-input"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setAadhaarFile(file);
                      setAadhaarName(file.name);
                      if (errors.aadhaar) setErrors(prev => ({ ...prev, aadhaar: '' }));
                    }}
                  />
                  <label
                    htmlFor="aadhaar-input"
                    className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300/60 cursor-pointer transition-all text-xs md:text-sm"
                  >
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>{L('आधार अपलोड करें', 'Upload Aadhaar')}</span>
                  </label>
                  {aadhaarName && (
                    <p className="text-[10px] text-slate-500 mt-1.5 font-semibold truncate max-w-[220px]">{aadhaarName}</p>
                  )}
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">
                    {L('आधार कार्ड — JPG/PNG/PDF', 'Aadhaar Card — JPG/PNG/PDF')}
                  </p>
                  {errors.aadhaar && <span className="text-xs text-red-500 block mt-1">{errors.aadhaar}</span>}
                </div>
              </div>
            </div>
            )}

            {/* ── Terms of Service Checkbox ───────────────── */}
            <div className="flex gap-3.5 items-start mt-2">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ ...prev, agreeTerms: checked === true }));
                  if (errors.agreeTerms) {
                    setErrors(prev => ({ ...prev, agreeTerms: '' }));
                  }
                }}
                className="mt-0.5 border-slate-300 data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=checked]:text-white cursor-pointer"
              />
              <div className="flex flex-col text-left">
                <Label htmlFor="agreeTerms" className="text-xs text-[#5B6B7B] cursor-pointer font-semibold leading-relaxed">
                  {t.agreeTerms}
                </Label>
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
      <Footer theme="light" />
    </div>
  );
}
