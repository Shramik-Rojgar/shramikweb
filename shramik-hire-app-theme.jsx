// shramik-hire-app-theme.jsx — token system + primitives for the Shramik Hire customer app.
// Two themes from the chosen directions: LIGHT = "Glass" (frosted cards over gradient mesh),
// DARK = "Noir" (deep violet-black, saffron accent, glows). Developers: buildHireTheme()
// is the single source of truth — every screen only reads from the theme object `t`.

const HA = {
  disp: "'Space Grotesk', system-ui, sans-serif",
  body: "'Manrope', system-ui, sans-serif",
  rani: '#E5397B', saffron: '#FF8A1E', violet: '#7A3BFF',
  green: '#16B364', cyan: '#0EA5C9', gold: '#C9A227',
};
const HA_DEEP = { '#E5397B': '#C91D5E', '#FF8A1E': '#C2620A', '#7A3BFF': '#5F27D8' };

// extra icon paths (extends IC from shramik-shared.jsx)
const HA_IC = {
  brick: 'M4 7h16v5H4z M4 12h16v5H4z M9 7v5 M14 12v5',
  roller: 'M5 5h12v5H5z M17 7h2.5v4H12v4 M12 15v5',
  bolt: 'M13 3L6 13.5h5L10 21l7-10.5h-5l1-7.5z',
  droplet: 'M12 4c3 4 6 6.8 6 10a6 6 0 11-12 0c0-3.2 3-6 6-10z',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18z M12 7.5v5l3.2 1.8',
  cal: 'M4 6h16v14H4z M4 10.5h16 M8.5 3.5V8 M15.5 3.5V8',
  globe: 'M12 21a9 9 0 100-18 9 9 0 000 18z M3 12h18 M12 3a13.5 13.5 0 010 18 M12 3a13.5 13.5 0 000 18',
  moon: 'M20 13.5A8.5 8.5 0 1110.5 4 6.8 6.8 0 0020 13.5z',
  x: 'M6 6l12 12 M18 6L6 18',
  chev: 'M9.5 6l6 6-6 6',
  star: 'M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.6l-5.2 2.8 1-5.9L3.5 9.4l5.9-.8L12 3.2z',
  card: 'M3 6h18v12H3z M3 10h18 M6.5 14.5H11',
  edit: 'M4.5 19.5l1-4L16 5l3 3L8.5 18.5l-4 1z',
  minus: 'M6 12h12',
};
function haIcon(key, size, color, sw, filled) {
  const d = HA_IC[key] || IC[key];
  const fillIt = filled || key === 'bolt' || key === 'star';
  return <Ic d={d} size={size} color={color} sw={sw || 2} fill={fillIt ? color : 'none'} />;
}

// ── data ──
const HA_CATS = [
  { l: 'Mason', e: 'brick', c: HA.saffron },
  { l: 'Painter', e: 'roller', c: HA.rani },
  { l: 'Electrician', e: 'bolt', c: HA.violet },
  { l: 'Plumber', e: 'droplet', c: HA.cyan },
  { l: 'Carpenter', e: 'jobs', c: HA.green },
  { l: 'Helper', e: 'person', c: HA.gold },
];
const HA_WORKERS = [
  { n: 'Ramu Kumar', short: 'Ramu K.', dev: 'रामू', rating: '4.9', reviews: 132, rate: 900, sk: 'Mason', jobs: 214, yrs: 8, dist: '1.2 km', idx: 0 },
  { n: 'Akbar Ali', short: 'Akbar A.', dev: 'अकबर', rating: '4.8', reviews: 98, rate: 950, sk: 'Electrician', jobs: 187, yrs: 6, dist: '2.1 km', idx: 4 },
  { n: 'Sunil Yadav', short: 'Sunil Y.', dev: 'सुनील', rating: '4.7', reviews: 76, rate: 850, sk: 'Painter', jobs: 142, yrs: 5, dist: '2.8 km', idx: 2 },
  { n: 'Manoj Singh', short: 'Manoj S.', dev: 'मनोज', rating: '4.6', reviews: 54, rate: 800, sk: 'Plumber', jobs: 96, yrs: 4, dist: '3.4 km', idx: 3 },
];

