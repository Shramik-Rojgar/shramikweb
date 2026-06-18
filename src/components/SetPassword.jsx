import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import BackgroundOrbs from './bg';

export default function SetPassword() {
  const [password, setPassword]   = useState('');
  const [confirm,  setConfirm]    = useState('');
  const [loading,  setLoading]    = useState(false);
  const [done,     setDone]       = useState(false);
  const [error,    setError]      = useState('');
  const [ready,    setReady]      = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Supabase puts the session tokens in the URL hash after redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setReady(!!session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    // Sign out so the invite session can't be reused on reload
    await supabase.auth.signOut();
    // Redirect to home after countdown
    let n = 5;
    const timer = setInterval(() => {
      n -= 1;
      setCountdown(n);
      if (n <= 0) {
        clearInterval(timer);
        window.location.href = '/';
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative font-sans">
      <BackgroundOrbs />
      <div
        className="relative z-10 w-full max-w-sm rounded-3xl p-8 flex flex-col gap-6"
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.78)',
          boxShadow: '0 16px 48px rgba(20,16,28,0.08)',
        }}
      >
        {/* Brand */}
        <div className="text-center">
          <span
            className="font-display font-black text-2xl tracking-tight"
            style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            SHRAMIK
          </span>
          <p className="text-sm font-bold text-[var(--mut)] mt-1">Hirer Portal</p>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl"
              style={{ background: 'var(--grad)' }}
            >
              ✓
            </div>
            <h2 className="font-display font-bold text-xl text-[var(--ink)]">Password Set!</h2>
            <p className="text-sm text-[var(--mut)] font-semibold">You can now log in to the Shramik hirer app.</p>
            <p className="text-xs text-[var(--mut)]">Redirecting in {countdown}s…</p>
          </div>
        ) : !ready ? (
          <div className="text-center py-8">
            <p className="text-sm text-[var(--mut)] font-semibold">Verifying your invite link…</p>
            <p className="text-xs text-[var(--mut)] mt-2">If this takes too long, the link may have expired. Contact support.</p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="font-display font-bold text-xl text-[var(--ink)]">Create your password</h2>
              <p className="text-sm text-[var(--mut)] font-semibold mt-1">Set a password to access your Shramik hirer account.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full rounded-xl border border-[rgba(20,16,28,0.10)] bg-white/80 px-4 py-3 text-sm font-medium text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--mut)]">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full rounded-xl border border-[rgba(20,16,28,0.10)] bg-white/80 px-4 py-3 text-sm font-medium text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
              </div>

              {error && (
                <p className="text-xs font-semibold text-[#C91D5E]">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white font-bold py-3 rounded-2xl transition-opacity disabled:opacity-60 cursor-pointer"
                style={{ background: 'var(--grad)' }}
              >
                {loading ? 'Saving…' : 'Create Password'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
