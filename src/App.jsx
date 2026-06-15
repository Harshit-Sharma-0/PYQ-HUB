import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from './supabaseClient';

/* ─── CANVAS PARTICLE BG ───────────────────────────────────────── */
function ParticleCanvas({ theme }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W, H, pts, raf;
    const resize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const N = 70;
    pts = Array.from({ length: N }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const isDark = theme === "dark";
      const dotCol  = isDark ? "rgba(160,140,255,0.45)" : "rgba(91,77,232,0.3)";
      const lineCol = isDark ? "rgba(160,140,255,"      : "rgba(91,77,232,";
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dotCol;
        ctx.fill();
      });
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = lineCol + (0.18 * (1 - dist/130)).toFixed(3) + ")";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [theme]);
  return <canvas ref={ref} style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none" }} />;
}

/* ─── ANIMATED NUMBER ──────────────────────────────────────────── */
function AnimNum({ target, suffix="" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const end = parseInt(target);
        const dur = 1400;
        const step = () => {
          start += end / (dur / 16);
          if (start < end) { setVal(Math.floor(start)); requestAnimationFrame(step); }
          else setVal(end);
        };
        requestAnimationFrame(step);
        ob.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── USE ANIMATE ON SCROLL ────────────────────────────────────── */
function useReveal() {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const ob = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); ob.disconnect(); }}, { threshold: 0.1 });
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  return [ref, vis];
}

/* ─── ICONS ─────────────────────────────────────────────────────── */
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

