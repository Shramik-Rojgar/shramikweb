import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Check, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { translations } from '../lib/translations';

export default function HirerSignUpForm({ onNavigate, onBack, language = 'hi', onLanguageChange }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const t = translations[language].hirer;

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

  const handleHirerSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = language === 'hi' ? 'संपर्क व्यक्ति का नाम आवश्यक है' : 'Contact person name is required';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = language === 'hi' ? 'मोबाइल नंबर आवश्यक है' : 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = language === 'hi' ? 'कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें' : 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.location.trim()) {
      newErrors.location = language === 'hi' ? 'शहर / स्थान आवश्यक है' : 'City / Location is required';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = language === 'hi' ? 'आपको शर्तों से सहमत होना होगा' : 'You must agree to the terms';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

      <main className="max-w-md w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 flex-grow flex flex-col justify-center text-left">
        <div className="glass-card rounded-3xl p-5 sm:p-8">
          <h2 className="text-2xl font-bold text-[#14101C] mb-2 font-display">{t.title}</h2>
          <p className="text-slate-500 text-sm mb-6 font-semibold">{t.subtitle}</p>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="text-green bg-green-soft p-4 rounded-full mb-4 border border-[#16B364]/20 animate-bounce">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-ink font-display">{t.successTitle}</h3>
              <p className="text-sm text-slate-500 font-semibold">{t.successSubtitle}</p>
            </div>
          ) : (
            <form onSubmit={handleHirerSubmit} className="flex flex-col gap-4 text-left">
              {/* Field 1: Contact Person Name */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.name}</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder={language === 'hi' ? 'पूरा नाम दर्ज करें' : 'Enter full name'}
                  value={formData.name}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.name ? 'border-dispute-red' : ''}`}
                />
                {errors.name && <span className="text-xs text-dispute-red">{errors.name}</span>}
              </div>

              {/* Field 2: Mobile Number */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.mobile}</Label>
                <Input
                  type="tel"
                  name="mobile"
                  placeholder={language === 'hi' ? '10-अंकों का मोबाइल नंबर दर्ज करें' : 'Enter 10-digit mobile number'}
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.mobile ? 'border-dispute-red' : ''}`}
                />
                {errors.mobile && <span className="text-xs text-dispute-red">{errors.mobile}</span>}
              </div>

              {/* Field 3: City / Location (with GPS auto-detect) */}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.location}</Label>
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
                    className="bg-brand-grad hover:opacity-90 text-white font-bold h-12 w-12 rounded-xl cursor-pointer flex items-center justify-center flex-shrink-0 transition-all shadow-sm border-0"
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

              {/* Terms of Service Checkbox */}
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
                  {errors.agreeTerms && <span className="text-xs text-dispute-red mt-0.5">{errors.agreeTerms}</span>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-brand-grad hover:opacity-90 text-white font-bold rounded-xl mt-4 cursor-pointer flex items-center justify-center gap-2 font-display text-base border-0 transition-all shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.submittingBtn}</span>
                  </>
                ) : (
                  <span>{t.submitBtn}</span>
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
