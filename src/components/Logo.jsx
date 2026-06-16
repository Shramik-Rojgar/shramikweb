import React from 'react';

export default function Logo({ theme = 'light', language = 'hi' }) {
  const isDark = theme === 'dark';
  return (
    <div className="flex flex-col items-start select-none">
      <div className="flex items-baseline gap-1 sm:gap-1.5 font-display">
        <span className={`text-lg sm:text-2xl font-black transition-colors ${isDark ? 'text-white' : 'text-[var(--ink)]'}`}>
          श्रमिक
        </span>
        <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest font-sans ${isDark ? 'text-slate-400' : 'text-[var(--mut)]'}`}>
          SHRAMIK
        </span>
      </div>
      {/* Tricolor underline (saffron / neutral / green) */}
      <div className="flex h-[3px] sm:h-[4px] w-16 sm:w-24 gap-0.5 mt-0.5 rounded-full overflow-hidden">
        <div className="bg-[var(--saffron)] h-full flex-1"></div>
        <div className="bg-[var(--footer-white)] h-full flex-1"></div>
        <div className="bg-[var(--green)] h-full flex-1"></div>
      </div>
      <span className={`text-[8px] sm:text-[9px] font-bold mt-1 uppercase tracking-wider font-display ${isDark ? 'text-slate-300' : 'text-[var(--mut)]'}`}>
        {language === 'en' ? 'Work · Learn · Grow' : 'काम · सीखो · बढ़ो'}
      </span>
    </div>
  );
}
