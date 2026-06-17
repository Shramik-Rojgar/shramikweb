import React, { useState, useEffect } from 'react';
import BackgroundOrbs from './bg';
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
  { key: 'mistri', ic: 'brick', hi: 'मिस्त्री', en: 'Mason' },
  { key: 'carpenter', ic: 'hammer', hi: 'बढ़ई', en: 'Carpenter' },
  { key: 'painter', ic: 'roller', hi: 'पेंटर', en: 'Painter' },
  { key: 'welder', ic: 'welder', hi: 'वेल्डर', en: 'Welder' },
  { key: 'plumber', ic: 'droplet', hi: 'नलसाज', en: 'Plumber' },
  { key: 'electrician', ic: 'bolt', hi: 'बिजली मिस्त्री', en: 'Electrician' },
  { key: 'rebar', ic: 'rebar', hi: 'सरिया', en: 'Bar bender' },
  { key: 'tiler', ic: 'tile', hi: 'टाइल', en: 'Tiler' },
  { key: 'consthelper', ic: 'hardhat', hi: 'निर्माण सहायक', en: 'Site helper' },
  { key: 'labour', ic: 'people', hi: 'मजदूर', en: 'Labourer' },
  { key: 'domestic', ic: 'home', hi: 'घरेलू सहायक', en: 'Domestic help' },
];

const COMBINED_TICKER_DATA = [
  { hi: 'रामू कुमार', en: 'Ramu K.', sk_hi: 'राजमिस्त्री', sk_en: 'Mason', verb_hi: 'जुड़े', verb_en: 'joined' },
  { hi: 'डीएलएफ़ फेज़ 3', en: 'DLF Phase 3', sk_hi: '3 राजमिस्त्री', sk_en: '3 masons', verb_hi: 'मांगे', verb_en: 'requested' },
  { hi: 'सुनील यादव', en: 'Sunil Y.', sk_hi: 'पुताई', sk_en: 'Painter', verb_hi: 'जुड़े', verb_en: 'joined' },
  { hi: 'सुशांत लोक', en: 'Sushant Lok', sk_hi: '2 पुताई', sk_en: '2 painters', verb_hi: 'मांगे', verb_en: 'requested' },
  { hi: 'अकबर अली', en: 'Akbar A.', sk_hi: 'बिजली', sk_en: 'Electrician', verb_hi: 'जुड़े', verb_en: 'joined' },
  { hi: 'सेक्टर 57', en: 'Sector 57', sk_hi: '1 बिजली', sk_en: '1 electrician', verb_hi: 'मांगे', verb_en: 'requested' },
  { hi: 'मोहन लाल', en: 'Mohan L.', sk_hi: 'प्लंबर', sk_en: 'Plumber', verb_hi: 'जुड़े', verb_en: 'joined' },
  { hi: 'गोल्फ़ कोर्स रोड', en: 'Golf Course Rd', sk_hi: '4 बेलदार', sk_en: '4 helpers', verb_hi: 'मांगे', verb_en: 'requested' }
];

