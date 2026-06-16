import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from './Logo';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Header({ 
  theme = 'light', 
  onNavigate, 
  onBack, 
  rightAction,
  language = 'hi',
  onLanguageChange
}) {
  const isDark = theme === 'dark';
  return (
    <header className={`flex justify-between items-center px-4 md:px-16 py-3 md:py-4 border-b transition-colors duration-200 sticky top-0 z-50 ${
      isDark 
        ? 'bg-[#0E1626] border-slate-800 text-white' 
        : 'bg-[rgba(255,250,239,0.74)] backdrop-blur-md border-[rgba(20,16,28,0.08)] text-[var(--ink)]'
    }`}>
      {/* Left section: Logo or Back */}
      <div className="flex items-center gap-3">
        {onBack ? (
          <button 
            onClick={onBack}
            className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer text-sm ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-[var(--ink)]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <Logo theme={theme} language={language} />
          </div>
        )}
      </div>

      
      {/* Right section: Actions */}
      <div className="flex items-center gap-3 sm:gap-6">
        {onLanguageChange && (
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className={`h-8 w-14 font-black font-sans cursor-pointer text-xs focus:ring-0 ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-white focus-visible:ring-slate-800' 
                : 'bg-white/70 border-[rgba(255,255,255,0.78)] text-[var(--ink)] backdrop-blur-sm focus-visible:ring-[rgba(255,255,255,0.78)] shadow-sm'
            }`}>
              <span>{language === 'hi' ? 'अ' : 'A'}</span>
              <span className="hidden"><SelectValue /></span>
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#DDE3EA] rounded-xl shadow-lg z-50">
              <SelectItem value="hi" className="cursor-pointer font-sans font-semibold text-xs md:text-sm">अ (हिन्दी)</SelectItem>
              <SelectItem value="en" className="cursor-pointer font-sans font-semibold text-xs md:text-sm">A (English)</SelectItem>
            </SelectContent>
          </Select>
        )}
        {onBack ? (
          <div className="cursor-pointer" onClick={() => onNavigate('home')}>
            <span className={`text-xl md:text-2xl font-black tracking-tight font-display ${isDark ? 'text-white' : 'text-shramik-navy'}`}>
              श्रमिक
            </span>
          </div>
        ) : (
          rightAction
        )}
      </div>
    </header>
  );
}
