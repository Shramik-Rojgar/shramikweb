import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { translations } from '../lib/translations';
import { ArrowRight, Users, HardHat } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── icon component + paths ─────────────────────────────────────────────────
function Ic({ d, size = 22, color = 'currentColor', sw = 2, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0, display: 'block' }}>
      <path d={d} fill={fill} stroke={fill === 'none' ? color : 'none'} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const I = {
  check: 'M5 13l5 5L20 7',
  pin: 'M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0112 4.5 6.5 6.5 0 0118.5 11c0 4.6-6.5 10-6.5 10z M12 12.8a1.9 1.9 0 100-3.8 1.9 1.9 0 000 3.8z',
  phone: 'M6 3h4l1.5 5L9 10a13 13 0 005 5l2-2.5L21 14v4a2 2 0 01-2 2A16 16 0 014 5a2 2 0 012-2z',
  shield: 'M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z',
  lock: 'M7 11V8a5 5 0 0110 0v3 M5 11h14v9H5z',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  bell: 'M6 16V11a6 6 0 0112 0v5l1.5 2.5h-15L6 16z M10 21h4',
  speaker: 'M4 10v4h3l5 4V6L7 10H4z M15 9.5a4 4 0 010 5 M17.5 7a8 8 0 010 10',
  plus: 'M12 5v14 M5 12h14',
  chevron: 'M6 9l6 6 6-6',
  person: 'M12 11a3.6 3.6 0 100-7.2A3.6 3.6 0 0012 11z M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5',
  people: 'M9 11a3 3 0 100-6 3 3 0 000 6z M2 20c.6-3 2.8-4.6 6-4.6 1 0 1.9.15 2.7.45 M16 11a3 3 0 100-6 M14.5 15.4c2.6.2 4.4 1.8 4.9 4.6',
  rupee: 'M7 5h10 M7 9h10 M14.5 5c0 4-3 5-7 5l6 8',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3.5 2',
  badge: 'M12 3l2.4 2.1 3.1-.6 1 3 2.7 1.6-1.3 2.9 1.3 2.9-2.7 1.6-1 3-3.1-.6L12 21l-2.4-2.1-3.1.6-1-3L2.8 14l1.3-2.9L2.8 8.2l2.7-1.6 1-3 3.1.6L12 3z M9 12l2 2 4-4',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 17.1l-5.3 2.8 1-5.8L3.5 9.7l5.9-.9L12 3.5z',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14z M20 20l-4-4',
  card: 'M3 7h18v10H3z M3 11h18 M7 15h3',
  // trades
  brick: 'M4 7h16v5H4z M4 12h16v5H4z M9 7v5 M14 12v5',
  roller: 'M5 5h12v5H5z M17 7h2.5v4H12v4 M12 15v5',
  bolt: 'M13 3L6 13.5h5L10 21l7-10.5h-5l1-7.5z',
  droplet: 'M12 4c3 4 6 6.8 6 10a6 6 0 11-12 0c0-3.2 3-6 6-10z',
  hammer: 'M14 6l4 4 M11.5 8.5l4 4-6.5 6.5-4-4 6.5-6.5z M13 4.5l6.5 6.5',
  welder: 'M12 2v3 M12 19v3 M3 12h3 M18 12h3 M5.5 5.5l2 2 M16.5 16.5l2 2 M16.5 7.5l2-2 M5.5 18.5l2-2',
  rebar: 'M4 5h16 M4 12h16 M4 19h16 M9 4v16 M15 4v16',
  tile: 'M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z',
  hardhat: 'M3 18h18 M5 18v-2a7 7 0 0114 0v2 M10 8.5V5.5h4v3',
  home: 'M4 11l8-7 8 7 M6 10v9h12v-9 M10 19v-5h4v5',
};