export default function HomePage({ onNavigate, language = 'hi', onLanguageChange, aud = 'hire', setAud }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [howItWorksTab, setHowItWorksTab] = useState('hire'); // 'hire' | 'work'
  const [faqTab, setFaqTab] = useState('hire'); // 'hire' | 'work'

  const L = (o) => (o ? (language === 'hi' ? o.hi : o.en) : '');

  const tHire = translations[language].prelaunch.hire;
  const tWork = translations[language].prelaunch.work;
  const tCommon = translations[language].prelaunch.common;



  return (
    <div className="min-h-screen text-[#14101C] font-sans flex flex-col justify-between overflow-x-hidden" style={{ background: 'transparent' }}>

      {/* Ambient background glowing blobs */}
      <BackgroundOrbs />

      {/* Navigation Header */}
      <Header
        theme="light"
        onNavigate={onNavigate}
        activeTab="home"
        language={language}
        onLanguageChange={onLanguageChange}
        setAud={setAud}
      />

      {/* Main Container */}
      <div className="wrap flex-grow">

        {/* 1. HIRE SECTION (Text Left, Image Right) */}
        <header id="hire-section" className="hero container" style={{ scrollMarginTop: '80px' }}>
          <div className="hero-grid">

            {/* Left Copy Column */}
            <div className="hero-copy text-left">
              <div className="eyebrow">
                <span className="pulse live-dot" style={{ background: 'var(--saffron)', boxShadow: '0 0 0 4px rgba(255,138,30,0.18)' }}></span>
                <span>{tHire.eyebrow}</span>
              </div>
              <h1 className="h1">
                {tHire.h1a}<br />
                <span className="grad">{tHire.h1b}</span>
              </h1>
              <p className="sub">{tHire.sub}</p>

              <div className="hero-actions">
                <button className="cta font-sans" onClick={() => onNavigate('signup')}>
                  <span>{tHire.navCta}</span>
                  <Ic d={I.arrow} size={18} color="#fff" sw={2.6} />
                </button>
              </div>

              <div className="pill-row">
                {tHire.pills.map((p, i) => (
                  <span key={i} className="pill">
                    <Ic d={I[p.ic]} size={15} color="var(--green)" sw={2.2} />
                    <span>{p.text}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right Image Column */}
            <div className="hero-image-col">
              <div className="rounded-3xl overflow-hidden border border-[rgba(20,16,28,0.08)] bg-white/50 backdrop-blur-sm p-2 shadow-md w-full">
                <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl bg-slate-100/80 overflow-hidden flex items-center justify-center">
                  <img
                    src="https://pub-37e3c04824854265b66bbf6ae90c3b5e.r2.dev/Images/Images_sec1.jpg"
                    className="w-full h-full object-cover"
                    alt="Shramik Ground Team"
                  />
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* 2. WORK SECTION (Image Left, Text Right) */}
        <section id="work-section" className="hero container border-t border-[rgba(20,16,28,0.08)] pt-16 mt-16" style={{ scrollMarginTop: '80px' }}>
          <div className="hero-grid">

            {/* Left Image Column */}
            <div className="hero-image-col order-2 md:order-1">
              <div className="rounded-3xl overflow-hidden border border-[rgba(20,16,28,0.08)] bg-white/50 backdrop-blur-sm p-2 shadow-md w-full">
                <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl bg-slate-100/80 overflow-hidden flex items-center justify-center">
                  <img
                    src="https://pub-37e3c04824854265b66bbf6ae90c3b5e.r2.dev/Images/Images_sec2.jpg"
                    className="w-full h-full object-cover"
                    alt="Shramik Support Team"
                  />
                </div>
              </div>
            </div>

            {/* Right Copy Column */}
            <div className="hero-copy text-left order-1 md:order-2">
              <div className="eyebrow">
                <span className="pulse live-dot" style={{ background: 'var(--saffron)', boxShadow: '0 0 0 4px rgba(255,138,30,0.18)' }}></span>
                <span>{tWork.eyebrow}</span>
              </div>
              <h1 className="h1">
                {tWork.h1a}<br />
                <span className="grad">{tWork.h1b}</span>
              </h1>
              <p className="sub">{tWork.sub}</p>

              <div className="hero-actions">
                <button className="cta font-sans" onClick={() => onNavigate('signup')}>
                  <span>{tWork.navCta}</span>
                  <Ic d={I.arrow} size={18} color="#fff" sw={2.6} />
                </button>
              </div>

              <div className="pill-row">
                {tWork.pills.map((p, i) => (
                  <span key={i} className="pill">
                    <Ic d={I[p.ic]} size={15} color="var(--green)" sw={2.2} />
                    <span>{p.text}</span>
                  </span>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 3. COMBINED STATS */}
        <StatsSection language={language} />

        {/* 4. COMBINED HOW IT WORKS */}
        <section className="section container">
          <div className="sec-head">
            <div className="eyebrow">{language === 'hi' ? 'कैसे काम करता है' : 'How it works'}</div>
            <h2>
              {howItWorksTab === 'hire' ? tHire.stepsHead : tWork.stepsHead}
            </h2>
            <p>
              {howItWorksTab === 'hire' ? tHire.stepsSub : tWork.stepsSub}
            </p>

            {/* Tabs switcher inside Steps */}
            <div className="flex justify-center mt-6">
              <div className="seg">
                <button
                  className={cn("seg-btn cursor-pointer", howItWorksTab === 'hire' && "on")}
                  onClick={() => setHowItWorksTab('hire')}
                >
                  {language === 'hi' ? 'काम कराएँ (नियोक्ता)' : 'Hire Workers'}
                </button>
                <button
                  className={cn("seg-btn cursor-pointer", howItWorksTab === 'work' && "on")}
                  onClick={() => setHowItWorksTab('work')}
                >
                  {language === 'hi' ? 'काम पाएँ (कामगार)' : 'Find Work'}
                </button>
              </div>
            </div>
          </div>

          <div className="steps mt-8">
            {(howItWorksTab === 'hire' ? tHire.steps : tWork.steps).map((s, i) => (
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

        {/* 5. UNIFIED VALUES PILLARS */}
        <section className="section container" style={{ paddingTop: 0 }}>
          <div className="values">
            {[
              { ic: 'badge', title: L({ hi: 'सत्यापित कामगार', en: 'Verified Workers' }), desc: L({ hi: 'हर कामगार आधार-सत्यापित, कुशल और रेटेड होता है।', en: 'Every worker is Aadhaar-verified, skilled, and rated.' }) },
              { ic: 'rupee', title: L({ hi: 'सीधा भुगतान', en: 'Direct Pay (0% Cut)' }), desc: L({ hi: 'कोई बिचौलिया नहीं, पूरा पैसा सीधे बैंक खाते में।', en: 'No middleman cuts, full pay straight to bank account.' }) },
              { ic: 'lock', title: L({ hi: 'पारदर्शी दाम', en: 'Transparent Rates' }), desc: L({ hi: 'पहले से तय दाम, काम की जगह पर कोई मोलभाव नहीं।', en: 'Fixed rates up front, no haggling on site.' }) },
              { ic: 'clock', title: L({ hi: 'त्वरित आगमन', en: 'On-Demand Access' }), desc: L({ hi: 'बुकिंग के कुछ ही घंटों के भीतर कामगार साइट पर।', en: 'Workers arrive at your site within hours of request.' }) }
            ].map((item, i) => (
              <div key={i} className="value glass">
                <div className="ic-box">
                  <Ic d={I[item.ic]} size={23} color="var(--green)" sw={2} />
                </div>
                <h4 className="font-display">{item.title}</h4>
                <p className="font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. SHRAMIK GROUND SHOWCASE SECTION */}
        <section className="section container" style={{ paddingTop: '20px' }}>
          <div className="sec-head">
            <div className="eyebrow">{language === 'hi' ? 'जमीनी झलक' : 'Ground Showcase'}</div>
            <h2>{language === 'hi' ? 'हमारी टीम और कामगारों की झलक' : 'Our Team & Workers in Action'}</h2>
            <p>{language === 'hi' ? 'भरोसा और गुणवत्ता। हमारे कामगारों और ग्राउंड टीम की कुछ वास्तविक तस्वीरें देखें।' : 'Trust and quality. See real moments of our verified workers and support team.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="glass rounded-3xl p-6 flex flex-col gap-4 items-center text-center">
              <div className="w-full aspect-video rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
                <img
                  src="https://pub-37e3c04824854265b66bbf6ae90c3b5e.r2.dev/Images/sec3_1.jpg"
                  className="w-full h-full object-cover"
                  alt="Shramik Workers"
                />
              </div>
            </div>

            <div className="glass rounded-3xl p-6 flex flex-col gap-4 items-center text-center">
              <div className="w-full aspect-video rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center relative">
                <img
                  src="https://pub-37e3c04824854265b66bbf6ae90c3b5e.r2.dev/Images/sec3_2.jpg"
                  className="w-full h-full object-cover"
                  alt="Registration Drive"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 7. COMBINED FAQ SECTION */}
        <section className="section container">
          <div className="faq-grid">
            <div className="sec-head" style={{ textAlign: 'left', margin: 0, maxWidth: 'none' }}>
              <div className="eyebrow" style={{ justifyContent: 'flex-start' }}>{tCommon.questionsEyebrow}</div>
              <h2>{tCommon.questionsTitle}</h2>
              <p style={{ marginLeft: 0 }}>{tCommon.questionsSub}</p>

              {/* Tab switcher inside FAQ */}
              <div className="flex justify-start mt-6">
                <div className="seg">
                  <button
                    className={cn("seg-btn cursor-pointer", faqTab === 'hire' && "on")}
                    onClick={() => setFaqTab('hire')}
                  >
                    {language === 'hi' ? 'नियोक्ता प्रश्न' : 'Employer FAQs'}
                  </button>
                  <button
                    className={cn("seg-btn cursor-pointer", faqTab === 'work' && "on")}
                    onClick={() => setFaqTab('work')}
                  >
                    {language === 'hi' ? 'कामगार प्रश्न' : 'Worker FAQs'}
                  </button>
                </div>
              </div>
            </div>

            <div className="faq-list glass">
              {(faqTab === 'hire' ? tHire.faq : tWork.faq).map((item, idx) => {
                const faqKey = `${faqTab}-${idx}`;
                const isOpen = openFaq === faqKey;
                return (
                  <div key={idx} className={cn("faq-item", isOpen && "open")}>
                    <button
                      className="faq-q"
                      onClick={() => setOpenFaq(isOpen ? null : faqKey)}
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



      </div>

      {/* Footer Component */}
      <Footer theme="light" />

    </div>
  );
}

// ── SUBCOMPONENT: STATSSECTION ──────────────────────────────────────────────
function StatsSection({ language }) {
  const [idx, setIdx] = useState(0);
  const tickerData = COMBINED_TICKER_DATA;

  useEffect(() => {
    const interval = setInterval(() => {
      setIdx((prev) => (prev + 1) % tickerData.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [tickerData.length]);

  const L = (o) => (o ? (language === 'hi' ? o.hi : o.en) : '');

  const currentRecord = tickerData[idx];

  const stats = [
    {
      big: '12,480',
      live: true,
      lab: language === 'hi' ? 'सत्यापित कामगार\nतैयार हैं' : 'verified workers\nready to start'
    },
    {
      big: '~4 hr',
      lab: language === 'hi' ? 'औसत समय\nआगमन का' : 'average time\nto arrival'
    },
    {
      big: '0%',
      lab: language === 'hi' ? 'कटौती — पूरा\nपैसा सीधे बैंक में' : 'cut — full pay\nto bank account'
    }
  ];

  return (
    <section className="stats container">
      <div className="stats-grid">
        {stats.map((s, i) => {
          const isTickerCell = i === 0;
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
                    <span className="text-[var(--green)] font-extrabold">
                      {language === 'hi' ? currentRecord.verb_hi : currentRecord.verb_en}
                    </span>
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
