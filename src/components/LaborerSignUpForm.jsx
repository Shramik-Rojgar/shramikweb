import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackgroundOrbs from './bg';
import {
  Check,
  ShieldCheck,
  PhoneCall,
} from 'lucide-react';
import LaborerRegistrationForm from './LaborerRegistrationForm';
import { translations } from '../lib/translations';
import { usePageMeta } from '../lib/usePageMeta';

export default function LaborerSignUpForm({ onNavigate, onBack, language = 'hi', onLanguageChange }) {
  const [isSuccess,   setIsSuccess]   = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const t = translations[language].laborer;
  const L = (hi, en) => language === 'hi' ? hi : en;

  usePageMeta({
    title: 'Worker Registration | Shramik — Find Daily Wage Jobs',
    description: 'Register as a skilled worker on Shramik. Get verified, find daily wage jobs near you as a mason, carpenter, plumber, electrician, painter, welder and more.',
    keywords: 'worker registration shramik, daily wage jobs, skilled labour registration, mason jobs, carpenter jobs, plumber jobs, electrician jobs india, construction work near me',
  });

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

          <LaborerRegistrationForm
            language={language}
            onSuccess={() => {
              setIsSuccess(true);
              setTimeout(() => {
                setIsSuccess(false);
                onNavigate('home');
              }, 3000);
            }}
            onDuplicate={() => setIsDuplicate(true)}
          />
        </div>
      </main>
      <Footer theme="light" onNavigate={onNavigate} />
    </div>
  );
}
