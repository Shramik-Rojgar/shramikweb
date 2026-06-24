import React from 'react';

export default function Footer({ theme = 'light', onNavigate }) {
  const isDark = theme === 'dark';
  return (
    <>
      <div className="tricolor">
        <i className="s"></i>
        <i className="w"></i>
        <i className="g"></i>
      </div>
      <footer className={`w-full py-8 px-6 md:px-16 transition-colors duration-200 ${isDark
          ? 'bg-[#0E1626] border-t border-slate-800 text-slate-400'
          : 'bg-[rgba(255,255,255,0.42)] border-t border-[rgba(20,16,28,0.08)] text-[var(--mut)]'
        }`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left branding */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <span className={`text-xl font-extrabold tracking-tight font-display ${isDark ? 'text-white' : 'text-[var(--ink)]'}`}>
              श्रमिक SHRAMIK
            </span>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              © 2026 Shramik Rojgar Pvt. Ltd. All rights reserved.
            </p>
          </div>

          {/* Right Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-xs md:text-sm font-bold">
            {onNavigate && (
              <button
                onClick={() => onNavigate('gallery')}
                className="hover:text-[var(--accent)] transition-colors duration-200 cursor-pointer"
              >
                Gallery
              </button>
            )}
            <a href="#contact" className="hover:text-[var(--accent)] transition-colors duration-200">Contact Us</a>
            <a href="#privacy" className="hover:text-[var(--accent)] transition-colors duration-200">Privacy Policy</a>
            <a href="#terms" className="hover:text-[var(--accent)] transition-colors duration-200">Terms of Service</a>
            <a href="#certified" className={`transition-colors duration-200 ${isDark ? 'text-slate-200 hover:text-[var(--accent)]' : 'text-[var(--ink)] hover:text-[var(--accent)]'}`}>Shramik Certified</a>
          </div>
        </div>
      </footer>
    </>
  );
}
