import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ShieldCheck, Users, Heart, MapPin, PhoneCall } from 'lucide-react';

export default function AboutUsPage({ onNavigate, language = 'hi', onLanguageChange, aud, setAud }) {
  const isHi = language === 'hi';

  const t = {
    title: isHi ? 'हमारे बारे में' : 'About Us',
    subtitle: isHi ? 'भारतीय कुशल कार्यबल को गरिमा और विश्वास के साथ जोड़ना' : 'Connecting India\'s skilled workforce with dignity and trust',
    ourStoryTitle: isHi ? 'हमारी कहानी' : 'Our Story',
    ourStoryText1: isHi 
      ? 'श्रमिक एक ऐसा मंच है जो दैनिक वेतन भोगी कारीगरों (जैसे राजमिस्त्री, बढ़ई, पेंटर) और नियोक्ताओं को बिना किसी बिचौलिए के सीधे जोड़ता है। हमारा मानना है कि हर कारीगर को अपने काम की पूरी कीमत और सम्मान मिलना चाहिए।' 
      : 'Shramik is a platform that directly connects daily wage workers (such as masons, carpenters, painters) with hirers without middlemen. We believe every worker deserves the full price for their labor and the respect they earn.',
    ourStoryText2: isHi
      ? 'हमारी टीम सीधे कंस्ट्रक्शन साइटों पर जाकर, कारीगरों से मिलकर, उनका आधार सत्यापन करती है और ऐप पर उनकी प्रोफ़ाइल बनाती है। इससे हम एक सुरक्षित और भरोसेमंद समुदाय का निर्माण कर रहे हैं।'
      : 'Our team goes directly to construction sites, meets with workers, performs Aadhaar verification, and sets up their digital profiles on the app. Through this ground-level approach, we are building a secure and trusted community.',
    missionTitle: isHi ? 'हमारा मिशन' : 'Our Mission',
    missionText: isHi 
      ? 'भारत के असंगठित श्रम क्षेत्र को डिजिटल सशक्तिकरण प्रदान करना, बिचौलियों की कमीशनखोरी बंद करना और हर कामगार को आर्थिक सुरक्षा देना।' 
      : 'To bring digital empowerment to India\'s unorganized labor sector, eliminate middleman commissions, and provide financial security to every worker.',
    valuesTitle: isHi ? 'हमारे मुख्य स्तंभ' : 'Our Core Values',
    value1Title: isHi ? 'श्रम की गरिमा' : 'Dignity of Labor',
    value1Desc: isHi ? 'कामगारों के काम को सम्मान देना और उनके अधिकारों की रक्षा करना।' : 'Respecting workers\' efforts and protecting their rights.',
    value2Title: isHi ? 'सीधी पहुँच' : 'Direct Connection',
    value2Desc: isHi ? 'कोई बिचौलिया नहीं, कोई कमीशन नहीं। कामगार को १००% मेहनत का पैसा सीधे।' : 'No middlemen, no commission cuts. 100% of earnings go straight to the worker.',
    value3Title: isHi ? 'पारदर्शिता व भरोसा' : 'Trust & Safety',
    value3Desc: isHi ? 'हर प्रोफाइल आधार-सत्यापित और काम का रिकॉर्ड पारदर्शी।' : 'Every profile is Aadhaar-verified with transparent working history.',
    teamTitle: isHi ? 'ग्राउंड टीम' : 'Ground Support Team',
    teamDesc: isHi 
      ? 'हमारी ग्राउंड टीम लगातार कंस्ट्रक्शन साइटों पर जाकर नए कामगारों को ऐप से जोड़ने और उनके सत्यापन में मदद करती है।' 
      : 'Our ground team continuously visits active construction sites to help workers get registered, trained, and verified.',
    contactTitle: isHi ? 'संपर्क करें' : 'Contact & Support',
    addressLabel: isHi ? 'कार्यालय' : 'Office Address',
    addressVal: isHi ? 'गुरुग्राम, हरियाणा, भारत' : 'Gurugram, Haryana, India',
    missedCallLabel: isHi ? 'रजिस्ट्रेशन के लिए मिस्ड कॉल दें' : 'Give a Missed Call to Register',
  };

  return (
    <div className="min-h-screen bg-transparent text-[var(--ink)] font-sans flex flex-col justify-between">
      
      {/* Ambient background glowing blobs */}
      <div className="bg-blobs">
        <span className="blob b1"></span>
        <span className="blob b2"></span>
        <span className="blob b3"></span>
        <span className="blob b4"></span>
      </div>

      <Header 
        theme="light" 
        onNavigate={onNavigate} 
        activeTab="about" 
        language={language} 
        onLanguageChange={onLanguageChange}
        aud={aud}
        setAud={setAud}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-left flex-grow z-10 w-full flex flex-col gap-16">
        
        {/* Hero Copy */}
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-display text-[var(--ink)]">
            {t.title}
          </h1>
          <p className="text-base md:text-lg text-[var(--mut)] max-w-2xl mx-auto font-semibold leading-relaxed">
            {t.subtitle}
          </p>
        </section>

        {/* Story Section with Image Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--ink)] font-display">{t.ourStoryTitle}</h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              {t.ourStoryText1}
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
              {t.ourStoryText2}
            </p>
          </div>
          
          <div className="glass rounded-3xl p-3 shadow-md">
            <div className="relative aspect-video rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center">
              <img 
                src="/team_with_workers.png" 
                className="w-full h-full object-cover" 
                alt="Shramik Ground Team"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          </div>
        </section>

        {/* Mission Banner */}
        <section className="bg-brand-grad rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-2xl font-bold font-display mb-3 text-white">{t.missionTitle}</h3>
            <p className="text-white/90 text-base leading-relaxed font-sans font-medium">{t.missionText}</p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-6 translate-x-6">
            <Heart className="w-48 h-48 text-white" />
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-[var(--ink)] font-display text-center">{t.valuesTitle}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-soft flex items-center justify-center text-kaam-orange">
                <Heart className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--ink)]">{t.value1Title}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">{t.value1Desc}</p>
            </div>
            
            <div className="glass rounded-2xl p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-soft flex items-center justify-center text-green">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--ink)]">{t.value2Title}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">{t.value2Desc}</p>
            </div>

            <div className="glass rounded-2xl p-6 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[var(--ink)]">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--ink)]">{t.value3Title}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">{t.value3Desc}</p>
            </div>
          </div>
        </section>

        {/* Contact and Ground drive details */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[var(--divider)] pt-12">
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold text-[var(--ink)] font-display">{t.teamTitle}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed font-sans">{t.teamDesc}</p>
          </div>
          
          <div className="glass rounded-2xl p-6 flex flex-col gap-4 border border-slate-200/60 text-left">
            <h4 className="font-display font-bold text-base text-[var(--ink)] flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-kaam-orange" />
              <span>{t.contactTitle}</span>
            </h4>
            <div className="flex flex-col gap-2 font-sans font-semibold text-xs md:text-sm">
              <div>
                <span className="text-slate-400 block mb-0.5">{t.addressLabel}</span>
                <span className="text-[var(--ink)] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {t.addressVal}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-2.5 mt-1">
                <span className="text-slate-400 block mb-0.5">{t.missedCallLabel}</span>
                <span className="text-kaam-orange font-bold text-lg">+91 92368 61784</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer theme="light" />
    </div>
  );
}
