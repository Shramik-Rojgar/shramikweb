import React from 'react';
import { ArrowLeft, UserPlus, Info, Home } from 'lucide-react';
import Logo from './Logo';
import { cn } from '@/lib/utils';
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
  activeTab, // 'hire' | 'work' | 'signup' | 'about' | 'home'
  language = 'hi',
  onLanguageChange,
  setAud
}) {
  const isDark = theme === 'dark';
  return (
    <header className={`border-b transition-colors duration-200 sticky top-0 z-50 ${
      isDark 
        ? 'bg-[#0E1626] border-slate-800 text-white' 
        : 'bg-[rgba(255,250,239,0.74)] backdrop-blur-md border-[rgba(20,16,28,0.08)] text-[var(--ink)]'
    }`}>
      <div className="header-container">
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

        {/* Right section: Switcher & Language Select */}
        <div className="flex items-center gap-3 sm:gap-6">
          {!onBack && (
            <div className="seg text-xs md:text-sm">
              <button 
                className={cn("seg-btn cursor-pointer flex items-center gap-1", (activeTab === 'home' || activeTab === 'hire' || activeTab === 'work') && "on")} 
                onClick={() => onNavigate('home')}
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'hi' ? 'मुख्य पृष्ठ' : 'Home'}</span>
              </button>
              <button 
                className={cn("seg-btn cursor-pointer flex items-center gap-1", activeTab === 'signup' && "on")} 
                onClick={() => onNavigate('signup')}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'hi' ? 'साइन अप' : 'Sign Up'}</span>
              </button>
              <button 
                className={cn("seg-btn cursor-pointer flex items-center gap-1", activeTab === 'about' && "on")} 
                onClick={() => onNavigate('about')}
              >
                <Info className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'hi' ? 'हमारे बारे में' : 'About Us'}</span>
              </button>
            </div>
          )}

          {onBack && (
            <div className="cursor-pointer" onClick={() => onNavigate('home')}>
              <span className={`text-xl md:text-2xl font-black tracking-tight font-display ${isDark ? 'text-white' : 'text-[var(--ink)]'}`}>
                श्रमिक
              </span>
            </div>
          )}

          {onLanguageChange && (
            <Select value={language} onValueChange={onLanguageChange}>
              <SelectTrigger className={`h-8 w-14 font-black font-sans cursor-pointer text-xs focus:ring-0 ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-white focus-visible:ring-slate-800' 
                  : 'bg-white/70 border-[rgba(255,255,255,0.78)] text-[var(--ink)] backdrop-blur-sm focus-visible:ring-[rgba(255,255,255,0.78)] shadow-sm'
              }`}>
                <span className="text-brand-grad font-black">{language === 'hi' ? 'अ' : 'A'}</span>
                <span className="hidden"><SelectValue /></span>
              </SelectTrigger>
              <SelectContent position="popper" className="bg-white border border-[#DDE3EA] rounded-md shadow-lg z-50 min-w-0 w-14 pt-2 pb-1.5">
                <SelectItem value="hi" className={`cursor-pointer font-sans font-bold text-xs justify-center pl-2 pr-2 ${language === 'hi' ? 'text-brand-grad focus:text-brand-grad' : 'focus:bg-[var(--page)] focus:text-[var(--ink)]'}`}>अ</SelectItem>
                <SelectItem value="en" className={`cursor-pointer font-sans font-bold text-xs justify-center pl-2 pr-2 ${language === 'en' ? 'text-brand-grad focus:text-brand-grad' : 'focus:bg-[var(--page)] focus:text-[var(--ink)]'}`}>A</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </header>
  );
}
