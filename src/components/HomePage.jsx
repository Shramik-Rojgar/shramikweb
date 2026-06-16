import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ArrowRight, User } from 'lucide-react';
import { translations } from '../lib/translations';

export default function HomePage({ onNavigate, language = 'hi', onLanguageChange }) {
  const t = translations[language].home;

  // Header Actions
  const headerActions = (
    <div className="flex items-center gap-2 sm:gap-4 font-bold text-[11px] sm:text-sm">
      <button 
        onClick={() => onNavigate('signup', 'login')} 
        className="text-shramik-navy hover:text-kaam-orange transition-colors cursor-pointer px-1 py-1"
        id="btn-nav-login"
      >
        {t.navLogin}
      </button>
      <button 
        onClick={() => onNavigate('signup', 'choose')}
        className="bg-shramik-navy hover:bg-shramik-navy-hover text-white py-1 px-2.5 sm:py-2 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-200 cursor-pointer"
        id="btn-nav-signup"
      >
        {t.navSignup}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans">
      
      {/* Light Header matching the Mockup */}
      <Header 
        theme="light" 
        onNavigate={onNavigate} 
        rightAction={headerActions} 
        language={language} 
        onLanguageChange={onLanguageChange} 
      />

      {/* Hero Section */}
      <main className="relative flex-grow flex items-center justify-start min-h-[650px] w-full overflow-hidden">
        
        {/* Background Image Container */}
        <div className="absolute inset-0 w-full h-full bg-[#0E1626]">
          <img 
            src="/hero_home.png" 
            className="w-full h-full object-cover object-center opacity-65" 
            alt="Empowering India's Workforce"
            onError={(e) => {
              // Fallback placeholder color/styling if image is not yet loaded
              e.target.style.display = 'none';
            }}
          />
          {/* Subtle dark gradient overlay to guarantee text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1626]/90 via-[#0E1626]/70 to-[#0E1626]/40" />
        </div>

        {/* Hero Content (Left Aligned matching mockup) */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-16 w-full text-left py-16">
          <div className="max-w-2xl flex flex-col items-start">
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 font-display leading-tight">
              {t.heroTitle}
            </h1>

            {/* Description matching the exact Brand Essence from Guidelines Part 1.2 */}
            <p className="text-base md:text-lg text-slate-300 font-semibold mb-10 leading-relaxed font-sans max-w-xl">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
              
              <button 
                onClick={() => onNavigate('signup', 'laborer-signup')}
                className="bg-kaam-orange hover:bg-orange-cta-safe text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 group transition-all duration-200 cursor-pointer shadow-md font-display text-base"
                id="btn-hero-work"
              >
                <span>{t.btnWork}</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button 
                onClick={() => onNavigate('signup', 'hirer-signup')}
                className="border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer font-display text-base"
                id="btn-hero-hire"
              >
                <span>{t.btnHire}</span>
              </button>

            </div>

            {/* Worker Avatars & Social Proof */}
            <div className="flex items-center gap-4">
              
              {/* Overlapping Avatar Placeholders */}
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-[#0E1626] bg-saffron-homage flex items-center justify-center text-white font-bold text-xs">
                  <User className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0E1626] bg-slate-400 flex items-center justify-center text-white font-bold text-xs">
                  <User className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0E1626] bg-prosperity-green flex items-center justify-center text-white font-bold text-xs">
                  <User className="w-5 h-5" />
                </div>
              </div>

              {/* Social Proof Label */}
              <span className="text-sm text-slate-300 font-semibold font-sans">
                {t.trustedText}
              </span>

            </div>

          </div>
        </div>

      </main>

      {/* Footer matching Mockup */}
      <Footer theme="light" />

    </div>
  );
}
