import React from 'react';
import BackgroundOrbs from './bg';
import Header from './Header';
import Footer from './Footer';
import { ShieldCheck, Users, Heart, MapPin, PhoneCall, Check, Award, Briefcase, IndianRupee, Layers } from 'lucide-react';

export default function AboutUsPage({ onNavigate, language = 'hi', onLanguageChange, aud, setAud }) {
  const isHi = language === 'hi';

  const t = {
    title: isHi ? 'श्रमिक के बारे में' : 'About SHRAMIK',
    subtitle: isHi ? 'काम के माध्यम से गरिमा का निर्माण' : 'Building Dignity Through Work',
    intro: isHi 
      ? 'श्रमिक में, हमारा मानना है कि हर कामगार तीन चीजों का हकदार है: पहचान, उचित पारिश्रमिक, और अवसर।' 
      : 'At SHRAMIK, we believe every worker deserves three things: identity, fair wages, and opportunity.',
    
    // Challenges Section
    challengesTitle: isHi ? 'चुनौतियाँ जिनका सामना दैनिक कामगार करते हैं' : 'Challenges Daily Wage Workers Face',
    challengesDesc: isHi
      ? 'पूरे भारत में, लाखों दैनिक वेतनभोगी कामगार हर सुबह लेबर चौकों पर इकट्ठा होते हैं, इस उम्मीद में कि उन्हें दिन का काम मिल सके। वे कुशल, मेहनती और हमारे शहरों के निर्माण के लिए आवश्यक हैं—फिर भी अधिकांश औपचारिक अर्थव्यवस्था में अदृश्य बने हुए हैं।'
      : 'Across India, millions of daily wage workers gather at labour chowks every morning, hoping to secure work for the day. They are skilled, hardworking, and essential to building our cities—yet most remain invisible in the formal economy.',
    challenge1: isHi ? 'कोई सत्यापित पहचान या कार्य प्रोफ़ाइल नहीं होना' : 'No verified identity or work profile',
    challenge2: isHi ? 'बिचौलियों और दलालों द्वारा मजदूरी में भारी कटौती' : 'Wage cuts from middlemen and brokers',
    challenge3: isHi ? 'अनिश्चित दैनिक काम के अवसर' : 'Uncertain work opportunities',
    challenge4: isHi ? 'कोई डिजिटल पहुँच या बाजार में दृश्यता नहीं होना' : 'No digital access or market visibility',
    
    // Story Section
    storyTitle: isHi ? 'हमने श्रमिक क्यों शुरू किया' : 'Why We Started SHRAMIK',
    storyText1: isHi
      ? 'दशकों से यह व्यवस्था अपरिवर्तित रही है। हमने इसे बदलने के लिए श्रमिक की शुरुआत की। श्रमिक एक ऐसा मंच है जो कामगारों और नियोक्ताओं को सीधे जोड़ता है, अनावश्यक बिचौलियों को हटाता है और एक अधिक पारदर्शी श्रम पारिस्थितिकी तंत्र बनाता है।'
      : 'For decades, this system has remained unchanged. We started SHRAMIK to change that. SHRAMIK is a platform that directly connects workers and hirers, removing unnecessary middlemen and creating a more transparent labour ecosystem.',
    missionCallout: isHi
      ? 'हमारा मिशन: कामगारों को सम्मान के साथ कमाने में सक्षम बनाना और नियोक्ताओं को तुरंत विश्वसनीय श्रम खोजने में मदद करना।'
      : 'Our Mission: Enable workers to earn with dignity and help hirers find trusted labour instantly.',
    storyText2: isHi
      ? 'श्रमिक के माध्यम से, कामगार सत्यापित प्रोफ़ाइल बना सकते हैं, अपने कौशल का प्रदर्शन कर सकते हैं, नौकरी के अलर्ट प्राप्त कर सकते हैं और प्रत्येक शिफ्ट के लिए उचित भुगतान पा सकते हैं। नियोक्ता सेकंड में नौकरियां पोस्ट कर सकते हैं, पास के कुशल कामगारों को खोज सकते हैं और आत्मविश्वास के साथ काम पर रख सकते हैं।'
      : 'Through SHRAMIK, workers can create verified profiles, showcase their skills, receive job alerts, and get paid fairly for every shift. Hirers can post jobs in seconds, discover skilled workers nearby, and hire with confidence.',
    
    // Infrastructure Section
    infraTitle: isHi ? 'कार्यबल के लिए बुनियादी ढांचा' : 'Creating Infrastructure for India’s Workforce',
    infraSub: isHi 
      ? 'हम केवल एक नौकरी बाजार से अधिक का निर्माण कर रहे हैं। हम भारत के श्रम बल के विकास के लिए नींव तैयार कर रहे हैं:' 
      : 'We are building more than a job marketplace. We are creating infrastructure for India’s workforce:',
    
    infra1Title: isHi ? 'सत्यापित कामगार पहचान' : 'Verified Worker Identities',
    infra1Desc: isHi ? 'हर कामगार को आधार सत्यापित पहचान और कौशल प्रोफ़ाइल मिलती है।' : 'Every worker gets an Aadhaar-verified identity and digital skills profile.',
    
    infra2Title: isHi ? 'कौशल-आधारित मिलान' : 'Skill-Based Matching',
    infra2Desc: isHi ? 'सही काम के लिए सही हुनर वाले कामगार का स्वचालित चयन।' : 'Automated connections matching the right job parameters to the right skill sets.',
    
    infra3Title: isHi ? 'पारदर्शी मजदूरी खोज' : 'Transparent Wage Discovery',
    infra3Desc: isHi ? 'बाजार दरों की स्पष्ट जानकारी, बिना किसी भेदभाव या कटौती के।' : 'Clear market-driven rates, ensuring fair pay without arbitrary cuts.',
    
    infra4Title: isHi ? 'मजदूर भुगतान संरक्षण' : 'Secure Payments & Wage Protection',
    infra4Desc: isHi ? 'सुरक्षित और समय पर भुगतान सीधे कामगारों के बैंक खातों में।' : 'On-time digital transfers directly into workers\' accounts with complete safety.',
    
    infra5Title: isHi ? 'प्रशिक्षण और प्रमाणन मार्ग' : 'Training & Certification Pathways',
    infra5Desc: isHi ? 'कौशल सुधार और भविष्य में बेहतर आय के अवसरों के लिए मार्ग प्रशस्त करना।' : 'Paving the way for skill improvement, upskilling, and higher income levels.',
    
    // Long term Vision
    visionTitle: isHi ? 'दीर्घकालिक दृष्टिकोण' : 'Our Long-Term Vision',
    visionText: isHi
      ? 'हमारा दीर्घकालिक दृष्टिकोण केवल रोजगार से परे है। हमारा उद्देश्य कामगारों को कौशल उन्नयन (upskilling), सरकारी कल्याणकारी योजनाओं तक पहुँच, वित्तीय समावेशन और विभिन्न उद्योगों में बेहतर अवसरों के माध्यम से सशक्त बनाना है।'
      : 'Our long-term vision goes beyond employment. We aim to empower workers through upskilling, access to government schemes, financial inclusion, and better opportunities across industries.',
    backboneTitle: isHi ? 'भारत का कार्यबल अर्थव्यवस्था की रीढ़ है।' : 'India’s workforce is the backbone of its economy.',
    backboneSub: isHi ? 'यह समय है कि तकनीक उनके लिए भी काम करे।' : 'It is time technology worked for them too.',
    motto: isHi ? '“मेरा काम ही मेरी पहचान है।”' : '“My work is my identity.”',
    
    // Contact Info
    contactTitle: isHi ? 'संपर्क करें' : 'Contact & Support',
    addressLabel: isHi ? 'कार्यालय' : 'Office Address',
    addressVal: isHi ? 'गुरुग्राम, हरियाणा, भारत' : 'Gurugram, Haryana, India',
    missedCallLabel: isHi ? 'पंजीकरण के लिए मिस्ड कॉल दें' : 'Give a Missed Call to Register',
  };

  return (
    <div className="min-h-screen text-[var(--ink)] font-sans flex flex-col justify-between">

      {/* Ambient background glowing blobs */}
      <BackgroundOrbs />

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
        
        {/* 1. HERO SECTION */}
        <section className="text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 font-display text-brand-grad">
            {t.title}
          </h1>
          <h2 className="text-xl md:text-2xl font-bold text-[var(--accent)] mb-4 font-display">
            {t.subtitle}
          </h2>
          <p className="text-base md:text-lg text-[var(--ink)] max-w-2xl mx-auto font-bold leading-relaxed border-l-4 border-[var(--saffron)] pl-4 text-left italic bg-white/40 p-3 rounded-r-xl">
            {t.intro}
          </p>
        </section>

        {/* 2. STORY & CHALLENGES SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 items-center">
          <div className="flex flex-col gap-5">
            <h3 className="text-2xl font-bold text-[var(--ink)] font-display">{t.challengesTitle}</h3>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
              {t.challengesDesc}
            </p>
            <ul className="flex flex-col gap-3">
              {[t.challenge1, t.challenge2, t.challenge3, t.challenge4].map((chal, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 font-semibold text-xs md:text-sm">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center text-white flex-shrink-0">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{chal}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass rounded-3xl p-3 shadow-md w-full">
            <div className="relative aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-inner">
              <img 
                src="https://pub-37e3c04824854265b66bbf6ae90c3b5e.r2.dev/Images/aboutus.jpg" 
                className="w-full h-full object-cover" 
                alt="Building Dignity through Work"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          </div>
        </section>

        {/* 3. WHY WE STARTED & MISSION */}
        <section className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-[var(--ink)] font-display">{t.storyTitle}</h3>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
            {t.storyText1}
          </p>
          
          <div className="bg-brand-grad rounded-3xl p-8 md:p-10 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-white text-lg md:text-xl font-bold font-display leading-relaxed">{t.missionCallout}</p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-y-6 translate-x-6">
              <Heart className="w-48 h-48 text-white" />
            </div>
          </div>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold mt-2">
            {t.storyText2}
          </p>
        </section>

        {/* 4. WORKFORCE INFRASTRUCTURE PILLARS */}
        <section className="flex flex-col gap-6">
          <div className="text-left">
            <h3 className="text-2xl font-bold text-[var(--ink)] font-display">{t.infraTitle}</h3>
            <p className="text-slate-500 text-sm font-semibold mt-1">{t.infraSub}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6 flex flex-col gap-3 border border-slate-200/50">
              <div className="w-10 h-10 rounded-xl bg-orange-soft flex items-center justify-center text-kaam-orange">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--ink)]">{t.infra1Title}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">{t.infra1Desc}</p>
            </div>
            
            <div className="glass rounded-2xl p-6 flex flex-col gap-3 border border-slate-200/50">
              <div className="w-10 h-10 rounded-xl bg-green-soft flex items-center justify-center text-green">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--ink)]">{t.infra2Title}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">{t.infra2Desc}</p>
            </div>

            <div className="glass rounded-2xl p-6 flex flex-col gap-3 border border-slate-200/50">
              <div className="w-10 h-10 rounded-xl bg-yellow-soft flex items-center justify-center text-amber-500">
                <IndianRupee className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--ink)]">{t.infra3Title}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">{t.infra3Desc}</p>
            </div>

            <div className="glass rounded-2xl p-6 flex flex-col gap-3 border border-slate-200/50">
              <div className="w-10 h-10 rounded-xl bg-blue-soft flex items-center justify-center text-blue-500">
                <Briefcase className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--ink)]">{t.infra4Title}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">{t.infra4Desc}</p>
            </div>

            <div className="glass rounded-2xl p-6 md:col-span-2 flex flex-col gap-3 border border-slate-200/50">
              <div className="w-10 h-10 rounded-xl bg-purple-soft flex items-center justify-center text-purple-600">
                <Layers className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h4 className="font-display font-bold text-lg text-[var(--ink)]">{t.infra5Title}</h4>
              <p className="text-xs text-slate-500 font-medium font-sans leading-relaxed">{t.infra5Desc}</p>
            </div>
          </div>
        </section>

        {/* 5. VISION & BANNER CONCLUSION */}
        <section className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-[var(--ink)] font-display">{t.visionTitle}</h3>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold">
            {t.visionText}
          </p>

          <div className="glass-card rounded-3xl p-8 md:p-12 text-center flex flex-col gap-4 items-center justify-center border border-[var(--saffron)]/20 mt-4">
            <h4 className="text-lg md:text-xl font-bold text-[var(--ink)] font-display">
              {t.backboneTitle}
            </h4>
            <p className="text-sm md:text-base text-slate-500 font-semibold max-w-lg leading-relaxed font-sans">
              {t.backboneSub}
            </p>
            
            <div className="text-2xl md:text-3xl font-black text-brand-grad font-display tracking-tight mt-4 border-t border-[var(--divider)] pt-6 w-full max-w-sm">
              {t.motto}
            </div>
          </div>
        </section>

        {/* 6. CONTACT SUPPORT SECTION */}
        <section className="glass rounded-2xl p-6 flex flex-col gap-4 border border-slate-200/60 text-left max-w-md mx-auto w-full">
          <h4 className="font-display font-bold text-lg text-[var(--ink)] flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-kaam-orange" />
            <span>{t.contactTitle}</span>
          </h4>
          <div className="flex flex-col gap-3.5 font-sans font-semibold text-xs md:text-sm">
            <div>
              <span className="text-slate-400 block mb-0.5">{t.addressLabel}</span>
              <span className="text-[var(--ink)] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {t.addressVal}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-1">
              <span className="text-slate-400 block mb-0.5">{t.missedCallLabel}</span>
              <span className="text-kaam-orange font-black text-xl">+91 92368 61784</span>
            </div>
          </div>
        </section>

      </main>

      <Footer theme="light" />
    </div>
  );
}
