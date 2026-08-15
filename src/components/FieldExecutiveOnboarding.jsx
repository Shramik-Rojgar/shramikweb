import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackgroundOrbs from './bg';
import LaborerRegistrationForm from './LaborerRegistrationForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { supabase } from '../lib/supabase';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

const L = (hi, en, lang) => (lang === 'hi' ? hi : en);

export default function FieldExecutiveOnboarding({ onNavigate, language = 'hi', onLanguageChange }) {
  const [session, setSession] = useState(undefined);
  const [executive, setExecutive] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [modal, setModal] = useState(null); // { type: 'success' | 'duplicate' }
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setExecutive(null);
      return;
    }

    setLoading(true);
    supabase
      .from('field_executives')
      .select('id, full_name, email, status')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setExecutive({ status: 'not_found' });
        } else {
          setExecutive(data);
          // Best-effort last_login update
          supabase
            .from('field_executives')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id)
            .then(({ error: updateErr }) => {
              if (updateErr) console.warn('[field-executive] last_login update failed:', updateErr.message);
            });
        }
        setLoading(false);
      });
  }, [session]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim() || !password) {
      setLoginError(
        L('ईमेल और पासवर्ड आवश्यक हैं', 'Email and password are required', language)
      );
      return;
    }

    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoggingIn(false);

    if (error) {
      setLoginError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const closeModal = () => {
    setModal(null);
    setResetKey(k => k + 1);
  };

  if (loading || session === undefined) {
    return (
      <div className="min-h-screen text-[#1C2733] font-sans flex flex-col justify-between">
        <Header theme="light" onNavigate={onNavigate} language={language} onLanguageChange={onLanguageChange} />
        <main className="flex-grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
        </main>
        <Footer theme="light" onNavigate={onNavigate} />
      </div>
    );
  }

  // ── Logged in but not approved / missing record ──────────────────────────
  if (session && executive && executive.status !== 'approved') {
    return (
      <div className="min-h-screen text-[#1C2733] font-sans flex flex-col justify-between">
        <Header theme="light" onNavigate={onNavigate} language={language} onLanguageChange={onLanguageChange} />
        <BackgroundOrbs />
        <main className="flex-grow flex items-center justify-center px-6">
          <div
            className="w-full max-w-sm rounded-3xl p-8 flex flex-col items-center text-center gap-5"
            style={{
              background: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.78)',
              boxShadow: '0 16px 48px rgba(20,16,28,0.08)',
            }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-100 text-amber-600">
              <AlertCircle size={28} strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-display font-black text-xl text-[var(--ink)]">
                {L('अनुमोन बाकी है', 'Approval Pending', language)}
              </h2>
              <p className="text-sm font-semibold text-[var(--mut)] leading-relaxed">
                {L(
                  'आपका फ़ील्ड एक्ज़ीक्यूटिव खाता अभी तक अप्रूव नहीं हुआ है। कृपया एडमिन से संपर्क करें।',
                  'Your field executive account is not approved yet. Please contact your admin.',
                  language
                )}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm cursor-pointer transition-opacity hover:opacity-90"
              style={{ background: 'var(--grad)' }}
            >
              {L('लॉग आउट', 'Log Out', language)}
            </button>
          </div>
        </main>
        <Footer theme="light" onNavigate={onNavigate} />
      </div>
    );
  }

  // ── Login view ───────────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen text-[#1C2733] font-sans flex flex-col justify-between">
        <Header theme="light" onNavigate={onNavigate} language={language} onLanguageChange={onLanguageChange} />
        <BackgroundOrbs />

        <main className="max-w-md w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 flex-grow flex flex-col justify-center text-left">
          <div className="glass-card rounded-3xl p-5 sm:p-8">
            <h2 className="text-2xl font-bold text-brand-grad mb-2 font-display">
              {L('फ़ील्ड एक्ज़ीक्यूटिव लॉगिन', 'Field Executive Login', language)}
            </h2>
            <p className="text-slate-500 text-sm mb-6 font-semibold">
              {L(
                'मज़दूरों को ऑनबोर्ड करने के लिए अपने खाते में लॉग इन करें।',
                'Log in to your account to onboard labourers.',
                language
              )}
            </p>

            {loginError && (
              <div className="flex items-start gap-3 bg-[rgba(201,29,94,0.08)] border border-[rgba(201,29,94,0.2)] rounded-2xl px-4 py-3 mb-6">
                <AlertCircle size={15} className="text-[var(--accent)] flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                <p className="text-xs font-semibold text-[var(--accent)] leading-relaxed">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {L('ईमेल', 'Email', language)}
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={L('you@example.com', 'you@example.com', language)}
                  className="glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {L('पासवर्ड', 'Password', language)}
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input h-12 border rounded-xl px-4 py-3 focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-brand-grad hover:opacity-90 text-white font-bold h-12 rounded-xl mt-4 cursor-pointer font-display text-base border-0 transition-all shadow-md"
              >
                {isLoggingIn ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> {L('लॉग इन हो रहा है...', 'Logging in...', language)}</>
                ) : (
                  L('लॉग इन करें', 'Log In', language)
                )}
              </Button>
            </form>
          </div>
        </main>
        <Footer theme="light" onNavigate={onNavigate} />
      </div>
    );
  }

  // ── Registration view ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen text-[#1C2733] font-sans flex flex-col justify-between">
      <Header
        theme="light"
        onNavigate={onNavigate}
        language={language}
        onLanguageChange={onLanguageChange}
      />
      <BackgroundOrbs />

      <main className="max-w-xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 flex-grow flex flex-col justify-center text-left">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-brand-grad font-display">
              {L('मज़दूर पंजीकरण', 'Labourer Registration', language)}
            </h2>
            <p className="text-sm text-slate-500 font-semibold">
              {L(
                'नए मज़दूरों का विवरण दर्ज करें और सबमिट करें।',
                'Enter and submit new labourer details.',
                language
              )}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-bold text-[var(--mut)] hover:text-[var(--ink)] underline cursor-pointer"
          >
            {L('लॉग आउट', 'Log out', language)}
          </button>
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-8 md:p-10">
          <LaborerRegistrationForm
            key={resetKey}
            language={language}
            registeredBy={session.user.id}
            submitLabel={L('सबमिट करें', 'Submit', language)}
            onSuccess={() => setModal({ type: 'success' })}
            onDuplicate={() => setModal({ type: 'duplicate' })}
          />
        </div>
      </main>

      <Dialog open={!!modal} onOpenChange={(open) => open || closeModal()}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="items-center text-center">
            {modal?.type === 'success' ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-[#E4F7EC] border border-[#16B364]/20 flex items-center justify-center mb-3">
                  <Check className="w-8 h-8 text-[#16B364] stroke-[3]" />
                </div>
                <DialogTitle className="font-display font-black text-lg text-[var(--ink)]">
                  {L('पंजीकरण सफल!', 'Registration Successful!', language)}
                </DialogTitle>
                <DialogDescription className="text-sm text-[var(--mut)] font-semibold">
                  {L(
                    'मज़दूर का विवरण सुरक्षित हो गया है। अगला विवरण दर्ज करने के लिए ठीक दबाएँ।',
                    'The labourer details have been saved. Press OK to enter the next one.',
                    language
                  )}
                </DialogDescription>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-3">
                  <AlertCircle className="w-8 h-8 text-amber-600 stroke-[3]" />
                </div>
                <DialogTitle className="font-display font-black text-lg text-[var(--ink)]">
                  {L('पहले से पंजीकृत', 'Already Registered', language)}
                </DialogTitle>
                <DialogDescription className="text-sm text-[var(--mut)] font-semibold">
                  {L(
                    'यह मोबाइल नंबर पहले से हमारे सिस्टम में है। कृपया दूसरा नंबर दर्ज करें।',
                    'This mobile number is already registered. Please enter a different number.',
                    language
                  )}
                </DialogDescription>
              </>
            )}
          </DialogHeader>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={closeModal}
              className="bg-brand-grad hover:opacity-90 text-white font-bold rounded-xl px-8 cursor-pointer border-0"
            >
              {L('ठीक है', 'OK', language)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer theme="light" onNavigate={onNavigate} />
    </div>
  );
}
