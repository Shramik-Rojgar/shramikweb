import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import BackgroundOrbs from './bg';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { usePageMeta } from '../lib/usePageMeta';

const BASE = 'https://pub-37e3c04824854265b66bbf6ae90c3b5e.r2.dev/Images/gallery/';

const IMAGES = [
  'IMG_0659.jpg', 'IMG_0660.jpg', 'IMG_0664.jpg', 'IMG_0674.jpg',
  'IMG_0675.jpg', 'IMG_0832.jpg', 'IMG_0835.jpg', 'IMG_0837.jpg',
  'IMG_0842.jpg', 'IMG_0855.jpg', 'IMG_0856.jpg', 'IMG_0866.jpg',
  'IMG_0904.jpg', 'IMG_0905.jpg', 'IMG_0910.jpg', 'IMG_0911.jpg',
  'IMG_0912.jpg', 'IMG_0913.jpg', 'IMG_0928.jpg', 'IMG_0929.jpg',
].map(name => ({ name, url: BASE + name }));

export default function GalleryPage({ onNavigate, onBack, language = 'hi', onLanguageChange, aud, setAud }) {
  const [lightbox, setLightbox] = useState(null); // index or null

  usePageMeta({
    title: 'Gallery | Shramik — Real Workers, Real Work',
    description: 'A look at the skilled workers and job sites we connect across India.',
    keywords: 'shramik gallery, skilled workers india, construction workers, labour marketplace photos',
  });

  const L = (hi, en) => language === 'hi' ? hi : en;

  const prev = () => setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length);
  const next = () => setLightbox(i => (i + 1) % IMAGES.length);

  const handleKeyDown = (e) => {
    if (lightbox === null) return;
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-[var(--ink)]"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <Header
        theme="light"
        onNavigate={onNavigate}
        activeTab="gallery"
        language={language}
        onLanguageChange={onLanguageChange}
        setAud={setAud}
      />
      <BackgroundOrbs />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Heading */}
        <div className="flex flex-col items-center text-center gap-3 mb-10">
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wider border-[rgba(229,57,123,0.3)] text-[var(--rani)]"
          >
            {L('हमारी गैलरी', 'Our Gallery')}
          </Badge>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
            {L('असली काम, असली लोग', 'Real Work, Real People')}
          </h1>
          <p className="text-sm font-semibold text-[var(--mut)] max-w-md">
            {L(
              'श्रमिक से जुड़े कुशल कामगार और उनके कार्यस्थल की झलकियाँ।',
              'A glimpse of skilled workers and job sites connected through Shramik.'
            )}
          </p>
        </div>

        {/* Masonry grid */}
        <div
          className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4"
          style={{ columnFill: 'balance' }}
        >
          {IMAGES.map((img, idx) => (
            <div
              key={img.name}
              className="break-inside-avoid mb-3 sm:mb-4 overflow-hidden rounded-2xl cursor-pointer group relative"
              onClick={() => setLightbox(idx)}
            >
              <img
                src={img.url}
                alt={`Shramik worker ${img.name.replace('.jpg', '')}`}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 bg-[rgba(20,16,28,0)] group-hover:bg-[rgba(20,16,28,0.25)] transition-colors duration-300 rounded-2xl" />
            </div>
          ))}
        </div>
      </main>

      <Footer theme="light" onNavigate={onNavigate} />

      {/* Lightbox */}
      <Dialog open={lightbox !== null} onOpenChange={open => !open && setLightbox(null)}>
        <DialogContent
          className="max-w-5xl w-full p-0 bg-[rgba(14,22,38,0.96)] border-none rounded-2xl overflow-hidden"
          style={{ backdropFilter: 'blur(24px)' }}
        >
          <div className="relative flex items-center justify-center min-h-[60vh]">
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Prev */}
            <button
              onClick={prev}
              className="absolute left-3 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            {/* Image */}
            {lightbox !== null && (
              <img
                src={IMAGES[lightbox].url}
                alt={`Shramik ${IMAGES[lightbox].name}`}
                className="max-h-[80vh] max-w-full object-contain rounded-xl"
              />
            )}

            {/* Next */}
            <button
              onClick={next}
              className="absolute right-3 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Counter */}
          {lightbox !== null && (
            <div className="text-center pb-4 text-xs font-bold text-white/50 tracking-wider">
              {lightbox + 1} / {IMAGES.length}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
