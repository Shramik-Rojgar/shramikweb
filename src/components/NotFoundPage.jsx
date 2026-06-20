import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BackgroundOrbs from './bg';

export default function NotFoundPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative font-sans text-[var(--ink)]">
      <BackgroundOrbs />

      <div
        className="relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center gap-6"
        style={{
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.78)',
          boxShadow: '0 16px 48px rgba(20,16,28,0.08)',
        }}
      >
        {/* Brand */}
        <span
          className="font-display font-black text-xl tracking-tight"
          style={{ background: 'var(--grad)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          SHRAMIK
        </span>

        {/* 404 number */}
        <div
          className="font-display font-black leading-none select-none"
          style={{
            fontSize: 'clamp(5rem, 20vw, 8rem)',
            background: 'var(--grad)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </div>

        <Badge
          variant="outline"
          className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider border-[rgba(229,57,123,0.3)] text-[var(--rani)]"
        >
          Page Not Found
        </Badge>

        <Separator className="bg-[rgba(20,16,28,0.06)]" />

        <div className="flex flex-col gap-1.5">
          <h2 className="font-display font-bold text-xl text-[var(--ink)]">
            This page doesn't exist
          </h2>
          <p className="text-sm font-semibold text-[var(--mut)] leading-relaxed max-w-xs">
            The link you followed may be broken or the page may have been removed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-1">
          <Button
            onClick={() => {
              if (onNavigate) {
                onNavigate('home');
              } else {
                window.location.href = '/';
              }
            }}
            className="flex-1 h-12 font-bold rounded-2xl text-white border-0 cursor-pointer"
            style={{ background: 'var(--grad)' }}
          >
            Go to Home
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1 h-12 font-bold rounded-2xl border-[rgba(20,16,28,0.12)] text-[var(--mut)] cursor-pointer hover:text-[var(--ink)]"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