/* ─── PAPER CARD ────────────────────────────────────────────────── */
// FIX: Added missing `return` statement
function PaperCard({ paper, index }) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const tags = [
    { label: paper.course, cls: "tag-blue"   },
    { label: paper.uni,    cls: "tag-pink"   },
    { label: paper.sem,    cls: "tag-violet" },
    { label: paper.year,   cls: "tag-green"  },
  ];

  const handleDl = async () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 800);
    const response = await fetch(paper.pdf);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${paper.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // FIX: Added `return` here — it was missing entirely
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--card2)" : "var(--card)",
        border: `1px solid ${hovered ? "rgba(124,106,255,0.5)" : "var(--border)"}`,
        borderRadius: "var(--r)",
        padding: "16px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered ? "translateY(-3px) scale(1.005)" : "translateY(0) scale(1)",
        boxShadow: hovered ? "0 12px 40px rgba(124,106,255,0.18)" : "none",
        animation: `cardIn 0.4s ${index * 0.06}s both`,
        cursor: "default",
        flexWrap: "wrap",
      }}
    >
      <style>{`
        @keyframes cardIn {
          from { opacity:0; transform:translateY(14px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes dlPop {
          0%,100% { transform:scale(1); }
          50%      { transform:scale(0.88); }
        }
      `}</style>

      {/* Icon */}
      <div style={{
        width: 44, height: 44, flexShrink: 0,
        background: "var(--accent-dim)",
        border: "1px solid rgba(124,106,255,0.2)",
        borderRadius: 12,
        display: "grid", placeItems: "center",
        fontSize: 20,
        transition: "transform 0.3s",
        transform: hovered ? "rotate(-6deg) scale(1.1)" : "rotate(0) scale(1)",
      }}>{paper.e}</div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontWeight: 600, fontSize: 14,
          color: "var(--text)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          marginBottom: 7,
        }}>{paper.title}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {tags.map((t, i) => (
            <span key={i} className={`tag ${t.cls}`} style={{
              fontSize: 11, fontWeight: 600, padding: "3px 8px",
              borderRadius: 6, whiteSpace: "nowrap",
            }}>{t.label}</span>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
        <button
          onClick={() => window.open(paper.pdf, '_blank')}
          style={{
            padding: "8px 13px",
            border: "1px solid var(--border2)",
            borderRadius: 8,
            background: "transparent",
            color: "var(--text2)",
            fontSize: 12, fontWeight: 600,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
            transition: "all 0.18s",
            fontFamily: "inherit",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.color = "var(--accent2)"; e.currentTarget.style.borderColor = "rgba(124,106,255,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; e.currentTarget.style.borderColor = "var(--border2)"; }}
        >
          <IconEye /> View
        </button>
        <button
          onClick={handleDl}
          style={{
            padding: "8px 13px",
            border: "none",
            borderRadius: 8,
            background: "var(--accent)",
            color: "#fff",
            fontSize: 12, fontWeight: 600,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5,
            boxShadow: "0 2px 12px var(--accent-glow)",
            transition: "all 0.18s",
            fontFamily: "inherit",
            animation: clicked ? "dlPop 0.4s ease" : "none",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px var(--accent-glow)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px var(--accent-glow)"; }}
        >
          <IconDown /> Download
        </button>
      </div>
    </div>
  );
}

/* ─── SELECT FIELD ──────────────────────────────────────────────── */
function Field({ label, value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", letterSpacing: "0.8px", textTransform: "uppercase" }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: "var(--card2)",
          border: `1px solid ${focused ? "var(--accent)" : "var(--border2)"}`,
          borderRadius: "var(--r-sm)",
          padding: "10px 12px",
          color: "var(--text)",
          fontSize: 13,
          outline: "none",
          appearance: "none",
          cursor: "pointer",
          fontFamily: "inherit",
          boxShadow: focused ? "0 0 0 3px var(--accent-glow)" : "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        {options.map(o => <option key={o} value={o === options[0] ? "" : o}>{o}</option>)}
      </select>
    </div>
  );
}

/* ─── ABOUT MODAL ───────────────────────────────────────────────── */
function AboutModal({ onClose }) {
  useEffect(() => {
    const handler = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{
        background: "var(--card)",
        border: "1px solid var(--border2)",
        borderRadius: 20,
        padding: 32,
        maxWidth: 430, width: "100%",
        animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 20, color: "var(--text)" }}>About PYQ Hub</span>
          <button onClick={onClose}
            style={{ width: 32, height: 32, border: "1px solid var(--border)", background: "transparent", borderRadius: 8, cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text2)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(251,113,133,0.12)"; e.currentTarget.style.color = "#fb7185"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}>
            <IconX />
          </button>
        </div>
        {[
          "My PYQ Hub is a free, open platform to access previous year question papers for university academics and competitive entrance exams.",
          "Search by course, semester, year, exam or subject. View PDFs in the browser or download for offline use.",
        ].map((t, i) => (
          <p key={i} style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.75, marginBottom: 8 }}>{t}</p>
        ))}
        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>No login. No paywalls. Free forever.</p>
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <button onClick={onClose} style={{ flex: 1, padding: 11, border: "1px solid var(--border2)", borderRadius: 9, background: "transparent", color: "var(--text2)", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Close</button>
          <button onClick={onClose} style={{ flex: 1, padding: 11, border: "none", borderRadius: 9, background: "var(--accent)", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px var(--accent-glow)" }}>Start Searching ↗</button>
        </div>
      </div>
    </div>
  );
}

/* ─── FLOATING ORBS ─────────────────────────────────────────────── */
function Orbs() {
  return (
    <>
      <div style={{
        position: "fixed", top: -180, left: -180, width: 600, height: 600,
        background: "radial-gradient(circle, rgba(124,106,255,0.1) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
        animation: "floatOrb1 12s ease-in-out infinite",
      }} />
      <div style={{
        position: "fixed", bottom: -100, right: -100, width: 500, height: 500,
        background: "radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 65%)",
        pointerEvents: "none", zIndex: 0,
        animation: "floatOrb2 15s ease-in-out infinite",
      }} />
      <style>{`
        @keyframes floatOrb1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,30px)} }
        @keyframes floatOrb2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-20px)} }
      `}</style>
    </>
  );
}

/* ─── HERO TYPEWRITER ───────────────────────────────────────────── */
function Typewriter({ words }) {
  const [wIdx, setWIdx] = useState(0);
  const [txt, setTxt] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = words[wIdx];
    const timeout = del
      ? txt.length === 0
        ? setTimeout(() => { setDel(false); setWIdx(i => (i+1) % words.length); }, 300)
        : setTimeout(() => setTxt(t => t.slice(0,-1)), 60)
      : txt.length === word.length
        ? setTimeout(() => setDel(true), 1800)
        : setTimeout(() => setTxt(word.slice(0, txt.length+1)), 80);
    return () => clearTimeout(timeout);
  }, [txt, del, wIdx, words]);
  return (
    <span style={{ color: "var(--accent2)" }}>
      {txt}
      <span style={{ animation: "blink 0.9s step-end infinite", color: "var(--accent)" }}>|</span>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </span>
  );
}

/* ─── MAIN APP ──────────────────────────────────────────────────── */
// FIX: Removed the nested function definition that was illegally placed inside App()
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [showAbout, setShowAbout] = useState(false);
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);

  // ── Supabase live data (replaces static AC_DATA) ──
  const [acData, setAcData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function fetchPapers() {
      const { data, error } = await supabase.from('ac_data').select('*');
      if (error) {
        console.error('Supabase fetch error:', error);
      } else {
  setAcData(data.map(row => ({
    title:  row.Title  || row.title,
    course: row.Course || row.course,
    uni:    row.University || row.uni,
    sem:    row.Sem    || row.sem,
    year:   row.Year   || row.year,
    pdf:    row.PDF    || row.pdf,
    e:      row.Emoji  || row.e || "📄",
  })));
}
      setDataLoading(false);
    }
    fetchPapers();
  }, []);

  // Academic filters
  const [acCourse, setAcCourse] = useState("");
  const [acUni,    setAcUni]    = useState("");
  const [acSem,    setAcSem]    = useState("");
  const [acYear,   setAcYear]   = useState("");

  const [heroRef, heroVis]     = useReveal();
  const [filterRef, filterVis] = useReveal();
  const resultsRef = useRef(null);

  // Apply theme to body
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const vars = theme === "dark" ? {
      "--bg":"#060810","--bg2":"#0b0d18","--card":"#0f1120","--card2":"#141728",
      "--border":"rgba(255,255,255,0.06)","--border2":"rgba(255,255,255,0.11)",
      "--accent":"#7c6aff","--accent2":"#a394ff",
      "--accent-dim":"rgba(124,106,255,0.14)","--accent-glow":"rgba(124,106,255,0.28)",
      "--teal":"#2dd4bf","--teal-dim":"rgba(45,212,191,0.12)",
      "--rose":"#fb7185","--rose-dim":"rgba(251,113,133,0.12)",
      "--amber":"#fbbf24","--amber-dim":"rgba(251,191,36,0.12)",
      "--green":"#34d399","--green-dim":"rgba(52,211,153,0.12)",
      "--text":"#eef0f8","--text2":"#8892b0","--text3":"#4a5270",
      "--nav-bg":"rgba(6,8,16,0.82)","--r":"14px","--r-sm":"9px",
    } : {
      "--bg":"#f4f6ff","--bg2":"#eceffe","--card":"#ffffff","--card2":"#f7f8ff",
      "--border":"rgba(0,0,0,0.06)","--border2":"rgba(0,0,0,0.11)",
      "--accent":"#5b4de8","--accent2":"#7c6aff",
      "--accent-dim":"rgba(91,77,232,0.08)","--accent-glow":"rgba(91,77,232,0.2)",
      "--teal":"#0d9488","--teal-dim":"rgba(13,148,136,0.1)",
      "--rose":"#e11d48","--rose-dim":"rgba(225,29,72,0.1)",
      "--amber":"#d97706","--amber-dim":"rgba(217,119,6,0.1)",
      "--green":"#059669","--green-dim":"rgba(5,150,105,0.1)",
      "--text":"#0d1026","--text2":"#4a5270","--text3":"#9aa0bc",
      "--nav-bg":"rgba(244,246,255,0.88)","--r":"14px","--r-sm":"9px",
    };
    Object.entries(vars).forEach(([k,v]) => document.documentElement.style.setProperty(k, v));
  }, [theme]);

  const doSearch = useCallback(() => {
    setSearching(true);
    setResults(null);
    setTimeout(() => {
      const r = acData.filter(p =>
        (!acCourse || p.course === acCourse) &&
        (!acUni    || p.uni    === acUni)    &&
        (!acSem    || p.sem    === acSem)    &&
        (!acYear   || p.year   === acYear)
      );
      setResults(r);
      setSearching(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }, 600);
  }, [acCourse, acUni, acSem, acYear, acData]);

  const S = {
    nav: {
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "var(--nav-bg)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      height: 60,
      display: "flex", alignItems: "center",
      padding: "0 clamp(16px,4vw,40px)", gap: 12,
    },
  };

  return (
    <>
      <style>{`
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; transition: background .35s, color .35s; overflow-x: hidden; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: var(--accent-dim); color: var(--accent2); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--text3); border-radius: 10px; }
        .tag { display: inline-block; }
        .tag-blue   { background: rgba(59,130,246,0.12);  color: #60a5fa; }
        .tag-violet { background: var(--accent-dim);       color: var(--accent2); }
        .tag-green  { background: var(--green-dim);        color: var(--green); }
        .tag-mute   { background: rgba(255,255,255,0.05);  color: var(--text3); }
        .tag-pink   { background: rgba(251,113,133,0.12); color: #fb7185; }
        [data-theme="light"] .tag-blue   { background: rgba(37,99,235,0.08);  color: #2563eb; }
        [data-theme="light"] .tag-mute   { background: var(--bg2);             color: var(--text3); }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes heroReveal { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes liveRing { 0%,100%{transform:scale(1);opacity:.4} 50%{transform:scale(2.4);opacity:0} }
        @keyframes tabSlide { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      <ParticleCanvas theme={theme} />
      <Orbs />

      {/* NAV */}
      <nav style={S.nav}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
          <img src="https://jmvyyurqddhluungbudy.supabase.co/storage/v1/object/public/pyq/logo_file/pyq_hub_nav_logo.jpg" alt="PYQ Hub Logo" style={{
            width: 36, height: 36, borderRadius: "50%",
            objectFit: "cover",
            boxShadow: "0 0 16px rgba(124,106,255,0.35)",
          }} />
          <span style={{
            fontFamily: "'Bricolage Grotesque',sans-serif",
            fontWeight: 900, fontSize: 20, letterSpacing: "-0.5px",
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 40%, #34d399 80%, #fbbf24 100%)",
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradShift 4s ease infinite",
            filter: "drop-shadow(0 0 8px rgba(167,139,250,0.45))",
          }}>PYQ Hub</span>
        </a>
        <div style={{ flex: 1 }} />
        <button onClick={() => setShowAbout(true)}
          style={{ fontSize: 13, fontWeight: 500, color: "var(--text2)", padding: "6px 12px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.color = "var(--accent2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text2)"; }}>
          About
        </button>
        <div style={{ width: 1, height: 20, background: "var(--border2)" }} />
        <button onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}
          style={{ width: 36, height: 36, border: "1px solid var(--border2)", background: "transparent", borderRadius: 9, cursor: "pointer", display: "grid", placeItems: "center", color: "var(--text2)", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-dim)"; e.currentTarget.style.borderColor = "rgba(124,106,255,0.3)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border2)"; }}>
          {theme === "dark" ? <IconSun /> : <IconMoon />}
        </button>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", zIndex: 1, padding: "110px clamp(16px,4vw,40px) 60px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--card)", border: "1px solid var(--border2)",
          borderRadius: 100, padding: "6px 14px 6px 10px",
          fontSize: 12, fontWeight: 600, color: "var(--text2)",
          marginBottom: 28,
          animation: heroVis ? "heroReveal 0.5s ease both" : "none",
        }}>
          <span style={{ position: "relative", width: 7, height: 7, flexShrink: 0 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--green)", display: "block" }} />
            <span style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "var(--green)", opacity: 0.35, animation: "liveRing 2s infinite" }} />
          </span>
          5,000+ papers indexed and growing
        </div>

        <h1 style={{
          fontFamily: "'Bricolage Grotesque', sans-serif",
          fontSize: "clamp(42px,7vw,80px)",
          fontWeight: 800, letterSpacing: "-3px", lineHeight: 1.04,
          color: "var(--text)", marginBottom: 20,
          animation: heroVis ? "heroReveal 0.5s 0.1s ease both" : "none",
          opacity: heroVis ? 1 : 0,
        }}>
          Find Your{" "}
          <span style={{
            background: "linear-gradient(135deg, #a78bfa, #60a5fa, #34d399)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradShift 15s ease infinite",
          }}>
            <Typewriter words={["Past Paper ", "Study Fuel", "PYQ Paper", "Exam Edge"]} />
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(14px,2vw,18px)", color: "var(--text2)", maxWidth: 500,
          margin: "0 auto 44px", lineHeight: 1.7, fontWeight: 300,
          animation: heroVis ? "heroReveal 0.5s 0.2s ease both" : "none",
          opacity: heroVis ? 1 : 0,
        }}>
          Search university papers by course, university, semester and year — completely free.
        </p>

        <div style={{
          display: "flex", justifyContent: "center", gap: "clamp(24px,5vw,56px)", flexWrap: "wrap",
          animation: heroVis ? "heroReveal 0.5s 0.3s ease both" : "none",
          opacity: heroVis ? 1 : 0,
        }}>
          {[["500","+ Papers"],["50","+ Courses"],["100","% Free"]].map(([n,s]) => (
            <div key={n} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 800, fontSize: 30, letterSpacing: "-1.5px", color: "var(--text)" }}>
                <AnimNum target={parseInt(n)} suffix={s} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 24, height: 38, border: "2px solid var(--border2)", borderRadius: 12, display: "grid", placeItems: "start center", padding: "5px 0" }}>
            <div style={{ width: 3, height: 8, background: "var(--accent)", borderRadius: 99, animation: "scrollDot 2s ease infinite" }} />
            <style>{`@keyframes scrollDot { 0%{transform:translateY(0);opacity:1} 80%{transform:translateY(14px);opacity:0} 100%{transform:translateY(0);opacity:0} }`}</style>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 clamp(16px,4vw,24px) 80px", position: "relative", zIndex: 1 }}>

        {/* Data loading indicator */}
        {dataLoading && (
          <div style={{ textAlign: "center", padding: "20px", color: "var(--text3)", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, border: "2px solid var(--border2)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            Loading papers from database...
          </div>
        )}

        {/* Filter Panel */}
        <div ref={filterRef} style={{
          background: "var(--card)", border: "1px solid var(--border)",
          borderRadius: "var(--r)", padding: "clamp(18px,4vw,28px)",
          marginBottom: 28,
          opacity: filterVis ? 1 : 0,
          transform: filterVis ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.5s, transform 0.5s",
        }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "1.4px", textTransform: "uppercase", color: "var(--text3)", marginBottom: 16 }}>
            🎓 Academic Filters
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 12, marginBottom: 18 }}>
            <Field label="Course / Degree" value={acCourse} onChange={setAcCourse}
              options={["All Courses","BCA","B.Com"]} />
            <Field label="University" value={acUni} onChange={setAcUni}
              options={["All Universities","MGKVP","VBSPU"]} />
            <Field label="Semester" value={acSem} onChange={setAcSem}
              options={["All Semesters","Semester 1","Semester 2","Semester 3","Semester 4","Semester 5","Semester 6","Semester 7","Semester 8"]} />
            <Field label="Year" value={acYear} onChange={setAcYear}
              options={["All Years","2024","2023","2022","2021"]} />
          </div>
          <button
            onClick={doSearch}
            disabled={searching}
            style={{
              width: "100%", padding: "14px",
              border: "none", borderRadius: "var(--r-sm)",
              background: "linear-gradient(135deg, var(--accent), #a78bfa)",
              backgroundSize: "200% 200%",
              color: "#fff",
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 15, fontWeight: 800,
              cursor: searching ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
              transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
              boxShadow: "0 6px 28px var(--accent-glow)",
              letterSpacing: "-0.3px",
              opacity: searching ? 0.75 : 1,
              animation: searching ? "none" : "gradShift 4s ease infinite",
            }}
            onMouseEnter={e => { if (!searching) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px var(--accent-glow)"; }}}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 28px var(--accent-glow)"; }}
          >
            {searching
              ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Searching...</>
              : <><IconSearch /> Search Papers</>
            }
          </button>
        </div>

        {/* Results */}
        {results !== null && (
          <div ref={resultsRef}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ fontFamily: "'Bricolage Grotesque',sans-serif", fontWeight: 700, fontSize: 17, color: "var(--text)" }}>
                {results.length > 0 ? "Results" : "No results"}
              </span>
              <span style={{
                fontSize: 12, fontWeight: 700,
                color: results.length > 0 ? "var(--accent2)" : "var(--text3)",
                background: results.length > 0 ? "var(--accent-dim)" : "rgba(255,255,255,0.04)",
                padding: "3px 10px", borderRadius: 100,
                border: `1px solid ${results.length > 0 ? "rgba(124,106,255,0.2)" : "var(--border)"}`,
              }}>
                {results.length} paper{results.length !== 1 ? "s" : ""}
              </span>
            </div>

            {results.length === 0
              ? <div style={{ textAlign: "center", padding: "56px 24px", color: "var(--text3)" }}>
                  <div style={{ fontSize: 44, marginBottom: 14 }}>📭</div>
                  <p style={{ fontSize: 15, lineHeight: 1.7 }}>No papers matched your filters.<br />Try selecting fewer options.</p>
                </div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {results.map((p, i) => <PaperCard key={`${p.title}-${i}`} paper={p} index={i} />)}
                </div>
            }
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "28px 20px", color: "var(--text3)", fontSize: 12, fontWeight: 500, borderTop: "1px solid var(--border)", letterSpacing: "0.2px" }}>
        Made with ❤️ for students &nbsp;·&nbsp;{" "}
        <span style={{ color: "var(--accent2)" }}>My PYQ Hub</span>
        &nbsp;·&nbsp; Free forever
      </footer>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </>
  );
}
