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
    <header className={`flex justify-between items-center px-4 md:px-16 py-3 md:py-4 border-b transition-colors duration-200 ${
      isDark 
        ? 'bg-[#0E1626] border-slate-800 text-white' 
        : 'bg-white border-slate-100 text-slate-900 shadow-sm'
    }`}>
      {/* Left section: Logo or Back */}
      <div className="flex items-center gap-3">
        {onBack ? (
          <button 
            onClick={onBack}
            className={`flex items-center gap-1.5 font-bold transition-all cursor-pointer text-sm ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-shramik-navy'
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
            <SelectTrigger className={`h-8 w-14 font-black font-sans cursor-pointer text-xs border-slate-200 bg-slate-50 text-slate-700 focus:ring-0 ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-white focus-visible:ring-slate-800' 
                : 'bg-slate-50 border-slate-200 text-slate-700 focus-visible:ring-slate-200'
            }`}>
              <SelectValue>{language === 'hi' ? 'अ' : 'A'}</SelectValue>
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