const SKILLS = [
  { key: 'mistri',      ic: 'brick',   hi: 'मिस्त्री',       en: 'Mason' },
  { key: 'carpenter',   ic: 'hammer',  hi: 'बढ़ई',          en: 'Carpenter' },
  { key: 'painter',     ic: 'roller',  hi: 'पेंटर',         en: 'Painter' },
  { key: 'welder',      ic: 'welder',  hi: 'वेल्डर',        en: 'Welder' },
  { key: 'plumber',     ic: 'droplet', hi: 'नलसाज',         en: 'Plumber' },
  { key: 'electrician', ic: 'bolt',    hi: 'बिजली मिस्त्री', en: 'Electrician' },
  { key: 'rebar',       ic: 'rebar',   hi: 'सरिया',         en: 'Bar bender' },
  { key: 'tiler',       ic: 'tile',    hi: 'टाइल',          en: 'Tiler' },
  { key: 'consthelper', ic: 'hardhat', hi: 'निर्माण सहायक',  en: 'Site helper' },
  { key: 'labour',      ic: 'people',  hi: 'मजदूर',         en: 'Labourer' },
  { key: 'domestic',    ic: 'home',    hi: 'घरेलू सहायक',    en: 'Domestic help' },
  { key: 'other',       ic: 'plus',    hi: 'अन्य',          en: 'Other' },
];

const RECENT_WORKERS = [
  { hi: 'रामू कुमार', en: 'Ramu K.', sk_hi: 'राजमिस्त्री', sk_en: 'Mason' },
  { hi: 'सुनील यादव', en: 'Sunil Y.', sk_hi: 'पुताई', sk_en: 'Painter' },
  { hi: 'अकबर अली', en: 'Akbar A.', sk_hi: 'बिजली', sk_en: 'Electrician' },
  { hi: 'मोहन लाल', en: 'Mohan L.', sk_hi: 'प्लंबर', sk_en: 'Plumber' },
];

const RECENT_HIRERS = [
  { hi: 'डीएलएफ़ फेज़ 3', en: 'DLF Phase 3', sk_hi: '3 राजमिस्त्री', sk_en: '3 masons' },
  { hi: 'सुशांत लोक', en: 'Sushant Lok', sk_hi: '2 पुताई', sk_en: '2 painters' },
  { hi: 'सेक्टर 57', en: 'Sector 57', sk_hi: '1 बिजली', sk_en: '1 electrician' },
  { hi: 'गोल्फ़ कोर्स रोड', en: 'Golf Course Rd', sk_hi: '4 बेलदार', sk_en: '4 helpers' },
];

