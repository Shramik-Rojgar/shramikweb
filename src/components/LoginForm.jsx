import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { translations } from '../lib/translations';

export default function LoginForm({ onNavigate, onBack, language = 'hi', onLanguageChange }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const t = translations[language].login;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = language === 'hi' ? 'ईमेल या फोन आवश्यक है' : 'Email/Phone is required';
    }
    if (!formData.password) {
      newErrors.password = language === 'hi' ? 'पासवर्ड आवश्यक है' : 'Password is required';
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
          <h2 className="text-2xl font-bold text-brand-grad mb-2 font-display">{t.title}</h2>
          <p className="text-slate-500 text-sm mb-6 font-semibold">{t.subtitle}</p>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="text-prosperity-green bg-emerald-50 p-4 rounded-full mb-4 border border-emerald-100">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>
              <h3 className="text-lg font-bold mb-1 text-shramik-navy font-display">{t.successTitle}</h3>
              <p className="text-sm text-slate-500">{t.successSubtitle}</p>
            </div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.emailOrPhone}</Label>
                <Input
                  type="text"
                  name="email"
                  placeholder={language === 'hi' ? 'you@example.com या मोबाइल' : 'you@example.com or mobile'}
                  value={formData.email}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.email ? 'border-dispute-red' : ''}`}
                />
                {errors.email && <span className="text-xs text-dispute-red">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.password}</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none ${errors.password ? 'border-dispute-red' : ''}`}
                />
                {errors.password && <span className="text-xs text-dispute-red">{errors.password}</span>}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-grad hover:opacity-90 text-white font-bold h-12 rounded-xl mt-4 cursor-pointer font-display text-base border-0 transition-all shadow-md"
              >
                {isSubmitting ? t.submittingBtn : t.submitBtn}
              </Button>
            </form>
          )}
        </div>
      </main>
      <Footer theme="light" />
    </div>
  );
}