// ── theme builder ──
function buildHireTheme(mode, opts) {
  opts = opts || {};
  if (mode === 'light') {
    const blur = opts.blur == null ? 6 : opts.blur;
    const accent = opts.accent || HA.rani;
    const deep = HA_DEEP[accent] || accent;
    const glass = {
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`,
      border: '1px solid rgba(255,255,255,0.65)',
    };
    return {
      mode: 'light', dark: false,
      deviceBg: '#FBE9F1', bg: '#FDF4F7',
      ink: '#14101C', mut: '#6E6680', faint: '#A79DBB', line: 'rgba(20,16,28,0.10)',
      accent, deep, accent2: HA.saffron, green: HA.green, danger: '#D92D20',
      card: glass,
      cardHi: { ...glass, background: 'rgba(255,255,255,0.82)' },
      hero: { background: `linear-gradient(120deg, ${accent}, ${HA.saffron})`, boxShadow: `0 14px 34px ${accent}59` },
      heroInk: '#fff', heroSub: 'rgba(255,255,255,0.85)',
      cta: { background: `linear-gradient(120deg, ${accent}, ${HA.saffron})`, color: '#fff', boxShadow: `0 10px 26px ${accent}4D` },
      ctaQuiet: { ...glass, background: 'rgba(255,255,255,0.8)', color: deep },
      chipOn: { background: '#14101C', color: '#fff', border: '1px solid #14101C' },
      chipOff: { ...glass, color: '#14101C' },
      navWrap: { margin: '0 16px 14px', borderRadius: 24, padding: '10px 8px', display: 'flex', ...glass, background: 'rgba(255,255,255,0.7)', boxShadow: '0 10px 30px rgba(20,16,28,0.12)' },
      navOn: accent, navOff: '#6E6680',
      glowDot: 'none', glow: function () { return 'none'; },
      inputBg: 'rgba(255,255,255,0.7)',
      phA: '#F3E0EA', phB: '#EED4E2', phInk: '#A0708A',
      mapBg: '#F7E9F0', mapLine: '#EFD8E4', mapRoad: '#FFFFFF',
      amber: '#E8A200',
    };
  }
  return {
    mode: 'dark', dark: true,
    deviceBg: '#0E0B14', bg: '#0E0B14',
    ink: '#FFFFFF', mut: '#7E7490', faint: '#5F5570', line: '#221C2E',
    accent: HA.saffron, deep: HA.saffron, accent2: HA.rani, green: HA.green, danger: '#F97066',
    card: { background: '#1A1622', border: '1px solid #2C2438' },
    cardHi: { background: '#201A2C', border: '1px solid #352B45' },
    hero: { background: '#1A1622', border: '1px solid #3A2230' },
    heroInk: '#fff', heroSub: '#A99EBB',
    cta: { background: `linear-gradient(120deg, ${HA.rani}, ${HA.saffron})`, color: '#fff', boxShadow: '0 6px 24px rgba(229,57,123,0.45)' },
    ctaQuiet: { background: '#1A1622', border: '1px solid #2C2438', color: '#fff' },
    chipOn: { background: HA.saffron, color: '#14101C', border: `1px solid ${HA.saffron}` },
    chipOff: { background: '#1A1622', border: '1px solid #2C2438', color: '#D8D2E4' },
    navWrap: { display: 'flex', padding: '10px 8px 12px', borderTop: '1px solid #221C2E', background: '#120E1A' },
    navOn: HA.saffron, navOff: '#5F5570',
    glowDot: `0 0 8px ${HA.green}`, glow: function (c) { return `0 0 14px ${c}30`; },
    inputBg: '#1A1622',
    phA: '#1A1622', phB: '#221A30', phInk: '#7E7490',
    mapBg: '#131019', mapLine: '#241D31', mapRoad: '#2C2438',
    amber: '#FFB84D',
  };
}

// ── primitives ──
function HPhone({ t, children }) {
  return (
    <AndroidDevice bg={t.deviceBg} dark={t.dark}>
      <div style={{ position: 'relative', height: '100%', overflow: 'hidden', fontFamily: HA.body, background: t.bg }}>
        <HBackdrop t={t} />
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>{children}</div>
      </div>
    </AndroidDevice>
  );
}
function HBackdrop({ t }) {
  if (t.dark) {
    return (
      <React.Fragment>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, #E5397B33, transparent 65%)', top: -80, right: -80 }}></div>
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, #7A3BFF22, transparent 65%)', bottom: 40, left: -100 }}></div>
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      <div style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, #FFB36655, transparent 65%)', top: -90, left: -70 }}></div>
      <div style={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, #F06FA855, transparent 65%)', top: 60, right: -120 }}></div>
      <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, #A78BFA44, transparent 65%)', bottom: 80, left: -60 }}></div>
    </React.Fragment>
  );
}
function HWordmark({ t, size }) {
  const s = size || 22;
  return (
    <span style={{ fontFamily: HA.disp, fontWeight: 700, fontSize: s, letterSpacing: '-0.02em', color: t.ink }}>
      shramik<span style={{ color: t.accent }}> hire</span>
    </span>
  );
}
function HBack({ t }) {
  return (
    <div style={{ width: 38, height: 38, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...t.cardHi }}>
      <div style={{ transform: 'rotate(180deg)', display: 'flex' }}><Ic d={IC.arrow} size={17} color={t.ink} sw={2.4} /></div>
    </div>
  );
}
function HTop({ t, title, sub, trailing, noBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px 4px' }}>
      {!noBack && <HBack t={t} />}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: HA.disp, fontWeight: 700, fontSize: 19, color: t.ink, letterSpacing: '-0.01em' }}>{title}</div>
        {sub && <div style={{ fontSize: 12.5, fontWeight: 600, color: t.mut, marginTop: 1 }}>{sub}</div>}
      </div>
      {trailing}
    </div>
  );
}
function HBtn({ t, children, quiet, small, style }) {
  const base = quiet ? t.ctaQuiet : t.cta;
  return (
    <div style={{
      minHeight: small ? 44 : 54, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontFamily: HA.disp, fontWeight: 700, fontSize: small ? 14.5 : 16.5, cursor: 'pointer', ...base, ...style,
    }}>{children}</div>
  );
}
function HSecTitle({ t, children, right, pad }) {
  return (
    <div style={{ padding: pad || '18px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontFamily: HA.disp, fontWeight: 700, fontSize: 17, color: t.ink }}>{children}</span>
      {right && <span style={{ fontSize: 13, fontWeight: 700, color: t.accent }}>{right}</span>}
    </div>
  );
}
function HChip({ t, on, children, style }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, padding: '9px 15px',
      fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', fontFamily: HA.body,
      ...(on ? t.chipOn : t.chipOff), ...style,
    }}>{children}</span>
  );
}
function HNav({ t, active }) {
  const items = [
    { d: IC.home, l: 'Home' }, { d: IC.search, l: 'Browse' }, { d: IC.doc, l: 'Bookings' }, { d: IC.person, l: 'Profile' },
  ];
  return (
    <div style={t.navWrap}>
      {items.map(function (n, i) {
        const on = i === active;
        return (
          <div key={n.l} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: on ? t.navOn : t.navOff, minHeight: 44, justifyContent: 'center' }}>
            <Ic d={n.d} size={22} sw={on ? 2.4 : 1.9} />
            <span style={{ fontSize: 11, fontWeight: on ? 800 : 600 }}>{n.l}</span>
          </div>
        );
      })}
    </div>
  );
}
function HDot({ t, size }) {
  const s = size || 8;
  return <span style={{ width: s, height: s, borderRadius: '50%', background: t.green, boxShadow: t.glowDot, flexShrink: 0, display: 'inline-block' }}></span>;
}
function HStars({ t, n, size }) {
  const s = size || 22; const count = n == null ? 5 : n;
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[0, 1, 2, 3, 4].map(function (i) {
        return <span key={i} style={{ display: 'flex' }}>{haIcon('star', s, i < count ? t.amber : (t.dark ? '#352B45' : '#E4D5DD'), 2, i < count)}</span>;
      })}
    </div>
  );
}
// theme-aware striped placeholder for photos
function HPh({ t, label, h, radius, style }) {
  return (
    <div style={{
      height: h || 90, borderRadius: radius == null ? 14 : radius, overflow: 'hidden', position: 'relative',
      background: `repeating-linear-gradient(45deg, ${t.phA} 0 10px, ${t.phB} 10px 20px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style,
    }}>
      <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5, color: t.phInk, background: t.dark ? 'rgba(14,11,20,0.7)' : 'rgba(255,255,255,0.75)', padding: '3px 8px', borderRadius: 6 }}>{label || 'photo'}</span>
    </div>
  );
}
// map placeholder — city grid + roads + label
function HMap({ t, h, children, label }) {
  return (
    <div style={{
      height: h || 300, position: 'relative', overflow: 'hidden', background: t.mapBg,
      backgroundImage: `repeating-linear-gradient(0deg, ${t.mapLine} 0 1px, transparent 1px 36px), repeating-linear-gradient(90deg, ${t.mapLine} 0 1px, transparent 1px 36px)`,
    }}>
      <div style={{ position: 'absolute', left: -20, right: -20, top: '38%', height: 12, background: t.mapRoad, transform: 'rotate(-7deg)' }}></div>
      <div style={{ position: 'absolute', top: -30, bottom: -30, left: '30%', width: 9, background: t.mapRoad, transform: 'rotate(10deg)' }}></div>
      <span style={{ position: 'absolute', left: 12, bottom: 10, fontFamily: 'ui-monospace, monospace', fontSize: 10, color: t.phInk }}>map view — live location</span>
      {children}
    </div>
  );
}
function HMapPin({ t, x, y, color }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 22, height: 22, borderRadius: '50%', background: color || t.accent, border: '3px solid #fff', boxShadow: `0 4px 14px ${color || t.accent}66`, transform: 'translate(-50%, -50%)' }}></div>
  );
}
// settings / list row
function HRow({ t, icon, label, sub, value, last, danger }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: last ? 'none' : `1px solid ${t.line}` }}>
      <div style={{ width: 38, height: 38, borderRadius: 12, background: danger ? (t.dark ? '#2A1620' : '#FBE9EC') : (t.dark ? '#221A30' : 'rgba(255,255,255,0.75)'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {haIcon(icon, 19, danger ? t.danger : t.accent, 2)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: danger ? t.danger : t.ink }}>{label}</div>
        {sub && <div style={{ fontSize: 12, fontWeight: 600, color: t.mut, marginTop: 1 }}>{sub}</div>}
      </div>
      {value && <span style={{ fontSize: 12.5, fontWeight: 700, color: t.mut }}>{value}</span>}
      {haIcon('chev', 16, t.faint, 2.2)}
    </div>
  );
}
// escrow / money safety card
function HEscrow({ t, amount, note }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 16, padding: '13px 15px', background: t.dark ? '#12201A' : '#E9F7EF', border: `1px solid ${t.dark ? '#1E3A2C' : '#C7EBD4'}` }}>
      <Ic d={IC.shield} size={22} color={t.green} sw={2} />
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: HA.disp, fontWeight: 700, fontSize: 14.5, color: t.dark ? '#5BE49B' : '#0E7A43' }}>{amount} held in escrow</div>
        <div style={{ fontSize: 11.5, fontWeight: 600, color: t.dark ? '#4E8266' : '#3D8B60', marginTop: 1 }}>{note || 'Released only when you approve the work'}</div>
      </div>
    </div>
  );
}
// worker list row (browse / bookings)
function HWorkerRow({ t, w, trailing, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 18, padding: '12px 14px', ...t.card }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Avatar name={w.dev} idx={w.idx} size={46} />
        <span style={{ position: 'absolute', right: 0, bottom: 1, width: 11, height: 11, borderRadius: '50%', background: t.green, border: `2px solid ${t.dark ? '#1A1622' : '#fff'}`, boxShadow: t.glowDot }}></span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: HA.disp, fontWeight: 700, fontSize: 15, color: t.ink }}>{w.n}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: t.mut, marginTop: 1 }}>{sub || `${w.sk} · ${w.dist} · ${w.jobs} jobs`}</div>
      </div>
      {trailing || (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12.5, fontWeight: 800, color: t.dark ? t.accent : t.ink }}>★ {w.rating}</div>
          <div style={{ fontFamily: HA.disp, fontWeight: 700, fontSize: 14.5, color: t.dark ? '#fff' : t.accent, marginTop: 2 }}>₹{w.rate}</div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  HA, HA_IC, HA_CATS, HA_WORKERS, haIcon, buildHireTheme,
  HPhone, HBackdrop, HWordmark, HBack, HTop, HBtn, HSecTitle, HChip, HNav, HDot, HStars,
  HPh, HMap, HMapPin, HRow, HEscrow, HWorkerRow,
});