export default function HomePage({ onNavigate, language = 'hi', onLanguageChange }) {
  const [aud, setAud] = useState('hire'); // 'hire' | 'work'
  const [openFaq, setOpenFaq] = useState(null);

  const L = (o) => (o ? (language === 'hi' ? o.hi : o.en) : '');
  
  const isHire = aud === 'hire';
  const t = translations[language].prelaunch[aud];
  const tCommon = translations[language].prelaunch.common;

  const scrollToJoin = () => {
    const el = document.getElementById('join');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Speaks details of the form for low-literacy users
  const speakForm = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = language === 'hi'
        ? (isHire 
            ? 'पहले दिन से कुशल कारीगर पाएँ। अर्ली एक्सेस लिस्ट के लिए कृपया अपना नाम, मोबाइल नंबर और साइट का स्थान दर्ज करें।' 
            : '३० सेकंड में सीधे जुड़ें। अपना मोबाइल नंबर, काम का हुनर और रहने का इलाका दर्ज करें।')
        : (isHire 
            ? 'Get workers from day one. For early access, please enter your name, mobile number, and site location.' 
            : 'Join in 30 seconds. Enter your mobile number, select your skill, and write your location.');
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Header actions content (Segment switcher + Login/SignUp)
  const headerActions = (
    <div className="flex items-center gap-3 sm:gap-6">
      {/* Desktop segment switcher */}
      <div className="hidden md:flex seg">
        <button 
          className={cn("seg-btn", isHire && "on")} 
          onClick={() => setAud('hire')}
        >
          <Ic d={I.people} size={15} color="currentColor" sw={2.2} />
          <span>{tCommon.hireTab}</span>
        </button>
        <button 
          className={cn("seg-btn", !isHire && "on")} 
          onClick={() => setAud('work')}
        >
          <Ic d={I.hardhat} size={15} color="currentColor" sw={2.2} />
          <span>{tCommon.workTab}</span>
        </button>
      </div>

      {/* Login & Signup buttons */}
      <div className="flex items-center gap-2.5 sm:gap-4 font-bold text-xs sm:text-sm">
        <button 
          onClick={() => onNavigate('signup', 'login')} 
          className="text-[var(--ink)] hover:text-[var(--accent)] transition-colors cursor-pointer px-1 py-1 font-sans"
          id="btn-nav-login"
        >
          {language === 'hi' ? 'लॉग इन' : 'Log In'}
        </button>
        <button 
          onClick={() => onNavigate('signup', 'choose')}
          className="bg-[var(--ink)] hover:opacity-90 text-white py-1.5 px-3.5 sm:py-2 sm:px-5 rounded-full transition-all duration-200 cursor-pointer font-sans shadow-sm"
          id="btn-nav-signup"
        >
          {language === 'hi' ? 'साइन अप' : 'Sign Up'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-[#14101C] font-sans flex flex-col justify-between overflow-x-hidden">
      
      {/* Ambient background glowing blobs */}
      <div className="bg-blobs">
        <span className="blob b1"></span>
        <span className="blob b2"></span>
        <span className="blob b3"></span>
        <span className="blob b4"></span>
      </div>

      {/* Navigation Header */}
      <Header 
        theme="light" 
        onNavigate={onNavigate} 
        rightAction={headerActions} 
        language={language} 
        onLanguageChange={onLanguageChange} 
      />

      {/* Main Container */}
      <div className="wrap flex-grow">
        
        {/* 1. HERO SECTION */}
        <header className="hero container">
          <div className="hero-grid">
            
            {/* Left Copy Column */}
            <div className="hero-copy text-left">
              <div className="eyebrow">
                <span className="pulse live-dot" style={{ background: 'var(--saffron)', boxShadow: '0 0 0 4px rgba(255,138,30,0.18)' }}></span>
                <span>{t.eyebrow}</span>
              </div>
              <h1 className="h1">
                {t.h1a}<br />
                <span className="grad">{t.h1b}</span>
              </h1>
              <p className="sub">{t.sub}</p>
              
              <div className="hero-actions">
                <button className="cta font-sans" onClick={scrollToJoin}>
                  <span>{t.navCta}</span>
                  <Ic d={I.arrow} size={18} color="#fff" sw={2.6} />
                </button>
                <button 
                  className="cta-ghost font-sans" 
                  onClick={() => setAud(isHire ? 'work' : 'hire')}
                >
                  <span>{isHire ? tCommon.lookingForWork : tCommon.needWorkers}</span>
                  <Ic d={I.arrow} size={16} color="var(--accent)" sw={2.4} />
                </button>
              </div>

              <div className="pill-row">
                {t.pills.map((p, i) => (
                  <span key={i} className="pill">
                    <Ic d={I[p.ic]} size={15} color="var(--green)" sw={2.2} />
                    <span>{p.text}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right Form Column */}
            <div className="hero-form-col text-left">
              <HeroForm 
                aud={aud} 
                t={t} 
                language={language} 
                tCommon={tCommon}
                speakForm={speakForm}
              />

              {/* Missed Call Banner for worker paths */}
              {!isHire && (
                <div className="missed glass">
                  <div className="ic">
                    <Ic d={I.phone} size={22} color="var(--green)" sw={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="t1 font-sans font-bold">{tCommon.cantFillPhone}</div>
                    <div className="t2 font-sans">{tCommon.missedCallInstructions}</div>
                    <div className="num font-display font-black text-xl mt-0.5">+91 92368 61784</div>
                  </div>
                  <button 
                    onClick={speakForm} 
                    className="speaker hover:opacity-85 transition-opacity"
                    title="सुनें / Listen"
                  >
                    <Ic d={I.speaker} size={19} color="var(--accent)" sw={1.8} />
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* 2. STATS & TICKER BAND */}
        <StatsSection 
          aud={aud} 
          t={t}
          language={language} 
        />

        {/* 3. HOW IT WORKS SECTION */}
        <section className="section container">
          <div className="sec-head">
            <div className="eyebrow">{language === 'hi' ? 'कैसे काम करता है' : 'How it works'}</div>
            <h2>{t.stepsHead}</h2>
            <p>{t.stepsSub}</p>
          </div>
          <div className="steps">
            {t.steps.map((s, i) => (
              <div key={i} className="step glass">
                <span className="num font-display">{i + 1}</span>
                <div className="ic-box">
                  <Ic d={I[s.ic]} size={27} color="var(--rani)" sw={2} />
                </div>
                <h3 className="font-display">{s.title}</h3>
                <p className="font-sans">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. VALUES GRID */}
        <section className="section container" style={{ paddingTop: 0 }}>
          <div className="values">
            {translations[language].prelaunch[aud === 'hire' ? 'hire' : 'work'].pills.map((v, i) => {
              // Map values details based on lists defined
              const listValues = aud === 'hire' ? 
                [
                  { ic: 'badge', title: L({ hi: 'सत्यापित कारीगर', en: 'Verified workers' }), desc: L({ hi: 'हर कारीगर आधार-सत्यापित और रेटेड।', en: 'Every worker Aadhaar-verified and rated.' }) },
                  { ic: 'clock', title: L({ hi: 'माँगते ही पहुँच', en: 'On demand' }), desc: L({ hi: 'कुछ ही घंटों में साइट पर।', en: 'On your site within hours.' }) },
                  { ic: 'lock', title: L({ hi: 'फिक्स रेट', en: 'Fixed rates' }), desc: L({ hi: 'पारदर्शी दाम, कोई मोलभाव नहीं।', en: 'Transparent pricing, no haggling.' }) },
                  { ic: 'shield', title: L({ hi: 'सुरक्षित भुगतान', en: 'Safe payments' }), desc: L({ hi: 'काम पूरा होने पर ही पैसा।', en: 'Pay only when the job is done.' }) }
                ] :
                [
                  { ic: 'rupee', title: L({ hi: 'पूरा पैसा', en: 'Full pay' }), desc: L({ hi: 'कोई कटौती नहीं, सीधे खाते में।', en: 'No cuts, straight to your account.' }) },
                  { ic: 'shield', title: L({ hi: 'सुरक्षित पहचान', en: 'Safe identity' }), desc: L({ hi: 'आधार-सत्यापित, भरोसेमंद समुदाय।', en: 'Aadhaar-verified, trusted community.' }) },
                  { ic: 'badge', title: L({ hi: 'पक्का काम', en: 'Real work' }), desc: L({ hi: 'सीधे नियोक्ता से, बिना बिचौलिए के।', en: 'Straight from hirers, no middleman.' }) },
                  { ic: 'check', title: L({ hi: 'मुफ़्त, हमेशा', en: 'Free, always' }), desc: L({ hi: 'जुड़ना और प्रोफ़ाइल मुफ़्त।', en: 'Joining and profile are free.' }) }
                ];

              const item = listValues[i] || { ic: 'check', title: v.text, desc: '' };
              return (
                <div key={i} className="value glass">
                  <div className="ic-box">
                    <Ic d={I[item.ic]} size={23} color="var(--green)" sw={2} />
                  </div>
                  <h4 className="font-display">{item.title}</h4>
                  <p className="font-sans">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section className="section container">
          <div className="faq-grid">
            <div className="sec-head" style={{ textAlign: 'left', margin: 0, maxWidth: 'none' }}>
              <div className="eyebrow" style={{ justifyContent: 'flex-start' }}>{tCommon.questionsEyebrow}</div>
              <h2>{tCommon.questionsTitle}</h2>
              <p style={{ marginLeft: 0 }}>{tCommon.questionsSub}</p>
            </div>
            
            <div className="faq-list glass">
              {t.faq.map((item, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={cn("faq-item", isOpen && "open")}>
                    <button 
                      className="faq-q" 
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                    >
                      <span className="q font-display font-semibold">{item.q}</span>
                      <span className="chev">
                        <Ic d={I.chevron} size={15} color={isOpen ? '#fff' : 'var(--mut)'} sw={2.4} />
                      </span>
                    </button>
                    <div 
                      className="faq-a transition-all duration-350 ease-in-out" 
                      style={{ maxHeight: isOpen ? '220px' : '0px' }}
                    >
                      <div className="faq-a-inner font-sans">{item.a}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. BOTTOM CTA BANNER */}
        <section className="section container">
          <div className="cta-banner bg-brand-grad text-white">
            <h2 className="text-white font-display">{t.bannerH}</h2>
            <p className="text-white/80 font-sans font-medium">{t.bannerP}</p>
            <div className="actions">
              <button 
                onClick={scrollToJoin} 
                className="cta-ghost border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl flex items-center justify-center gap-2 cursor-pointer font-sans"
              >
                <span>{t.navCta}</span>
                <Ic d={I.arrow} size={16} color="#fff" sw={2.4} />
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* Fixed mobile bottom floating segment switcher */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50 flex justify-center">
        <div className="seg w-full max-w-sm glass shadow-lg border border-white/40">
          <button 
            className={cn("seg-btn flex-1 justify-center", isHire && "on")} 
            onClick={() => setAud('hire')}
          >
            <Ic d={I.people} size={18} color="currentColor" sw={2} />
            <span>{tCommon.hireTab}</span>
          </button>
          <button 
            className={cn("seg-btn flex-1 justify-center", !isHire && "on")} 
            onClick={() => setAud('work')}
          >
            <Ic d={I.hardhat} size={18} color="currentColor" sw={2} />
            <span>{tCommon.workTab}</span>
          </button>
        </div>
      </div>

      {/* Footer Component */}
      <Footer theme="light" />

    </div>
  );
}

// ── SUBCOMPONENT: HEROFORM ──────────────────────────────────────────────────
function HeroForm({ aud, t, language, tCommon, speakForm }) {
  const isHire = aud === 'hire';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [sel, setSel] = useState(['mistri']);
  const [other, setOther] = useState('');
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setDone(false);
    setErrors({});
  }, [aud]);

  const toggleSkill = (k) => {
    setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));
    if (errors.skills) {
      setErrors((e) => ({ ...e, skills: null }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (isHire && !name.trim()) {
      newErrors.name = language === 'hi' ? 'नाम आवश्यक है' : 'Name is required';
    }
    if (!phone || phone.length < 10) {
      newErrors.phone = language === 'hi' ? 'वैध १०-अंकीय नंबर दर्ज करें' : 'Enter valid 10-digit number';
    }
    if (sel.length === 0) {
      newErrors.skills = language === 'hi' ? 'कम से कम एक हुनर चुनें' : 'Select at least one skill';
    }
    if (!area.trim()) {
      newErrors.area = language === 'hi' ? 'स्थान आवश्यक है' : 'Locality is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="hero-card glass" id="join">
        <div className="success-state">
          <div className="ring">
            <Ic d={I.check} size={34} color="var(--green)" sw={3} />
          </div>
          <h3 className="font-display text-2xl font-bold">{t.successTitle}</h3>
          <p className="font-sans mt-2">{t.successBody}</p>
          <button 
            className="edit font-sans font-bold text-sm text-[var(--accent)] mt-6 bg-transparent border-0 cursor-pointer" 
            onClick={() => setDone(false)}
          >
            {t.editBtn}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleFormSubmit} className="hero-card glass flex flex-col gap-4" id="join">
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(20,16,28,0.06)] pb-4">
        <div style={{ flex: 1 }}>
          <div className="card-eyebrow font-sans text-xs font-bold text-[var(--accent)] tracking-wider uppercase">{t.cardEyebrow}</div>
          <div className="card-title font-display text-xl font-bold mt-1 text-[var(--ink)]">{t.cardTitle}</div>
        </div>
        <button 
          type="button" 
          onClick={speakForm} 
          className="speaker hover:opacity-85 transition-all flex items-center justify-center bg-white/80 border border-white"
          title="सुनें / Listen"
        >
          <Ic d={I.speaker} size={19} color="var(--accent)" sw={1.8} />
        </button>
      </div>

      {/* Name Input (Hire only) */}
      {isHire && (
        <label className="field text-left">
          <div className="field-label">{t.nameLabel}</div>
          <div className={cn("field-box", errors.name && "border-red-500")}>
            <input 
              value={name} 
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((err) => ({ ...err, name: null }));
              }} 
              placeholder={t.namePh} 
            />
          </div>
          {errors.name && <span className="text-xs text-red-500 font-sans mt-1 block">{errors.name}</span>}
        </label>
      )}

      {/* Phone Number Input */}
      <label className="field text-left">
        <div className="field-label">{language === 'hi' ? 'मोबाइल नंबर' : 'Mobile number'}</div>
        <div className={cn("field-box", errors.phone && "border-red-500")}>
          <span className="prefix mr-1">+91</span>
          <input 
            type="tel" 
            inputMode="numeric" 
            value={phone} 
            onChange={(e) => {
              setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10));
              if (errors.phone) setErrors((err) => ({ ...err, phone: null }));
            }} 
            placeholder="98765 43210" 
          />
        </div>
        {errors.phone && <span className="text-xs text-red-500 font-sans mt-1 block">{errors.phone}</span>}
      </label>

      {/* Skills selection grid */}
      <div className="field text-left">
        <div className="field-label">{t.skillLabel}</div>
        <div className="skill-grid mt-1">
          {SKILLS.map((sk) => {
            const on = sel.includes(sk.key);
            const skLabel = language === 'hi' ? sk.hi : sk.en;
            return (
              <button 
                type="button" 
                key={sk.key} 
                className={cn('skill hover:scale-[1.02] active:scale-[0.98] transition-transform', on ? 'on' : '')} 
                onClick={() => toggleSkill(sk.key)}
              >
                <Ic d={I[sk.ic]} size={21} color="currentColor" sw={2} fill={sk.ic === 'bolt' && on ? 'currentColor' : 'none'} />
                <span className="lab">{skLabel}</span>
              </button>
            );
          })}
        </div>
        {errors.skills && <span className="text-xs text-red-500 font-sans mt-1 block">{errors.skills}</span>}

        {sel.includes('other') && (
          <div className="field-box mt-3.5">
            <input 
              value={other} 
              onChange={(e) => setOther(e.target.value)} 
              placeholder={tCommon.otherTradePlaceholder} 
            />
          </div>
        )}
      </div>

      {/* Location Area Input */}
      <label className="field text-left">
        <div className="field-label">{t.areaLabel}</div>
        <div className={cn("field-box", errors.area && "border-red-500")}>
          <input 
            value={area} 
            onChange={(e) => {
              setArea(e.target.value);
              if (errors.area) setErrors((err) => ({ ...err, area: null }));
            }} 
            placeholder={t.areaPh} 
          />
        </div>
        {errors.area && <span className="text-xs text-red-500 font-sans mt-1 block">{errors.area}</span>}
      </label>

      {/* Submit button */}
      <button type="submit" className="cta full mt-4">
        <span>{t.submit}</span> 
        <Ic d={I.arrow} size={18} color="#fff" sw={2.6} />
      </button>

      <div className="note flex items-center justify-center gap-1.5 mt-2">
        <Ic d={I.lock} size={14} color="var(--green)" sw={2.2} />
        <span>{t.note}</span>
      </div>
    </form>
  );
}

// ── SUBCOMPONENT: STATSSECTION ──────────────────────────────────────────────
function StatsSection({ aud, t, language }) {
  const [idx, setIdx] = useState(0);
  const tickerData = aud === 'hire' ? RECENT_HIRERS : RECENT_WORKERS;

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % tickerData.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [aud, tickerData.length]);

  const L = (o) => (o ? (language === 'hi' ? o.hi : o.en) : '');

  const currentRecord = tickerData[idx];

  return (
    <section className="stats container">
      <div className="stats-grid">
        {t.stats.map((s, i) => {
          const isTickerCell = i === 0; // The first cell holds the dynamic updates ticker
          return (
            <div key={i} className="stat glass text-left">
              <div className="big font-display font-black text-4xl text-[var(--ink)]">
                <span>{s.big}</span>
                {s.live && <span className="pulse live-dot ml-2"></span>}
              </div>
              <div className="lab font-sans font-bold text-sm text-[var(--mut)] mt-1.5">
                {s.lab.split('\n').map((line, k) => (
                  <span key={k} className="block">{line}</span>
                ))}
              </div>

              {/* Scrolling ticker display */}
              {isTickerCell && currentRecord && (
                <div className="ticker mt-4 pt-4 border-t border-[rgba(20,16,28,0.08)] flex items-center gap-3">
                  <div className="av flex-shrink-0 w-8 h-8 rounded-full bg-brand-grad text-white flex items-center justify-center font-display font-bold text-sm uppercase">
                    {L(currentRecord)[0]}
                  </div>
                  <div className="txt font-sans text-xs text-[var(--mut)] truncate">
                    <b className="text-[var(--ink)] font-extrabold">{L(currentRecord)}</b>
                    <span> · </span>
                    <span>{language === 'hi' ? currentRecord.sk_hi : currentRecord.sk_en}</span>
                    <span> </span>
                    <span className="text-[var(--green)] font-extrabold">{t.tickerVerb}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
