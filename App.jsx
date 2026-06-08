import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// CONSTANTS
// ============================================================
const FORFAITS = {
  essentiel: { id: 'essentiel', nom: 'Essentiel', prix: 49, color: '#8B7355' },
  croissance: { id: 'croissance', nom: 'Croissance', prix: 99, color: '#B8860B' },
  premium: { id: 'premium', nom: 'Premium', prix: 179, color: '#D4AF37' },
  reseau: { id: 'reseau', nom: 'Réseau', prix: 199, extraParSalon: 50, color: '#9C7BD0' },
};
const PRESTATIONS = ['Coupe homme','Coupe femme','Coupe enfant','Barbe','Teinture / Coloration','Dessin / Tracé'];
const VILLES = ['Saint-Denis','Saint-Paul','Saint-Pierre','Le Tampon','Saint-Louis','Sainte-Marie','Saint-Benoît','Saint-André','Saint-Joseph','Sainte-Suzanne','Le Port','Saint-Leu'];
const ADMIN_CODE = 'ADMIN2025';
const HEURES = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];
const JOURS = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
const JOURS_LABELS = { lundi:'Lundi', mardi:'Mardi', mercredi:'Mercredi', jeudi:'Jeudi', vendredi:'Vendredi', samedi:'Samedi', dimanche:'Dimanche' };
const HORAIRES_DEFAULT = { lundi:{ouvert:true,debut:'09:00',fin:'19:00'}, mardi:{ouvert:true,debut:'09:00',fin:'19:00'}, mercredi:{ouvert:true,debut:'09:00',fin:'19:00'}, jeudi:{ouvert:true,debut:'09:00',fin:'19:00'}, vendredi:{ouvert:true,debut:'09:00',fin:'19:00'}, samedi:{ouvert:true,debut:'09:00',fin:'19:00'}, dimanche:{ouvert:false,debut:'09:00',fin:'13:00'} };

// ============================================================
// GLOBAL CSS
// ============================================================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,500&family=Jost:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0a0a0b;--surface:#121214;--surface2:#1a1a1d;--card:#161618;--card2:#1e1e22;
  --cream:#EFE3C8;--cream-light:#F6EEDB;--cream-dim:#C9BC9E;--cream-pale:rgba(239,227,200,0.07);
  --brass:#EFE3C8;--brass-light:#F6EEDB;--brass-dim:rgba(239,227,200,0.3);--brass-pale:rgba(239,227,200,0.07);
  --bordeaux:#3a2a22;--bordeaux-light:#4a362c;
  --text:#F2F2F0;--text-dim:#9A9A98;--text-muted:#5E5E5C;
  --success:#4C8C6A;--danger:#B04848;--border:rgba(255,255,255,0.1);
}
body{background:var(--bg);color:var(--text);font-family:'Jost',system-ui,sans-serif;font-size:16px;font-weight:400;line-height:1.65;min-height:100vh;-webkit-font-smoothing:antialiased;letter-spacing:.01em;}
h1,h2,h3,h4{font-family:'Fraunces','Times New Roman',serif;color:var(--text);letter-spacing:-.01em;line-height:1.12;font-weight:600;}
button{cursor:pointer;font-family:inherit;}
input,textarea,select{font-family:inherit;}
::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:var(--surface);}::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:3px;}
@keyframes fadeInUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes poleMove{from{background-position:0 0;}to{background-position:0 60px;}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(239,227,200,.3);}50%{box-shadow:0 0 0 8px rgba(239,227,200,0);}}
.afu{animation:fadeInUp .5s cubic-bezier(.2,.8,.2,1) both;}
.af{animation:fadeIn .35s ease both;}
.s1{animation-delay:.05s;}.s2{animation-delay:.1s;}.s3{animation-delay:.15s;}.s4{animation-delay:.2s;}.s5{animation-delay:.25s;}
.card-hover{transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s,border-color .2s;}
.card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(0,0,0,.5);border-color:rgba(255,255,255,.2)!important;}
.pole{width:9px;border-radius:5px;background:repeating-linear-gradient(0deg,#CC2222 0,#CC2222 10px,#F5F5F5 10px,#F5F5F5 20px,#1A4F9A 20px,#1A4F9A 30px);animation:poleMove 1.8s linear infinite;}
.divider{height:1px;background:var(--border);margin:14px 0;}
.fi{background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:12px;padding:12px 15px;width:100%;font-size:15px;transition:border-color .2s,box-shadow .2s;outline:none;}
.fi:focus{border-color:var(--cream-dim);box-shadow:0 0 0 3px rgba(239,227,200,.08);}
.fi::placeholder{color:var(--text-muted);}
.fi option{background:var(--card2);}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 24px;border-radius:12px;font-size:13px;font-weight:500;letter-spacing:.08em;border:none;transition:all .2s;font-family:'Jost',sans-serif;text-transform:uppercase;}
.btn-b{background:var(--cream);color:#1a1a16;}
.btn-b:hover{background:var(--cream-light);transform:translateY(-1px);}
.btn-o{background:rgba(255,255,255,.06);color:var(--text);border:1px solid var(--border);}
.btn-o:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25);}
.btn-r{background:rgba(176,72,72,.15);color:#E89090;border:1px solid rgba(176,72,72,.3);}
.btn-r:hover{background:rgba(176,72,72,.25);}
.btn-g{background:var(--success);color:#fff;}
.btn-g:hover{filter:brightness(1.12);}
.btn-sm{padding:8px 16px;font-size:13px;border-radius:10px;}
.btn-lg{padding:16px 32px;font-size:16px;border-radius:14px;}
.bubble-ai{background:var(--surface2);border:1px solid var(--border);border-radius:6px 16px 16px 16px;padding:12px 16px;max-width:84%;}
.bubble-u{background:var(--cream);color:#1a1a16;border-radius:16px 6px 16px 16px;padding:12px 16px;max-width:84%;margin-left:auto;}
@media(max-width:640px){h1{font-size:2rem;}h2{font-size:1.5rem;}.hide-sm{display:none!important;}}
/* Icon square button (back/fav) */
.icon-sq{width:42px;height:42px;border-radius:12px;background:rgba(20,20,22,.7);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.12);color:var(--text);display:inline-flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;transition:all .2s;flex-shrink:0;}
.icon-sq:hover{background:rgba(30,30,34,.9);}
/* Info pill */
.info-pill{display:inline-flex;align-items:center;gap:6px;padding:8px 13px;border-radius:10px;background:var(--surface2);border:1px solid var(--border);font-size:13px;color:var(--text-dim);font-weight:600;}
/* Hero search */
.hero-search{background:var(--surface2);border:1px solid var(--border);border-radius:16px;display:flex;align-items:center;gap:0;overflow:hidden;transition:border-color .2s,box-shadow .2s;max-width:660px;width:100%;}
.hero-search:focus-within{border-color:var(--cream-dim);box-shadow:0 0 0 3px rgba(239,227,200,.08);}
.hero-search input{background:none;border:none;color:var(--text);padding:16px 20px;font-size:15px;outline:none;flex:1;min-width:0;}
.hero-search input::placeholder{color:var(--text-muted);}
.hero-search .sep{width:1px;height:28px;background:var(--border);flex-shrink:0;}
.hero-search select{background:none;border:none;color:var(--text-dim);padding:16px 16px;font-size:14px;outline:none;cursor:pointer;min-width:0;}
.hero-search .search-btn{background:var(--cream);border:none;color:#1a1a16;padding:11px 22px;margin:6px;border-radius:11px;font-size:12px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all .2s;font-family:'Jost',sans-serif;}
.hero-search .search-btn:hover{background:var(--cream-light);}
/* Category chips */
.cat-chip{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;border-radius:50px;border:1px solid var(--border);background:var(--surface2);color:var(--text-dim);font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;white-space:nowrap;}
.cat-chip:hover,.cat-chip.active{background:var(--cream);border-color:var(--cream);color:#1a1a16;}
/* Salon card cover */
.salon-cover{width:100%;height:160px;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:54px;font-weight:600;letter-spacing:-.02em;overflow:hidden;position:relative;flex-shrink:0;}
/* Dispo badge */
.dispo-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;background:rgba(76,140,106,.18);color:#7FD0A4;border:1px solid rgba(76,140,106,.3);backdrop-filter:blur(8px);}
.dispo-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:#7FD0A4;display:inline-block;}
/* Slot picker */
.slot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:8px;margin-top:10px;}
.slot-btn{padding:10px 4px;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text-dim);font-size:14px;font-weight:600;cursor:pointer;text-align:center;transition:all .15s;}
.slot-btn:hover:not(:disabled){border-color:var(--cream-dim);color:var(--text);background:var(--cream-pale);}
.slot-btn.selected{background:var(--cream);color:#1a1a16;border-color:var(--cream);font-weight:700;}
.slot-btn:disabled{opacity:.3;cursor:not-allowed;}
/* Pro section */
.pro-section{background:var(--surface);border-top:1px solid var(--border);padding:64px 24px;text-align:center;}
/* Stat cards */
.stat-card{background:var(--surface2);border:1px solid var(--border);border-radius:16px;padding:22px;text-align:center;flex:1;min-width:120px;}
.badge-sponsored{display:inline-block;background:var(--cream);color:#1a1a16;font-size:10px;font-weight:600;padding:4px 11px;border-radius:8px;letter-spacing:.1em;text-transform:uppercase;font-family:'Jost',sans-serif;}
`;

// ============================================================
// STORAGE
// ============================================================
function sget(key) {
  try { return window.storage?.get ? window.storage.get(key) : null; } catch { return null; }
}
function sset(key, val) {
  try { if (window.storage?.set) window.storage.set(key, val, { shared: true }); } catch {}
}
function sdel(key) {
  try { if (window.storage?.delete) window.storage.delete(key); } catch {}
}
function slist(prefix) {
  try {
    if (window.storage?.list) return (window.storage.list() || []).filter(k => k.startsWith(prefix));
    return [];
  } catch { return []; }
}
function getAllByPrefix(prefix) {
  return slist(prefix).map(k => sget(k)).filter(Boolean);
}

// ============================================================
// HELPERS
// ============================================================
function uid() { return Math.random().toString(36).slice(2, 10); }
function today() { return new Date().toISOString().split('T')[0]; }
function fmtDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function fmtPrice(p) { return p ? `${p} €` : '—'; }
function fmtHoraires(h) {
  if (!h || typeof h === 'string') return h || '';
  const labels = { lundi:'Lun',mardi:'Mar',mercredi:'Mer',jeudi:'Jeu',vendredi:'Ven',samedi:'Sam',dimanche:'Dim' };
  const open = JOURS.filter(j => h[j]?.ouvert);
  if (!open.length) return 'Fermé';
  const firstH = h[open[0]];
  if (open.length === 7 || (open.length >= 5 && open.every(j => h[j].debut === firstH.debut && h[j].fin === firstH.fin))) {
    return `${labels[open[0]]}–${labels[open[open.length-1]]} ${firstH.debut.replace(':','h')}–${firstH.fin.replace(':','h')}`;
  }
  return open.map(j => `${labels[j]} ${h[j].debut.replace(':','h')}–${h[j].fin.replace(':','h')}`).join(', ');
}
function avgNote(avis) {
  if (!avis?.length) return 0;
  return (avis.reduce((s, a) => s + (a.note || 0), 0) / avis.length).toFixed(1);
}
function stars(n) {
  const full = Math.round(n);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}
function phoneLink(tel, msg) {
  return `https://wa.me/${(tel || '').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
}
function smsLink(tel, msg) {
  return `sms:${tel}?body=${encodeURIComponent(msg)}`;
}
function genCode(prefix) { return (prefix || '') + Math.random().toString(36).slice(2, 7).toUpperCase(); }
// Promo helpers — a salon can flag one specific date in the month with a % discount
function getPromo(salon, dateStr) {
  const p = salon?.promo;
  if (p && p.date && p.date === dateStr && p.reduction > 0) return p;
  return null;
}
function applyPromo(prix, promo) {
  if (!promo || !prix) return prix;
  return Math.round(prix * (1 - promo.reduction / 100));
}

// ============================================================
// ICONS (elegant thin line — no emoji)
// ============================================================
const ICONS = {
  scissors: <g><circle cx="6" cy="6" r="2.6"/><circle cx="6" cy="18" r="2.6"/><line x1="20" y1="4" x2="8.1" y2="15.9"/><line x1="14.5" y1="14.5" x2="20" y2="20"/><line x1="8.1" y1="8.1" x2="12" y2="12"/></g>,
  comb: <g><path d="M3 8h18"/><path d="M5 8v4M8.2 8v8M11.4 8v4M14.6 8v8M17.8 8v4M21 8v8"/></g>,
  razor: <g><rect x="2.5" y="13" width="10" height="3.5" rx="1" transform="rotate(-45 7.5 14.75)"/><line x1="13" y1="11" x2="20.5" y2="3.5"/></g>,
  child: <g><circle cx="12" cy="7" r="3"/><path d="M7 21v-2.5a5 5 0 0 1 10 0V21"/></g>,
  user: <g><circle cx="12" cy="8" r="3.4"/><path d="M6 21v-1.5a6 6 0 0 1 12 0V21"/></g>,
  users: <g><circle cx="9" cy="8" r="3"/><path d="M4 21v-1.5a5 5 0 0 1 10 0V21"/><path d="M16 5.5a3 3 0 0 1 0 5.7M20 21v-1.5a5 5 0 0 0-3.5-4.8"/></g>,
  droplet: <path d="M12 3l5.2 7.4a6.3 6.3 0 1 1-10.4 0z"/>,
  pen: <g><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.4-7L2 2l4 14.6L13 18z"/><path d="M2 2l7.6 7.6"/><circle cx="11" cy="11" r="1.6"/></g>,
  calendar: <g><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="3.5" y1="10" x2="20.5" y2="10"/></g>,
  clock: <g><circle cx="12" cy="12" r="8.5"/><polyline points="12 7.5 12 12 15 13.8"/></g>,
  phone: <path d="M21 16.4v2.7a1.8 1.8 0 0 1-2 1.8 17.8 17.8 0 0 1-7.7-2.8 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3.1 5a1.8 1.8 0 0 1 1.8-2h2.7a1.8 1.8 0 0 1 1.8 1.5c.1.8.3 1.6.6 2.4a1.8 1.8 0 0 1-.4 1.9l-1.1 1.1a14 14 0 0 0 5.4 5.4l1.1-1.1a1.8 1.8 0 0 1 1.9-.4c.8.3 1.6.5 2.4.6A1.8 1.8 0 0 1 21 16.4z"/>,
  pin: <g><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="2.6"/></g>,
  star: <polygon points="12 3 14.6 8.6 20.7 9.3 16.2 13.5 17.4 19.6 12 16.5 6.6 19.6 7.8 13.5 3.3 9.3 9.4 8.6 12 3"/>,
  heart: <path d="M20.4 5.2a4.9 4.9 0 0 0-7 0L12 6.6l-1.4-1.4a4.9 4.9 0 1 0-7 7l1.4 1.4L12 21l7-7.1 1.4-1.4a4.9 4.9 0 0 0 0-7z"/>,
  camera: <g><path d="M22 18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.2l1.6-2.4h6.4L18.8 6H20a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="3.6"/></g>,
  chat: <path d="M20.5 11.5a8 8 0 0 1-8.5 8 9 9 0 0 1-3.6-.8L3.5 20l1.3-4.6A8 8 0 0 1 4 11.5a8 8 0 0 1 8.5-8 8 8 0 0 1 8 8z"/>,
  search: <g><circle cx="11" cy="11" r="7"/><line x1="20.5" y1="20.5" x2="16.4" y2="16.4"/></g>,
  sparkle: <g><path d="M12 3l1.8 5L19 9.8l-5.2 1.8L12 17l-1.8-5.4L5 9.8 10.2 8 12 3z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z"/></g>,
  lock: <g><rect x="4" y="11" width="16" height="10" rx="2.5"/><path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11"/></g>,
  bolt: <polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2"/>,
  chart: <g><line x1="6" y1="20" x2="6" y2="13"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="18" y1="20" x2="18" y2="9"/></g>,
  list: <g><line x1="8.5" y1="6.5" x2="20" y2="6.5"/><line x1="8.5" y1="12" x2="20" y2="12"/><line x1="8.5" y1="17.5" x2="20" y2="17.5"/><circle cx="4.5" cy="6.5" r=".6"/><circle cx="4.5" cy="12" r=".6"/><circle cx="4.5" cy="17.5" r=".6"/></g>,
  tag: <g><path d="M20.6 13.4l-7.2 7.2a1.8 1.8 0 0 1-2.6 0l-7.8-7.8V3.5h9.3l8.3 8.3a1.8 1.8 0 0 1 0 1.6z"/><circle cx="7.5" cy="7.5" r="1.1"/></g>,
  cycle: <g><polyline points="21 4 21 9 16 9"/><polyline points="3 20 3 15 8 15"/><path d="M4.5 9a8 8 0 0 1 13.2-3L21 9M3 15l3.3 3A8 8 0 0 0 19.5 15"/></g>,
  store: <g><path d="M4 9.5 5.3 4h13.4L20 9.5"/><path d="M5 9.5V20h14V9.5"/><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/><path d="M10 20v-5h4v5"/></g>,
  hourglass: <g><path d="M6 3h12M6 21h12"/><path d="M7 3v3.6c0 .5.2 1 .6 1.4L12 12l4.4-4c.4-.4.6-.9.6-1.4V3"/><path d="M7 21v-3.6c0-.5.2-1 .6-1.4L12 12l4.4 4c.4.4.6.9.6 1.4V21"/></g>,
  info: <g><circle cx="12" cy="12" r="8.5"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="8" r=".7"/></g>,
  settings: <g><circle cx="12" cy="12" r="2.8"/><path d="M19.1 14.4l.9 1.6-2 2-1.6-.9a6.5 6.5 0 0 1-2.2.9L14 20h-3l-.2-1.9a6.5 6.5 0 0 1-2.2-.9l-1.6.9-2-2 .9-1.6a6.5 6.5 0 0 1-.9-2.2L4 12v-1l.1-.5.1-.7a6.5 6.5 0 0 1 .9-2.2L4.2 6 6 4l1.6.9a6.5 6.5 0 0 1 2.2-.9L10 2h3l.2 1.9a6.5 6.5 0 0 1 2.2.9L17 3.8 19 6l-.9 1.6c.4.7.7 1.4.9 2.2L21 10v3l-1.9.2a6.5 6.5 0 0 1-.9 2.2z"/></g>,
  plus: <g><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></g>,
  trash: <g><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></g>,
};

function Icon({ name, size = 17, stroke = 1.5, style }) {
  const g = ICONS[name];
  if (!g) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, verticalAlign: '-0.18em', ...style }} aria-hidden="true">{g}</svg>
  );
}

// Inline label with a leading icon (tabs, buttons, pills)
function L({ icon, children, gap = 7, size }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>{icon ? <Icon name={icon} size={size} /> : null}{children}</span>;
}

// ============================================================
// AI
// ============================================================
async function callAI(messages, system = '') {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': '', 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, system, messages }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  return data.content?.[0]?.text || '';
}

// ============================================================
// DEMO SEED DATA
// ============================================================
function seedData() {
  if (sget('seeded')) return;
  const salons = [
    { id: 's1', nom: 'Barbershop Le Raffiné', ville: 'Saint-Pierre', adresse: '12 rue du Commerce', telephone: '0692123456', horaires: 'Lun–Sam 9h–19h', lienAvisGoogle: '#', infos: 'Parking gratuit à 50m', forfait: 'premium', miseEnAvant: true, lat: -21.34, lng: 55.47,
      barbiers: [
        { nom: 'Karim', tarifs: { 'Coupe homme': 18, 'Barbe': 12, 'Dessin / Tracé': 8 }, portfolio: [] },
        { nom: 'Dylan', tarifs: { 'Coupe homme': 16, 'Coupe enfant': 12, 'Barbe': 10, 'Teinture / Coloration': 30 }, portfolio: [] },
      ]},
    { id: 's2', nom: 'Le Coiffeur Créole', ville: 'Saint-Pierre', adresse: '45 bd Hubert-Delisle', telephone: '0692234567', horaires: 'Mar–Sam 8h30–18h', lienAvisGoogle: '#', infos: 'Sur rendez-vous uniquement', forfait: 'croissance', miseEnAvant: false, lat: -21.35, lng: 55.46,
      barbiers: [
        { nom: 'Fabrice', tarifs: { 'Coupe homme': 15, 'Coupe femme': 20, 'Coupe enfant': 10 }, portfolio: [] },
      ]},
    { id: 's3', nom: 'Blade & Style', ville: 'Saint-Denis', adresse: '3 rue de Paris', telephone: '0692345678', horaires: 'Lun–Ven 9h–20h, Sam 9h–17h', lienAvisGoogle: '#', infos: 'Wifi, café offert', forfait: 'essentiel', miseEnAvant: false, lat: -20.88, lng: 55.44,
      barbiers: [
        { nom: 'Yoann', tarifs: { 'Coupe homme': 20, 'Barbe': 15, 'Dessin / Tracé': 10, 'Coupe enfant': 12 }, portfolio: [] },
        { nom: 'Maeva', tarifs: { 'Coupe femme': 25, 'Teinture / Coloration': 35, 'Coupe enfant': 13 }, portfolio: [] },
      ]},
  ];
  salons.forEach(s => sset(`salon:${s.id}`, s));
  const avisData = [
    { id: 'a1', salonId: 's1', barbier: 'Karim', clientNom: 'Julien M.', note: 5, commentaire: 'Coupe parfaite, ambiance top !', date: '2025-05-20' },
    { id: 'a2', salonId: 's1', barbier: 'Dylan', clientNom: 'Tom R.', note: 4, commentaire: 'Très propre, Dylan est précis.', date: '2025-05-22' },
    { id: 'a3', salonId: 's2', barbier: 'Fabrice', clientNom: 'Alex P.', note: 5, commentaire: 'Le meilleur de Saint-Pierre !', date: '2025-05-18' },
    { id: 'a4', salonId: 's3', barbier: 'Yoann', clientNom: 'Romain S.', note: 4, commentaire: 'Bon rapport qualité prix.', date: '2025-05-25' },
  ];
  avisData.forEach(a => sset(`avis:${a.id}`, a));
  // sample rdv
  const rdvData = [
    { id: 'r1', salonId: 's1', barbier: 'Karim', prestation: 'Coupe homme', prix: 18, date: today(), heure: '10:00', clientId: 'c_demo', clientNom: 'Marc D.', clientTel: '0692000001', statut: 'confirmé', createdAt: new Date().toISOString() },
    { id: 'r2', salonId: 's1', barbier: 'Dylan', prestation: 'Barbe', prix: 10, date: today(), heure: '14:30', clientId: 'c_demo', clientNom: 'Seb L.', clientTel: '0692000002', statut: 'en attente', createdAt: new Date().toISOString() },
  ];
  rdvData.forEach(r => sset(`rdv:${r.id}`, r));
  sset('seeded', true);
}

// ============================================================
// SMALL UI
// ============================================================
function Divider() { return <div className="divider" />; }

function Spin() {
  return <span style={{ display: 'inline-block', width: 18, height: 18, border: '2px solid var(--brass-dim)', borderTopColor: 'var(--brass)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />;
}

function StarRow({ n, size = 16 }) {
  return <span style={{ color: '#D4AF37', fontSize: size, letterSpacing: 1 }}>{stars(Number(n) || 0)}</span>;
}

function Badge({ children, color = 'var(--brass)', bg }) {
  return (
    <span style={{ display: 'inline-block', background: bg || 'rgba(184,134,11,0.15)', color, fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 2, letterSpacing: '.06em', textTransform: 'uppercase', border: `1px solid ${color}33` }}>
      {children}
    </span>
  );
}

function LockBadge({ plan }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(0,0,0,0.4)', borderRadius: 6, border: '1px solid var(--border)' }}>
      <Icon name="lock" size={19} style={{ color: 'var(--cream-dim)' }} />
      <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>
        Disponible en formule <strong style={{ color: 'var(--brass)' }}>{plan}</strong>
        {plan === 'Premium' ? ', Réseau' : plan === 'Croissance' ? ', Premium ou Réseau' : ''} ou supérieure
      </span>
    </div>
  );
}

function Modal({ onClose, children, title, width = 560 }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.8)' }} onClick={e => e.stopPropagation()}>
        {title && (
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 18 }}>{title}</h3>
            <button onClick={onClose} className="btn btn-o btn-sm">✕</button>
          </div>
        )}
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ padding: '9px 16px', fontSize: 14, fontWeight: 600, border: 'none', background: 'none', color: active === t.id ? 'var(--brass)' : 'var(--text-dim)', borderBottom: active === t.id ? '2px solid var(--brass)' : '2px solid transparent', transition: 'all .2s', cursor: 'pointer', letterSpacing: '.03em' }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ============================================================
// BARBER POLE HEADER
// ============================================================
function PoleHeader({ onAdmin }) {
  return (
    <header style={{ background: 'rgba(10,10,11,.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', padding: '0 18px', height: 58, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 90 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#1a1a16' }}><Icon name="scissors" size={18} /></div>
      <span style={{ fontFamily: "'Fraunces', serif", fontSize: 23, fontWeight: 600, color: 'var(--text)', letterSpacing: '-.02em' }}>BarberLink</span>
      <div style={{ flex: 1 }} />
      <button onClick={onAdmin} className="btn btn-o btn-sm" style={{ fontSize: 12 }}>Admin</button>
    </header>
  );
}

// ============================================================
// SPLINE 3D BACKGROUND
// ============================================================
const SPLINE_URL = 'https://prod.spline.design/Nxh1g8AzQO7NMtDV/scene.splinecode';       // hero / ambiance
const SPLINE_SCRIPT = 'https://unpkg.com/@splinetool/viewer@1.12.97/build/spline-viewer.js';

// Ensures the spline-viewer custom element module is loaded once.
function useSplineLoaded() {
  const [ready, setReady] = useState(!!window.customElements?.get?.('spline-viewer'));
  useEffect(() => {
    if (window.customElements?.get?.('spline-viewer')) { setReady(true); return; }
    if (!document.querySelector('script[data-spline-viewer]')) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = SPLINE_SCRIPT;
      s.setAttribute('data-spline-viewer', '1');
      document.head.appendChild(s);
    }
    const t = setInterval(() => {
      if (window.customElements?.get?.('spline-viewer')) { setReady(true); clearInterval(t); }
    }, 150);
    return () => clearInterval(t);
  }, []);
  return ready;
}

// Renders a Spline scene as an absolute background layer with a readability overlay.
function SplineBackground({ url = SPLINE_URL, overlay = 'linear-gradient(to bottom, rgba(10,10,11,.55), rgba(10,10,11,.75) 60%, var(--bg))', dim = 1, interactive = false }) {
  const ready = useSplineLoaded();
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: interactive ? 'auto' : 'none' }}>
      {ready && React.createElement('spline-viewer', {
        url,
        'loading-anim-type': 'none',
        style: { width: '100%', height: '100%', opacity: dim, display: 'block' },
      })}
      <div style={{ position: 'absolute', inset: 0, background: overlay, pointerEvents: 'none' }} />
      {/* Cover the "Built with Spline" watermark (bottom-right) */}
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 150, height: 44, background: 'var(--bg)', pointerEvents: 'none' }} />
    </div>
  );
}

// Wraps a screen with a dim ambient Spline background behind its content.
function Ambient({ children, dim = 0.6 }) {
  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 58px)', overflow: 'hidden' }}>
      <SplineBackground dim={dim} overlay="linear-gradient(to bottom, rgba(10,10,11,.82), rgba(10,10,11,.93))" />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ============================================================
// OFFLINE SCREEN (pas de connexion internet)
// ============================================================
const OFFLINE_LINES = [
  "Eh ben alors, on a pas de sous pour s'acheter une bonne connexion ?",
  "Pas de réseau… ton barbier coupe les câbles aussi ?",
  "Connexion aux abonnés absents. Comme ton ex.",
  "Zéro barre de réseau. Zéro. Le néant.",
];

function OfflineScreen({ onRetry }) {
  const [line] = useState(() => OFFLINE_LINES[Math.floor(Math.random() * OFFLINE_LINES.length)]);
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div className="af" style={{ maxWidth: 420 }}>
        <div style={{ color: 'rgba(255,255,255,.18)', marginBottom: 28 }}>
          <Icon name="bolt" size={64} stroke={1.2} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem,6vw,2.4rem)', fontWeight: 500, fontStyle: 'italic', color: '#EFE3C8', lineHeight: 1.3, marginBottom: 18 }}>
          {line}
        </h1>
        <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 15, marginBottom: 34 }}>
          Vérifie ta connexion internet, puis réessaie.
        </p>
        <button className="btn btn-b" onClick={onRetry}>Réessayer</button>
      </div>
    </div>
  );
}

// ============================================================
// LANDING
// ============================================================
const CATEGORIES = [
  { icon: 'scissors', label: 'Coupe', prestation: 'Coupe homme' },
  { icon: 'comb', label: 'Barbe', prestation: 'Barbe' },
  { icon: 'child', label: 'Enfant', prestation: 'Coupe enfant' },
  { icon: 'droplet', label: 'Coloration', prestation: 'Teinture / Coloration' },
  { icon: 'pen', label: 'Dessin', prestation: 'Dessin / Tracé' },
  { icon: 'user', label: 'Femme', prestation: 'Coupe femme' },
];

function LandingScreen({ onClient, onSalon, onSearch }) {
  const [searchPresta, setSearchPresta] = useState('');
  const [searchVille, setSearchVille] = useState('');

  function doSearch(prestation, ville) {
    onSearch({ prestation: prestation || searchPresta, ville: ville || searchVille });
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HERO */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 40px', textAlign: 'center', overflow: 'hidden', minHeight: '90vh' }}>
        <SplineBackground />
        <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="afu" style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 28 }}>
          {[0,1,2].map(i => <div key={i} className="pole" style={{ height: 64, animationDelay: `${i * 0.3}s` }} />)}
        </div>

        <h1 className="afu s1" style={{ fontSize: 'clamp(2.6rem,8vw,4.4rem)', fontWeight: 900, letterSpacing: '-.03em', marginBottom: 14 }}>
          Trouvez votre barbier<br />avec <span style={{ fontStyle: 'italic', fontWeight: 700, color: 'var(--cream)' }}>style</span>
        </h1>
        <p className="afu s2" style={{ color: 'var(--text-dim)', fontSize: 18, marginBottom: 36 }}>
          Simple · Immédiat · 24h/24 — La Réunion
        </p>

        {/* Search bar */}
        <div className="afu s2" style={{ width: '100%', maxWidth: 660, marginBottom: 28 }}>
          <div className="hero-search">
            <input placeholder="Quelle prestation ?" value={searchPresta} onChange={e => setSearchPresta(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch()} />
            <div className="sep" />
            <select value={searchVille} onChange={e => setSearchVille(e.target.value)}>
              <option value="">Toute la Réunion</option>
              {VILLES.map(v => <option key={v}>{v}</option>)}
            </select>
            <button className="search-btn" onClick={() => doSearch()}>Rechercher</button>
          </div>
        </div>

        {/* Category chips */}
        <div className="afu s3" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 48 }}>
          {CATEGORIES.map(c => (
            <button key={c.label} className="cat-chip" onClick={() => doSearch(c.prestation, '')}>
              <Icon name={c.icon} size={15} /> {c.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="afu s4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
          {[
            { val: '12+', label: 'Salons inscrits' },
            { val: '180', label: 'RDV ce mois' },
            { val: '4.8★', label: 'Note moyenne' },
            { val: '24h/24', label: 'Réservation' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--cream)', fontFamily: "'Fraunces',serif" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="afu s4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={onClient} className="btn btn-b btn-lg"><L icon="scissors" size={16}>Trouver un barbier</L></button>
          <button onClick={onSalon} className="btn btn-o btn-lg"><L icon="store" size={16}>Espace salon</L></button>
        </div>
        </div>
      </div>

      {/* PRO SECTION */}
      <div className="pro-section">
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', marginBottom: 14 }}>Vous êtes barbier ou gérant ?</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 17, marginBottom: 28, maxWidth: 520, margin: '0 auto 28px' }}>
            Rejoignez la plateforme. Agenda IA, rappels automatiques, relance clients, statistiques — tout en un.
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {[
              { icon: 'calendar', txt: 'Agenda digital temps réel' },
              { icon: 'sparkle', txt: 'Assistant IA 24h/24' },
              { icon: 'clock', txt: 'Rappels anti no-show' },
              { icon: 'chart', txt: 'Stats & CA mensuel' },
            ].map(f => (
              <div key={f.txt} style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--text-dim)', fontSize: 15 }}>
                <Icon name={f.icon} size={19} style={{ color: 'var(--cream-dim)' }} /> {f.txt}
              </div>
            ))}
          </div>
          <button onClick={onSalon} className="btn btn-b">Inscrire mon salon gratuitement →</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CLIENT REGISTRATION
// ============================================================
function ClientRegistration({ onDone, onBack, subtitle }) {
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [codeParrain, setCodeParrain] = useState('');
  const [err, setErr] = useState('');

  function submit() {
    if (!nom.trim() || !tel.trim()) { setErr('Veuillez remplir tous les champs.'); return; }
    const id = 'c_' + uid();
    let parrainePar = null;
    // Validate referral code if provided
    if (codeParrain.trim()) {
      const code = codeParrain.trim().toUpperCase();
      const parrain = getAllByPrefix('client:').find(c => c.codeParrainage === code);
      if (!parrain) { setErr('Code de parrainage introuvable.'); return; }
      parrainePar = parrain.id;
      // Reward both: +1 filleul for parrain, +1 récompense each
      const parrainUpd = { ...parrain, filleuls: [...(parrain.filleuls || []), id], recompenses: (parrain.recompenses || 0) + 1 };
      sset(`client:${parrain.id}`, parrainUpd);
      // Notify the parrain
      const nid = 'notif_' + uid();
      sset(`notif:${nid}`, { id: nid, clientId: parrain.id, type: 'parrainage', message: `${nom.trim()} a rejoint BarberLink grâce à vous ! Vous gagnez une réduction.`, lu: false, createdAt: new Date().toISOString() });
    }
    const client = { id, nom: nom.trim(), telephone: tel.trim(), favoris: [], historique: [], codeParrainage: genCode('BL'), filleuls: [], recompenses: parrainePar ? 1 : 0, parrainePar };
    sset(`client:${id}`, client);
    onDone(client);
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <button onClick={onBack} className="btn btn-o btn-sm" style={{ marginBottom: 20 }}>← Retour</button>
      <h2 className="afu" style={{ marginBottom: 6 }}>Créer mon compte client</h2>
      <p className="afu s1" style={{ color: 'var(--text-dim)', marginBottom: subtitle ? 8 : 28, fontSize: 15 }}>Gratuit · Sans carte bancaire</p>
      {subtitle && <p className="afu s1" style={{ color: 'var(--brass)', fontSize: 13, marginBottom: 20, background: 'var(--brass-pale)', padding: '5px 10px', borderRadius: 4, border: '1px solid var(--brass-dim)' }}><L icon="search" size={13}>{subtitle}</L></p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input className="fi" placeholder="Votre prénom et nom" value={nom} onChange={e => setNom(e.target.value)} />
        <input className="fi" placeholder="Numéro de téléphone" value={tel} onChange={e => setTel(e.target.value)} type="tel" />
        <input className="fi" placeholder="Code de parrainage (optionnel)" value={codeParrain} onChange={e => setCodeParrain(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
        {err && <p style={{ color: '#E06060', fontSize: 14 }}>{err}</p>}
        <button className="btn btn-b" onClick={submit} style={{ marginTop: 6 }}>Accéder à l'annuaire →</button>
      </div>
    </div>
  );
}

// ============================================================
// SALON REGISTRATION
// ============================================================
function SalonRegistration({ onDone, onBack }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    nom: '', ville: '', adresse: '', telephone: '',
    horaires: { ...HORAIRES_DEFAULT },
    lienAvisGoogle: '', infos: '',
    forfait: 'essentiel', nbBarbiers: 1,
    barbiers: [{ nom: '', photo: '' }],
  });
  const [err, setErr] = useState('');

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updBarb = (i, k, v) => setForm(f => { const b = [...f.barbiers]; b[i] = { ...b[i], [k]: v }; return { ...f, barbiers: b }; });
  const updHoraire = (j, k, v) => setForm(f => ({ ...f, horaires: { ...f.horaires, [j]: { ...f.horaires[j], [k]: v } } }));

  function setNbBarbiers(n) {
    const nb = Math.max(1, Math.min(10, Number(n)));
    const barb = [...form.barbiers];
    while (barb.length < nb) barb.push({ nom: '', photo: '' });
    setForm(f => ({ ...f, nbBarbiers: nb, barbiers: barb.slice(0, nb) }));
  }

  function validateStep0() {
    if (!form.nom.trim() || !form.ville || !form.adresse.trim()) { setErr('Nom du salon, ville et adresse sont obligatoires.'); return false; }
    setErr(''); return true;
  }

  function submit() {
    const id = 's_' + uid();
    const lat = -20.5 + Math.random() * 1.5;
    const lng = 55.2 + Math.random() * 0.6;
    const salon = { ...form, id, lat, lng, miseEnAvant: false };
    sset(`salon:${id}`, salon);
    onDone(salon);
  }

  const steps = [{ label: 'Infos salon' }, { label: 'Barbiers' }, { label: 'Forfait' }];

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: 24 }}>
      <button onClick={onBack} className="btn btn-o btn-sm" style={{ marginBottom: 20 }}>← Retour</button>
      <h2 style={{ marginBottom: 20 }}>Inscrire mon salon</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '6px 4px', textAlign: 'center', fontSize: 13, borderBottom: `2px solid ${i <= step ? 'var(--brass)' : 'var(--border)'}`, color: i <= step ? 'var(--brass)' : 'var(--text-muted)' }}>
            {s.label}
          </div>
        ))}
      </div>

      {/* ── Step 0 : Infos salon ── */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="fi" placeholder="Nom du salon *" value={form.nom} onChange={e => upd('nom', e.target.value)} />
          <select className="fi" value={form.ville} onChange={e => upd('ville', e.target.value)}>
            <option value="">Ville *</option>
            {VILLES.map(v => <option key={v}>{v}</option>)}
          </select>
          <input className="fi" placeholder="Adresse complète *" value={form.adresse} onChange={e => upd('adresse', e.target.value)} />
          <input className="fi" placeholder="Téléphone" value={form.telephone} onChange={e => upd('telephone', e.target.value)} />
          <input className="fi" placeholder="Lien avis Google (optionnel)" value={form.lienAvisGoogle} onChange={e => upd('lienAvisGoogle', e.target.value)} />
          <textarea className="fi" placeholder="Infos pratiques (parking, accès, etc.)" value={form.infos} onChange={e => upd('infos', e.target.value)} rows={3} />

          {/* Horaires table */}
          <div>
            <label style={{ color: 'var(--text-dim)', fontSize: 13, display: 'block', marginBottom: 8 }}>Horaires d'ouverture</label>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {JOURS.map((j, idx) => {
                const h = form.horaires[j];
                return (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderBottom: idx < 6 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ width: 88, fontSize: 14, fontWeight: 500, flexShrink: 0 }}>{JOURS_LABELS[j]}</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', minWidth: 66, flexShrink: 0 }}>
                      <input type="checkbox" checked={h.ouvert} onChange={e => updHoraire(j, 'ouvert', e.target.checked)} style={{ accentColor: 'var(--cream)', width: 14, height: 14 }} />
                      <span style={{ fontSize: 12, color: h.ouvert ? 'var(--cream-dim)' : 'var(--text-muted)' }}>{h.ouvert ? 'Ouvert' : 'Fermé'}</span>
                    </label>
                    <input type="time" className="fi" value={h.debut} disabled={!h.ouvert}
                      onChange={e => updHoraire(j, 'debut', e.target.value)}
                      style={{ flex: 1, padding: '7px 10px', fontSize: 13, opacity: h.ouvert ? 1 : 0.3, minWidth: 0 }} />
                    <span style={{ color: 'var(--text-muted)', fontSize: 12, flexShrink: 0 }}>–</span>
                    <input type="time" className="fi" value={h.fin} disabled={!h.ouvert}
                      onChange={e => updHoraire(j, 'fin', e.target.value)}
                      style={{ flex: 1, padding: '7px 10px', fontSize: 13, opacity: h.ouvert ? 1 : 0.3, minWidth: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>

          {err && <p style={{ color: '#E06060', fontSize: 14 }}>{err}</p>}
          <button className="btn btn-b" onClick={() => { if (validateStep0()) setStep(1); }}>Suivant →</button>
        </div>
      )}

      {/* ── Step 1 : Barbiers ── */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ color: 'var(--text-dim)', fontSize: 14, flex: 1 }}>Nombre de barbiers dans votre salon</label>
            <input className="fi" type="number" min={1} max={10} value={form.nbBarbiers} onChange={e => setNbBarbiers(e.target.value)} style={{ width: 72, textAlign: 'center' }} />
          </div>
          {form.barbiers.slice(0, form.nbBarbiers).map((b, i) => (
            <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
              <h4 style={{ marginBottom: 12, color: 'var(--cream-dim)', fontSize: 15 }}>Barbier {i + 1}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input className="fi" placeholder="Prénom du barbier *" value={b.nom} onChange={e => updBarb(i, 'nom', e.target.value)} />
                <input className="fi" placeholder="URL photo de profil (optionnel)" value={b.photo || ''} onChange={e => updBarb(i, 'photo', e.target.value)} />
                {b.photo && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={b.photo} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} onError={e => { e.target.style.display = 'none'; }} />
                    <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Aperçu de la photo</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <p style={{ color: 'var(--text-muted)', fontSize: 13, fontStyle: 'italic' }}>Les prestations et tarifs seront à renseigner depuis votre tableau de bord.</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-o" onClick={() => setStep(0)}>← Retour</button>
            <button className="btn btn-b" onClick={() => setStep(2)}>Suivant →</button>
          </div>
        </div>
      )}

      {/* ── Step 2 : Forfait ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ color: 'var(--text-dim)', marginBottom: 4 }}>Choisissez votre formule. Vous pouvez changer à tout moment.</p>
          {[
            { id: 'essentiel', label: 'Essentiel', prix: 49, color: '#8B7355',
              desc: 'Votre salon est en ligne et vos clients peuvent réserver directement depuis l\'app. Parfait pour commencer.' },
            { id: 'croissance', label: 'Croissance', prix: 99, color: '#B8860B',
              desc: 'Tout l\'Essentiel, plus : rappels automatiques avant les RDV pour éviter les absences, et demandes d\'avis après chaque visite.' },
            { id: 'premium', label: 'Premium', prix: 179, color: '#D4AF37',
              desc: 'Le pack complet. En plus des rappels et avis, relancez automatiquement les clients qui ne sont pas revenus depuis un moment.' },
            { id: 'reseau', label: 'Réseau', prix: 199, color: '#9C7BD0',
              desc: 'Idéal pour les groupes qui gèrent plusieurs salons. 199 €/mois pour le premier salon, puis +50 € par salon supplémentaire. Toutes les fonctions Premium incluses.' },
          ].map(f => (
            <div key={f.id} onClick={() => upd('forfait', f.id)}
              style={{ padding: 18, border: `2px solid ${form.forfait === f.id ? f.color : 'var(--border)'}`, borderRadius: 12, cursor: 'pointer', background: form.forfait === f.id ? `${f.color}14` : 'var(--surface2)', transition: 'all .2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 20, color: f.color, fontWeight: 600 }}>{f.label}</span>
                <span style={{ color: f.color, fontWeight: 700, fontSize: 22 }}>{f.prix} €<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-dim)' }}> /mois</span></span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
          {err && <p style={{ color: '#E06060', fontSize: 14 }}>{err}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-o" onClick={() => setStep(1)}>← Retour</button>
            <button className="btn btn-b" onClick={submit} style={{ flex: 1 }}>Créer mon salon</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SALON DIRECTORY
// ============================================================
function SalonDirectory({ client, onSelectSalon, onAccount, initialPresta, initialVille }) {
  const [salons, setSalons] = useState([]);
  const [ville, setVille] = useState(initialVille || '');
  const [tri, setTri] = useState('note');
  const [dispoAujourd, setDispoAujourd] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPresta, setFilterPresta] = useState(initialPresta || '');

  useEffect(() => { setSalons(getAllByPrefix('salon:')); }, []);

  function getNote(id) {
    return avgNote(getAllByPrefix('avis:').filter(a => a.salonId === id));
  }

  function hasDispo(s) {
    const booked = getAllByPrefix('rdv:').filter(r => r.salonId === s.id && r.date === today() && r.statut !== 'annulé').map(r => r.heure);
    return HEURES.some(h => !booked.includes(h));
  }

  function matchesPresta(s) {
    if (!filterPresta) return true;
    return (s.barbiers || []).some(b => b.tarifs?.[filterPresta]);
  }

  let list = salons.filter(s => {
    if (ville && s.ville !== ville) return false;
    if (dispoAujourd && !hasDispo(s)) return false;
    if (search && !s.nom.toLowerCase().includes(search.toLowerCase())) return false;
    if (!matchesPresta(s)) return false;
    return true;
  }).sort((a, b) => {
    if (tri === 'note') return getNote(b.id) - getNote(a.id);
    if (tri === 'prix') {
      const pm = s => Math.min(...(s.barbiers || []).flatMap(b => Object.values(b.tarifs || {})).filter(Boolean));
      return pm(a) - pm(b);
    }
    return 0;
  });
  list = [...list.filter(s => s.miseEnAvant), ...list.filter(s => !s.miseEnAvant)];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 className="afu">Barbiers à La Réunion</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>
            Bonjour {client.nom} — <strong style={{ color: 'var(--brass)' }}>{list.length}</strong> salon{list.length !== 1 ? 's' : ''} trouvé{list.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn-o btn-sm" onClick={onAccount}>Mon compte →</button>
      </div>

      {/* Search + filters */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
          <input className="fi" placeholder="Rechercher un salon…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: '1 1 180px', minWidth: 0 }} />
          <select className="fi" value={ville} onChange={e => setVille(e.target.value)} style={{ flex: '0 0 auto', width: 'auto' }}>
            <option value="">Toutes les villes</option>
            {VILLES.map(v => <option key={v}>{v}</option>)}
          </select>
          <select className="fi" value={tri} onChange={e => setTri(e.target.value)} style={{ flex: '0 0 auto', width: 'auto' }}>
            <option value="note">Mieux notés</option>
            <option value="prix">Prix croissant</option>
          </select>
        </div>
        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className={`cat-chip${filterPresta === '' ? ' active' : ''}`} onClick={() => setFilterPresta('')}>Tous</button>
          {CATEGORIES.map(c => (
            <button key={c.label} className={`cat-chip${filterPresta === c.prestation ? ' active' : ''}`} onClick={() => setFilterPresta(filterPresta === c.prestation ? '' : c.prestation)}>
              <Icon name={c.icon} size={14} /> {c.label}
            </button>
          ))}
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: dispoAujourd ? 'var(--brass)' : 'var(--text-muted)', fontSize: 13, marginLeft: 4 }}>
            <input type="checkbox" checked={dispoAujourd} onChange={e => setDispoAujourd(e.target.checked)} style={{ accentColor: 'var(--brass)' }} />
            Dispo aujourd'hui
          </label>
        </div>
      </div>

      {list.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>Aucun salon trouvé.</p>}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16 }}>
        {list.map((s, i) => (
          <SalonCard key={s.id} salon={s} note={getNote(s.id)} onSelect={() => onSelectSalon(s)} index={i} hasDispo={hasDispo(s)} />
        ))}
      </div>
    </div>
  );
}

const COVER_GRADIENTS = [
  'linear-gradient(135deg,#2b2b2e,#161618)',
  'linear-gradient(135deg,#2e2a24,#17150f)',
  'linear-gradient(135deg,#26282b,#141518)',
  'linear-gradient(135deg,#2c2620,#18130d)',
  'linear-gradient(135deg,#282a2c,#141416)',
];

function SalonCard({ salon, note, onSelect, index, hasDispo }) {
  const prestations = [...new Set((salon.barbiers || []).flatMap(b => Object.keys(b.tarifs || {}).filter(k => b.tarifs[k])))];
  const prixMin = Math.min(...(salon.barbiers || []).flatMap(b => Object.values(b.tarifs || {})).filter(v => v > 0));
  const grad = COVER_GRADIENTS[index % COVER_GRADIENTS.length];
  const initial = (salon.nom || '?')[0].toUpperCase();

  return (
    <div className={`card-hover afu s${Math.min(index + 1, 5)}`} onClick={onSelect}
      style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, cursor: 'pointer', overflow: 'hidden' }}>
      {/* Cover */}
      <div className="salon-cover" style={{ background: grad }}>
        <span style={{ color: 'rgba(255,255,255,0.07)', userSelect: 'none' }}>{initial}</span>
        {salon.miseEnAvant && (
          <span className="badge-sponsored" style={{ position: 'absolute', top: 12, left: 12 }}>Sponsorisé</span>
        )}
        {hasDispo && (
          <span className="dispo-badge" style={{ position: 'absolute', top: 12, right: 12 }}>Disponible</span>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>{salon.nom}</h3>
          {note > 0 && <span style={{ color: '#D4AF37', fontSize: 13, whiteSpace: 'nowrap', marginLeft: 8 }}>★ {note}</span>}
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="pin" size={13} />{salon.ville} · {salon.adresse}</p>
        {/* Service tags */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
          {prestations.slice(0, 4).map(p => (
            <span key={p} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 20, background: 'var(--surface2)', color: 'var(--text-dim)', border: '1px solid var(--border)' }}>{p}</span>
          ))}
          {prestations.length > 4 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{prestations.length - 4}</span>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--cream-dim)', fontSize: 14 }}>
            {prixMin && isFinite(prixMin) ? `Dès ${prixMin} €` : ''}
            <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>{salon.barbiers?.length || 0} barbier{salon.barbiers?.length !== 1 ? 's' : ''}</span>
          </span>
          <span style={{ color: 'var(--brass)', fontSize: 20 }}>›</span>
        </div>
      </div>
    </div>
  );
}



// ============================================================
// QUICK BOOK (slot picker visuel — inspiré Planity)
// ============================================================
function QuickBook({ salon, preselectedBarbier, client, onConfirmed }) {
  const [barbier, setBarbier] = useState(preselectedBarbier || salon.barbiers?.[0]?.nom || '');
  const [prestation, setPrestation] = useState('');
  const [dateIdx, setDateIdx] = useState(0);
  const [heure, setHeure] = useState('');
  const [confirmed, setConfirmed] = useState(null);
  const [step, setStep] = useState(0); // 0=prestation, 1=datetime, 2=confirm

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });
  const selectedDate = days[dateIdx];

  const barbierObj = (salon.barbiers || []).find(b => b.nom === barbier);
  const prestations = barbierObj ? Object.entries(barbierObj.tarifs || {}).filter(([, v]) => v).map(([k]) => k) : [];

  const bookedAtDate = getAllByPrefix('rdv:')
    .filter(r => r.salonId === salon.id && r.barbier === barbier && r.date === selectedDate && r.statut !== 'annulé')
    .map(r => r.heure);

  const slots = HEURES.filter(h => {
    const [hh, mm] = h.split(':').map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hh, mm);
    return slotDate > new Date();
  });

  const promo = getPromo(salon, selectedDate);
  const prixBase = barbierObj?.tarifs?.[prestation] || 0;
  const prixFinal = applyPromo(prixBase, promo);

  function confirm() {
    const id = 'rdv_' + uid();
    const rdv = { id, salonId: salon.id, barbier, prestation, prix: prixFinal, prixBase: promo ? prixBase : undefined, promo: promo ? promo.reduction : undefined, date: selectedDate, heure, clientId: client?.id || 'anon', clientNom: client?.nom || 'Client', clientTel: client?.telephone || '', statut: 'en attente', createdAt: new Date().toISOString() };
    sset(`rdv:${id}`, rdv);
    if (client) {
      const upd = { ...client, historique: [...(client.historique || []), id] };
      sset(`client:${client.id}`, upd);
    }
    setConfirmed(rdv);
    onConfirmed(rdv);
  }

  if (confirmed) return (
    <div style={{ background: '#3D7A5420', border: '1px solid var(--success)', borderRadius: 10, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 10 }}>✓</div>
      <h3 style={{ color: '#7DC89A', marginBottom: 8 }}>RDV confirmé !</h3>
      <p style={{ color: 'var(--text-dim)' }}>{confirmed.prestation} avec <strong>{confirmed.barbier}</strong></p>
      <p style={{ color: 'var(--text-dim)' }}>{fmtDate(confirmed.date)} à {confirmed.heure} · {confirmed.prix} €{confirmed.promo ? ` (−${confirmed.promo} %)` : ''}</p>
    </div>
  );

  const dayNames = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 18 }}>
      <h3 style={{ fontSize: 17, marginBottom: 16 }}>Réserver un créneau</h3>

      {/* Barbier selector */}
      {(salon.barbiers || []).length > 1 && (
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>Barbier</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(salon.barbiers || []).map(b => (
              <button key={b.nom} onClick={() => { setBarbier(b.nom); setPrestation(''); setHeure(''); }}
                className={`cat-chip${barbier === b.nom ? ' active' : ''}`} style={{ padding: '7px 14px' }}>
                {b.nom}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prestation */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 13, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>Prestation</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {prestations.map(p => (
            <button key={p} onClick={() => { setPrestation(p); setHeure(''); }}
              className={`cat-chip${prestation === p ? ' active' : ''}`} style={{ padding: '7px 14px', fontSize: 13 }}>
              {p} · <strong>{barbierObj?.tarifs[p]} €</strong>
            </button>
          ))}
        </div>
      </div>

      {prestation && <>
        {/* Date selector */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>Date</label>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {days.map((d, i) => {
              const dd = new Date(d);
              const dayPromo = getPromo(salon, d);
              return (
                <button key={d} onClick={() => { setDateIdx(i); setHeure(''); }}
                  style={{ position: 'relative', flexShrink: 0, padding: '8px 14px', borderRadius: 8, border: `1px solid ${dateIdx === i ? 'var(--brass)' : dayPromo ? '#9C7BD0' : 'var(--border)'}`, background: dateIdx === i ? 'var(--brass-pale)' : 'var(--surface2)', color: dateIdx === i ? 'var(--brass)' : 'var(--text-dim)', cursor: 'pointer', textAlign: 'center', minWidth: 58 }}>
                  <div style={{ fontSize: 11, marginBottom: 2 }}>{dayNames[dd.getDay()]}</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{dd.getDate()}</div>
                  {dayPromo && <span style={{ position: 'absolute', top: -7, right: -7, background: '#9C7BD0', color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 8 }}>−{dayPromo.reduction}%</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slots */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: 'var(--text-dim)', display: 'block', marginBottom: 6 }}>Créneau disponible</label>
          <div className="slot-grid">
            {slots.map(h => (
              <button key={h} disabled={bookedAtDate.includes(h)} onClick={() => setHeure(h)}
                className={`slot-btn${heure === h ? ' selected' : ''}`}>
                {bookedAtDate.includes(h) ? <s style={{ opacity: .4 }}>{h}</s> : h}
              </button>
            ))}
          </div>
          {slots.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Pas de créneaux ce jour.</p>}
        </div>

        {promo && (
          <div style={{ background: 'rgba(156,123,208,.12)', border: '1px solid rgba(156,123,208,.4)', borderRadius: 8, padding: '10px 12px', marginBottom: 12, fontSize: 14, color: '#C9AEF0', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="bolt" size={15} /> Offre du jour : <strong>−{promo.reduction}%</strong> sur cette date !
          </div>
        )}

        {heure && (
          <button className="btn btn-b" style={{ width: '100%' }} onClick={confirm}>
            Confirmer — {prestation} avec {barbier} le {fmtDate(selectedDate)} à {heure} · {promo
              ? <span style={{ marginLeft: 4 }}><s style={{ opacity: .6 }}>{prixBase} €</s> {prixFinal} €</span>
              : `${prixFinal} €`}
          </button>
        )}
      </>}
    </div>
  );
}

// ============================================================
// SALON DETAIL
// ============================================================
function SalonDetail({ salon: initialSalon, client, onBack, onBook, onUpdateClient }) {
  const [salon, setSalon] = useState(initialSalon);
  const [tab, setTab] = useState('reserver');
  const [isFav, setIsFav] = useState((client?.favoris || []).includes(initialSalon.id));

  const avis = getAllByPrefix('avis:').filter(a => a.salonId === salon.id);
  const noteGlobale = avgNote(avis);

  useEffect(() => {
    const fresh = sget(`salon:${initialSalon.id}`);
    if (fresh) setSalon(fresh);
  }, [initialSalon.id]);

  function toggleFav() {
    if (!client) return;
    const favs = client.favoris || [];
    const updated = isFav ? favs.filter(f => f !== salon.id) : [...favs, salon.id];
    const updClient = { ...client, favoris: updated };
    sset(`client:${client.id}`, updClient);
    onUpdateClient(updClient);
    setIsFav(!isFav);
  }

  const tabs = [{ id: 'reserver', label: <L icon="calendar" size={15}>Réserver</L> }, { id: 'barbiers', label: <L icon="scissors" size={15}>Tarifs</L> }, { id: 'portfolio', label: <L icon="camera" size={15}>Galerie</L> }, { id: 'avis', label: <L icon="star" size={15}>{`Avis (${avis.length})`}</L> }];

  const prixMin = Math.min(...(salon.barbiers || []).flatMap(b => Object.values(b.tarifs || {})).filter(v => v > 0));
  const idx = Math.abs((salon.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % COVER_GRADIENTS.length;
  const totalPresta = [...new Set((salon.barbiers || []).flatMap(b => Object.keys(b.tarifs || {}).filter(k => b.tarifs[k])))].length;

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', paddingBottom: 90 }}>
      {/* Image header */}
      <div className="afu" style={{ position: 'relative', height: 280, background: COVER_GRADIENTS[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 120, fontWeight: 600, color: 'rgba(255,255,255,0.06)', letterSpacing: '-.04em', userSelect: 'none' }}>{(salon.nom || '?')[0].toUpperCase()}</span>
        {/* Floating buttons */}
        <button onClick={onBack} className="icon-sq" style={{ position: 'absolute', top: 16, left: 16 }}>←</button>
        <button onClick={toggleFav} className="icon-sq" style={{ position: 'absolute', top: 16, right: 16, color: isFav ? '#E89090' : 'var(--text)' }}>{isFav ? '★' : '☆'}</button>
        {salon.miseEnAvant && <span className="badge-sponsored" style={{ position: 'absolute', bottom: 16, left: 16 }}>Sponsorisé</span>}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,11,.9), transparent 50%)' }} />
      </div>

      {/* Info block */}
      <div style={{ padding: '20px 18px 0' }}>
        <div className="afu s1" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
          <h2 style={{ fontSize: 26, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{salon.nom}</h2>
          {noteGlobale > 0 && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--cream)', fontWeight: 700, fontSize: 15, flexShrink: 0, marginTop: 4 }}>★ {noteGlobale} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 13 }}>({avis.length})</span></span>
          )}
        </div>
        <a className="afu s1" href={`https://maps.google.com/?q=${encodeURIComponent((salon.adresse||'')+', '+(salon.ville||'')+', La Réunion')}`} target="_blank" rel="noopener noreferrer"
          style={{ display:'block', color:'var(--text-dim)', fontSize:15, marginBottom:16, textDecoration:'underline', textDecorationColor:'rgba(255,255,255,0.18)' }}>
          <Icon name="pin" size={13} /> {salon.adresse}, {salon.ville}
        </a>

        {/* Info pills */}
        <div className="afu s2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span className="info-pill"><Icon name="users" size={14} /> {salon.barbiers?.length || 0} barbier{salon.barbiers?.length !== 1 ? 's' : ''}</span>
          <span className="info-pill"><Icon name="scissors" size={14} /> {totalPresta} prestations</span>
          {salon.horaires && <span className="info-pill"><Icon name="clock" size={14} /> {fmtHoraires(salon.horaires)}</span>}
          {salon.telephone && <span className="info-pill"><Icon name="phone" size={14} /> {salon.telephone}</span>}
        </div>

        {salon.infos && (
          <p className="afu s2" style={{ color: 'var(--text-dim)', fontSize: 15, marginBottom: 16, lineHeight: 1.6 }}>{salon.infos}</p>
        )}

        {salon.promo?.date >= today() && (
          <div className="afu s2" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(156,123,208,.12)', border: '1px solid rgba(156,123,208,.4)', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
            <Icon name="bolt" size={18} style={{ color: '#C9AEF0' }} />
            <span style={{ fontSize: 14, color: '#C9AEF0' }}>Offre spéciale : <strong>−{salon.promo.reduction}%</strong> le {fmtDate(salon.promo.date)}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '0 18px' }}>
        <Tabs tabs={tabs} active={tab} onChange={setTab} />
      </div>

      <div style={{ padding: '0 18px' }}>

      {tab === 'reserver' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <QuickBook salon={salon} preselectedBarbier={null} client={client} onConfirmed={() => {}} />
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            — ou —&nbsp;
            <button className="btn btn-o btn-sm" onClick={() => onBook(salon, null)}><L icon="chat" size={15}>Réserver avec l'assistant IA</L></button>
          </div>
        </div>
      )}

      {tab === 'barbiers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(salon.barbiers || []).map((b, i) => (
            <div key={i} className="card-hover afu" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, animationDelay: `${i * 0.08}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--brass-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {b.nom[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 16 }}>{b.nom}</h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Barbier</span>
                  </div>
                </div>
                <button className="btn btn-b btn-sm" onClick={() => onBook(salon, b.nom)}>Réserver</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 8 }}>
                {Object.entries(b.tarifs || {}).filter(([, v]) => v).map(([p, v]) => (
                  <div key={p} style={{ background: 'var(--surface2)', borderRadius: 4, padding: '6px 10px', fontSize: 14, display: 'flex', justifyContent: 'space-between', border: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-dim)' }}>{p}</span>
                    <span style={{ color: 'var(--brass)', fontWeight: 700 }}>{v} €</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'portfolio' && (
        <div>
          {(salon.barbiers || []).map((b, i) => {
            const photos = b.portfolio || [];
            if (!photos.length && i > 0) return null;
            return (
              <div key={i} style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 12, color: 'var(--cream-dim)' }}>Portfolio de {b.nom}</h4>
                {photos.length === 0
                  ? <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Aucune réalisation ajoutée pour l'instant.</p>
                  : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 8 }}>
                    {photos.map((url, j) => (
                      <img key={j} src={url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                    ))}
                  </div>
                }
              </div>
            );
          })}
        </div>
      )}

      {tab === 'avis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {avis.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun avis pour ce salon.</p>}
          {avis.map((a, i) => (
            <div key={a.id} className="afu" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 6, padding: 14, animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, color: 'var(--cream)' }}>{a.clientNom}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{fmtDate(a.date)}</span>
              </div>
              <StarRow n={a.note} size={14} />
              {a.barbier && <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>avec {a.barbier}</span>}
              {a.commentaire && <p style={{ color: 'var(--text-dim)', marginTop: 8, fontStyle: 'italic' }}>"{a.commentaire}"</p>}
            </div>
          ))}
          {salon.lienAvisGoogle && salon.lienAvisGoogle !== '#' && (
            <a href={salon.lienAvisGoogle} target="_blank" rel="noreferrer" className="btn btn-o btn-sm" style={{ alignSelf: 'flex-start', textDecoration: 'none' }}>Voir les avis Google ↗</a>
          )}
        </div>
      )}
      </div>

      {/* Sticky price + CTA bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80, background: 'rgba(10,10,11,.92)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ maxWidth: 760, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 25, fontWeight: 600, fontFamily: "'Fraunces',serif", color: 'var(--text)' }}>{prixMin && isFinite(prixMin) ? `Dès ${prixMin} €` : 'Voir tarifs'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{salon.ville}</div>
          </div>
          <button className="btn btn-b" onClick={() => { setTab('reserver'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Réserver un créneau</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AI BOOKING CHAT
// ============================================================
function AIBookingChat({ salon: initialSalon, preselectedBarbier, client, onBack, onUpdateClient }) {
  const [salon, setSalon] = useState(initialSalon);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [rdvConfirmed, setRdvConfirmed] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    const fresh = sget(`salon:${initialSalon.id}`);
    if (fresh) setSalon(fresh);
  }, [initialSalon.id]);

  useEffect(() => {
    const greeting = buildGreeting();
    setMessages([{ role: 'assistant', content: greeting }]);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  function buildGreeting() {
    const barb = preselectedBarbier ? ` avec ${preselectedBarbier}` : '';
    return `Bonjour ! Je suis l'assistant IA de **${salon.nom}**.\n\nJe suis là pour vous aider à réserver votre RDV${barb}. Quelle prestation souhaitez-vous ?\n\n${PRESTATIONS.map(p => `• ${p}`).join('\n')}`;
  }

  function buildSystemPrompt() {
    const rdvList = getAllByPrefix('rdv:').filter(r => r.salonId === salon.id && r.statut !== 'annulé');
    const bookedStr = rdvList.map(r => `${r.barbier} le ${r.date} à ${r.heure}`).join('; ');
    const barbiersInfo = (salon.barbiers || []).map(b =>
      `${b.nom}: ${Object.entries(b.tarifs || {}).filter(([, v]) => v).map(([p, v]) => `${p}=${v}€`).join(', ')}`
    ).join(' | ');

    return `Tu es l'assistant IA du salon "${salon.nom}" à ${salon.ville}. Tu aides les clients à réserver un RDV.

Barbiers et tarifs: ${barbiersInfo}
Créneaux disponibles: ${HEURES.join(', ')}
RDV déjà pris: ${bookedStr || 'aucun'}
${preselectedBarbier ? `Barbier présélectionné: ${preselectedBarbier}` : ''}
Téléphone du salon: ${salon.telephone || 'non renseigné'}

Conduis la conversation pour collecter: prestation → barbier → date (YYYY-MM-DD) → heure → nom et téléphone du client.
Vérifie qu'il n'y a pas de double réservation (même barbier, même date, même heure).
Réponds en français, sois chaleureux et professionnel.
Quand tu as TOUTES les infos, émets exactement: [[RDV]]{"salonId":"${salon.id}","barbier":"...","prestation":"...","prix":0,"date":"YYYY-MM-DD","heure":"HH:MM","clientNom":"...","clientTel":"..."}
puis confirme au client.`;
  }

  async function sendMessage(userMsg) {
    if (!userMsg.trim()) return;
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const reply = await callAI(apiMessages, buildSystemPrompt());
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);

      const match = reply.match(/\[\[RDV\]\](\{[^}]+\})/);
      if (match) {
        try {
          const data = JSON.parse(match[1]);
          const rdvId = 'rdv_' + uid();
          const rdv = {
            ...data,
            id: rdvId,
            clientId: client?.id || 'anon',
            statut: 'en attente',
            createdAt: new Date().toISOString(),
          };
          if (data.salonId) {
            const salonData = sget(`salon:${data.salonId}`);
            const barb = (salonData?.barbiers || []).find(b => b.nom === data.barbier);
            if (barb?.tarifs?.[data.prestation]) {
              const base = barb.tarifs[data.prestation];
              const promo = getPromo(salonData, data.date);
              rdv.prix = applyPromo(base, promo);
              if (promo) { rdv.prixBase = base; rdv.promo = promo.reduction; }
            }
          }
          sset(`rdv:${rdvId}`, rdv);
          if (client) {
            const updClient = { ...client, historique: [...(client.historique || []), rdvId] };
            sset(`client:${client.id}`, updClient);
            onUpdateClient(updClient);
          }
          // Check waiting list
          notifyWaiting(rdv);
          setRdvConfirmed(rdv);
        } catch {}
      }
    } catch {
      const fallback = `Désolé, je rencontre un problème technique. Appelez directement le salon : ${salon.telephone || 'voir la fiche'}`;
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
    }
    setLoading(false);
  }

  function notifyWaiting(rdv) {
    // When a new slot is booked for a barber, nothing to notify.
    // But we also check if any attente matches this slot being freed later — left for cancel flow.
  }

  function renderContent(text) {
    return text.replace(/\[\[RDV\]\][^\n]*/g, '').split('\n').map((line, i) => (
      <span key={i}>{line.replace(/\*\*(.*?)\*\*/g, (_, t) => t)}{'\n'}</span>
    ));
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 54px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button onClick={onBack} className="btn btn-o btn-sm">← Retour</button>
        <div>
          <span style={{ color: 'var(--brass)', fontWeight: 700 }}>{salon.nom}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}> · Assistant IA</span>
        </div>
        <div style={{ width: 80 }} />
      </div>

      {rdvConfirmed && (
        <div className="afu" style={{ background: '#3D7A5420', border: '1px solid var(--success)', borderRadius: 8, padding: 16, marginBottom: 14 }}>
          <h4 style={{ color: '#7DC89A', marginBottom: 6 }}>✓ Rendez-vous confirmé !</h4>
          <p style={{ fontSize: 14, color: 'var(--text-dim)' }}>
            {rdvConfirmed.prestation} avec {rdvConfirmed.barbier} · {fmtDate(rdvConfirmed.date)} à {rdvConfirmed.heure}
            {rdvConfirmed.prix ? ` · ${rdvConfirmed.prix} €` : ''}{rdvConfirmed.promo ? ` (−${rdvConfirmed.promo}%)` : ''}
          </p>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} className="af" style={{ display: 'flex', flexDirection: 'column' }}>
            {m.role === 'assistant'
              ? <div className="bubble-ai" style={{ whiteSpace: 'pre-wrap', fontSize: 15, lineHeight: 1.55 }}>{renderContent(m.content)}</div>
              : <div className="bubble-u" style={{ whiteSpace: 'pre-wrap', fontSize: 15 }}>{m.content}</div>
            }
          </div>
        ))}
        {loading && <div className="bubble-ai" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Spin /> <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>Réponse en cours…</span></div>}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 10, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <input className="fi" value={input} onChange={e => setInput(e.target.value)} placeholder="Votre message…"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          style={{ flex: 1 }} />
        <button className="btn btn-b" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
          {loading ? <Spin /> : 'Envoyer'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// CLIENT ACCOUNT
// ============================================================
function ClientAccount({ client, onUpdateClient, onBack, onRebook }) {
  const [tab, setTab] = useState('rdv');
  const [waiting, setWaiting] = useState([]);
  const [rdvs, setRdvs] = useState([]);
  const [favSalons, setFavSalons] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const [newAvis, setNewAvis] = useState(null);
  const [avisForm, setAvisForm] = useState({ note: 5, commentaire: '' });
  const [copied, setCopied] = useState(false);

  // Ensure client has a referral code (for accounts created before this feature)
  useEffect(() => {
    if (!client.codeParrainage) {
      const upd = { ...client, codeParrainage: genCode('BL'), filleuls: client.filleuls || [], recompenses: client.recompenses || 0 };
      sset(`client:${client.id}`, upd);
      onUpdateClient(upd);
    }
  }, []);

  useEffect(() => {
    const allRdv = getAllByPrefix('rdv:').filter(r => r.clientId === client.id);
    setRdvs(allRdv.sort((a, b) => b.createdAt?.localeCompare(a.createdAt)));
    const favs = getAllByPrefix('salon:').filter(s => (client.favoris || []).includes(s.id));
    setFavSalons(favs);
    const att = getAllByPrefix('attente:').filter(a => a.clientId === client.id);
    setWaiting(att);
    const myNotifs = getAllByPrefix('notif:').filter(n => n.clientId === client.id).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    setNotifs(myNotifs);
  }, [client]);

  function dismissNotif(id) {
    sdel(`notif:${id}`);
    setNotifs(prev => prev.filter(n => n.id !== id));
  }

  function submitAvis() {
    const a = { id: 'avis_' + uid(), salonId: newAvis.salonId, barbier: newAvis.barbier, clientNom: client.nom, note: avisForm.note, commentaire: avisForm.commentaire, date: today() };
    sset(`avis:${a.id}`, a);
    setNewAvis(null);
    setAvisForm({ note: 5, commentaire: '' });
  }

  function shareCode() {
    const txt = `Rejoins-moi sur BarberLink ! Utilise mon code de parrainage ${client.codeParrainage} à l'inscription, on gagne tous les deux une réduction.`;
    if (navigator.share) {
      navigator.share({ title: 'BarberLink', text: txt }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(() => {});
    }
  }

  // Client reminders: confirmed/pending RDV in the next 48h
  const nowMs = Date.now();
  const upcomingReminders = rdvs.filter(r => {
    if (r.statut === 'annulé') return false;
    const dt = new Date(`${r.date}T${r.heure || '00:00'}`).getTime();
    return dt >= nowMs && dt <= nowMs + 48 * 3600 * 1000;
  }).sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure));

  const unread = notifs.filter(n => !n.lu);

  const tabs = [
    { id: 'rdv', label: <L icon="list" size={15}>Mes RDV</L> },
    { id: 'favoris', label: <L icon="heart" size={15}>Favoris</L> },
    { id: 'attente', label: <L icon="hourglass" size={15}>Attente</L> },
    { id: 'parrainage', label: <L icon="users" size={15}>Parrainage</L> },
  ];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2>Mon compte</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>{client.nom} · {client.telephone}</p>
        </div>
        <button onClick={onBack} className="btn btn-o btn-sm">← Annuaire</button>
      </div>

      {/* Notifications (smart waiting list + parrainage) */}
      {notifs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {notifs.map(n => (
            <div key={n.id} className="afu" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: n.type === 'attente' ? 'rgba(76,140,106,.12)' : 'var(--brass-pale)', border: `1px solid ${n.type === 'attente' ? 'rgba(76,140,106,.35)' : 'var(--brass-dim)'}`, borderRadius: 10, padding: '12px 14px' }}>
              <Icon name={n.type === 'attente' ? 'bolt' : 'users'} size={16} style={{ marginTop: 2, color: n.type === 'attente' ? '#7FD0A4' : 'var(--brass)' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: 'var(--text)' }}>{n.message}</p>
                {n.type === 'attente' && (
                  <button className="btn btn-b btn-sm" style={{ marginTop: 8 }} onClick={() => { const s = sget(`salon:${n.salonId}`); if (s) onRebook({ salonId: n.salonId, barbier: n.barbier, prestation: n.prestation }); dismissNotif(n.id); }}>Réserver ce créneau</button>
                )}
              </div>
              <button onClick={() => dismissNotif(n.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Reminders banner */}
      {upcomingReminders.length > 0 && (
        <div className="afu" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
          <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="clock" size={13} /> Rappel — bientôt</p>
          {upcomingReminders.map(r => {
            const s = getAllByPrefix('salon:').find(x => x.id === r.salonId);
            return (
              <div key={r.id} style={{ marginTop: 4 }}>
                <span style={{ fontSize: 14 }}><strong style={{ color: 'var(--cream)' }}>{r.prestation}</strong> avec {r.barbier} · {fmtDate(r.date)} à {r.heure}{s ? ` · ${s.nom}` : ''}</span>
              </div>
            );
          })}
        </div>
      )}

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'rdv' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rdvs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun rendez-vous.</p>}
          {rdvs.map((r, i) => {
            const sObj = getAllByPrefix('salon:').find(s => s.id === r.salonId);
            return (
            <div key={r.id} className="afu card-hover" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--cream)' }}>{r.prestation} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>avec {r.barbier}</span></p>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{fmtDate(r.date)} à {r.heure}{r.prix ? ` · ${r.prix} €` : ''}{r.promo ? <span style={{ color: '#C9AEF0' }}> (−{r.promo}%)</span> : ''}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{sObj?.nom}</p>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <StatutBadge statut={r.statut} />
                  <button className="btn btn-o btn-sm" onClick={() => onRebook(r)}>↻ Re-réserver</button>
                  {r.date >= today() && r.statut !== 'annulé' && (
                    <button className="btn btn-r btn-sm" onClick={() => {
                      const upd = { ...r, statut: 'annulé' };
                      sset(`rdv:${r.id}`, upd);
                      setRdvs(prev => prev.map(x => x.id === r.id ? upd : x));
                    }}>Annuler</button>
                  )}
                  {r.date < today() && r.statut !== 'annulé' && (
                    <button className="btn btn-o btn-sm" onClick={() => setNewAvis(r)}><L icon="star" size={13}>Avis</L></button>
                  )}
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {tab === 'favoris' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {favSalons.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun salon favori.</p>}
          {favSalons.map(s => (
            <div key={s.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700 }}>{s.nom}</p>
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{s.ville}</p>
              </div>
              <button className="btn btn-b btn-sm" onClick={() => onRebook({ salonId: s.id })}>Réserver</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'attente' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 4 }}>Inscrit sur une liste d'attente, vous êtes prévenu automatiquement dès qu'un créneau se libère.</p>
          {waiting.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucune liste d'attente active.</p>}
          {waiting.map(a => {
            const s = sget(`salon:${a.salonId}`);
            return (
              <div key={a.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
                <p style={{ fontWeight: 700 }}>{a.prestation} avec {a.barbier}</p>
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{s?.nom} · Créneaux : {(a.creneauxSouhaites || []).join(', ')}</p>
                <button className="btn btn-r btn-sm" style={{ marginTop: 8 }} onClick={() => { sdel(`attente:${a.id}`); setWaiting(waiting.filter(w => w.id !== a.id)); }}>Retirer</button>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'parrainage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(156,123,208,.18), rgba(156,123,208,.05))', border: '1px solid rgba(156,123,208,.35)', borderRadius: 14, padding: 22, textAlign: 'center' }}>
            <Icon name="users" size={26} style={{ color: '#C9AEF0', marginBottom: 8 }} />
            <h3 style={{ marginBottom: 6 }}>Parrainez vos amis</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 18 }}>Partagez votre code. À chaque ami qui s'inscrit, vous gagnez tous les deux une réduction sur votre prochaine coupe.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: 28, fontWeight: 700, letterSpacing: '.06em', color: 'var(--cream)', background: 'var(--surface2)', border: '1px dashed var(--brass-dim)', borderRadius: 10, padding: '8px 20px' }}>{client.codeParrainage || '…'}</span>
            </div>
            <button className="btn btn-b" onClick={shareCode}><Icon name="chat" size={15} /> {copied ? '✓ Copié !' : 'Partager mon code'}</button>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="stat-card">
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 700, color: 'var(--cream)' }}>{(client.filleuls || []).length}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Amis parrainés</div>
            </div>
            <div className="stat-card">
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 30, fontWeight: 700, color: '#C9AEF0' }}>{client.recompenses || 0}</div>
              <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>Réductions gagnées</div>
            </div>
          </div>
        </div>
      )}

      {newAvis && (
        <Modal onClose={() => setNewAvis(null)} title="Laisser un avis" width={440}>
          <p style={{ color: 'var(--text-dim)', marginBottom: 14, fontSize: 15 }}>Pour votre RDV : {newAvis.prestation} avec {newAvis.barbier}</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setAvisForm(f => ({ ...f, note: n }))}
                style={{ fontSize: 26, background: 'none', border: 'none', color: n <= avisForm.note ? '#D4AF37' : 'var(--text-muted)', cursor: 'pointer' }}>★</button>
            ))}
          </div>
          <textarea className="fi" rows={3} placeholder="Votre commentaire (optionnel)" value={avisForm.commentaire} onChange={e => setAvisForm(f => ({ ...f, commentaire: e.target.value }))} style={{ marginBottom: 14 }} />
          <button className="btn btn-b" onClick={submitAvis}>Publier l'avis</button>
        </Modal>
      )}
    </div>
  );
}

function StatutBadge({ statut }) {
  const map = { 'confirmé': { c: 'var(--success)', bg: '#3D7A5420' }, 'en attente': { c: 'var(--brass)', bg: 'var(--brass-pale)' }, 'annulé': { c: 'var(--danger)', bg: '#8B202020' } };
  const s = map[statut] || map['en attente'];
  return <Badge color={s.c} bg={s.bg}>{statut}</Badge>;
}

// ============================================================
// SALON DASHBOARD
// ============================================================
function SalonDashboard({ salon: initialSalon, onLogout }) {
  const [salon, setSalon] = useState(initialSalon);
  const [tab, setTab] = useState('rdv');

  function refresh() {
    const fresh = sget(`salon:${salon.id}`);
    if (fresh) setSalon(fresh);
  }

  const forfait = salon.forfait || 'essentiel';
  const canCroissance = ['croissance', 'premium', 'reseau'].includes(forfait);
  const canPremium = ['premium', 'reseau'].includes(forfait);

  const lockIcon = <Icon name="lock" size={12} style={{ marginLeft: 5, opacity: .7 }} />;
  const allTabs = [
    { id: 'rdv', label: <L icon="list" size={15}>Agenda</L> },
    { id: 'tarifs', label: <L icon="tag" size={15}>Équipe</L> },
    { id: 'portfolio', label: <L icon="camera" size={15}>Galerie</L> },
    { id: 'rappels', label: <L icon="clock" size={15}>Rappels{!canCroissance ? lockIcon : null}</L> },
    { id: 'avis', label: <L icon="star" size={15}>Avis{!canCroissance ? lockIcon : null}</L> },
    { id: 'relance', label: <L icon="cycle" size={15}>Relance{!canPremium ? lockIcon : null}</L> },
    { id: 'stats', label: <L icon="chart" size={15}>Stats</L> },
    { id: 'params', label: <L icon="settings" size={15}>Paramètres</L> },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2>{salon.nom}</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>
            {salon.ville} · {salon.adresse}
            <span style={{ marginLeft: 10, color: FORFAITS[forfait]?.color, fontWeight: 700 }}>● {FORFAITS[forfait]?.nom}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-o btn-sm" onClick={refresh}>↻ Actualiser</button>
          <button className="btn btn-o btn-sm" onClick={onLogout}>Déconnexion</button>
        </div>
      </div>

      <Tabs tabs={allTabs} active={tab} onChange={setTab} />

      {tab === 'rdv' && <AppointmentTab salon={salon} onRefresh={refresh} />}
      {tab === 'tarifs' && <EquipeTab salon={salon} onUpdate={s => { sset(`salon:${s.id}`, s); setSalon(s); }} />}
      {tab === 'portfolio' && <PortfolioTab salon={salon} onUpdate={s => { sset(`salon:${s.id}`, s); setSalon(s); }} />}
      {tab === 'rappels' && (!canCroissance ? <LockBadge plan="Croissance" /> : <RappelsTab salon={salon} />)}
      {tab === 'avis' && (!canCroissance ? <LockBadge plan="Croissance" /> : <AvisRequestTab salon={salon} />)}
      {tab === 'relance' && (!canPremium ? <LockBadge plan="Premium" /> : <RelanceTab salon={salon} />)}
      {tab === 'stats' && <StatsTab salon={salon} setSalon={s => { sset(`salon:${s.id}`, s); setSalon(s); }} />}
      {tab === 'params' && <ParamsTab salon={salon} onUpdate={s => { sset(`salon:${s.id}`, s); setSalon(s); }} />}
    </div>
  );
}

function AppointmentTab({ salon, onRefresh }) {
  const [rdvs, setRdvs] = useState([]);
  const [filter, setFilter] = useState('today');

  useEffect(() => { loadRdvs(); }, [salon.id]);

  function loadRdvs() {
    const all = getAllByPrefix('rdv:').filter(r => r.salonId === salon.id);
    setRdvs(all.sort((a, b) => (a.date + a.heure).localeCompare(b.date + b.heure)));
  }

  function updateStatut(id, statut) {
    const r = sget(`rdv:${id}`);
    if (!r) return;
    const updated = { ...r, statut };
    sset(`rdv:${id}`, updated);
    if (statut === 'annulé') notifyWaitingOnCancel(updated);
    loadRdvs();
  }

  function notifyWaitingOnCancel(rdv) {
    // Smart waiting list: find people waiting for this barber on this freed slot,
    // notify the first in line (FIFO by createdAt) and remove their waitlist entry.
    const waitList = getAllByPrefix('attente:')
      .filter(a => a.salonId === rdv.salonId && a.barbier === rdv.barbier && (a.creneauxSouhaites || []).includes(rdv.heure))
      .sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
    const first = waitList[0];
    if (!first) return;
    const salonObj = sget(`salon:${rdv.salonId}`);
    const nid = 'notif_' + uid();
    sset(`notif:${nid}`, {
      id: nid, clientId: first.clientId, type: 'attente',
      message: `Un créneau s'est libéré chez ${salonObj?.nom || 'votre salon'} : ${first.prestation} avec ${rdv.barbier} le ${fmtDate(rdv.date)} à ${rdv.heure}. Réservez vite !`,
      salonId: rdv.salonId, barbier: rdv.barbier, prestation: first.prestation, date: rdv.date, heure: rdv.heure,
      lu: false, createdAt: new Date().toISOString(),
    });
    sdel(`attente:${first.id}`);
  }

  function deleteRdv(id) {
    sdel(`rdv:${id}`);
    loadRdvs();
  }

  const todayStr = today();
  const filtered = rdvs.filter(r => {
    if (filter === 'today') return r.date === todayStr;
    if (filter === 'upcoming') return r.date >= todayStr;
    if (filter === 'past') return r.date < todayStr;
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[['today','Aujourd\'hui'],['upcoming','À venir'],['past','Passés'],['all','Tous']].map(([v, l]) => (
          <button key={v} className={`btn btn-sm ${filter === v ? 'btn-b' : 'btn-o'}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
        <button className="btn btn-o btn-sm" onClick={() => { loadRdvs(); onRefresh(); }} style={{ marginLeft: 'auto' }}>↻</button>
      </div>

      {filtered.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>Aucun RDV pour ce filtre.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((r, i) => (
          <div key={r.id} className="afu" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, animationDelay: `${i * 0.05}s` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ minWidth: 200 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: 'var(--cream)' }}>{r.clientNom}</span>
                  <StatutBadge statut={r.statut} />
                </div>
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{r.prestation} avec <strong>{r.barbier}</strong></p>
                <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{fmtDate(r.date)} à {r.heure}{r.prix ? ` · ${r.prix} €` : ''}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="phone" size={12} />{r.clientTel}</p>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {r.statut !== 'confirmé' && <button className="btn btn-g btn-sm" onClick={() => updateStatut(r.id, 'confirmé')}>Confirmer</button>}
                {r.statut !== 'annulé' && <button className="btn btn-r btn-sm" onClick={() => updateStatut(r.id, 'annulé')}>Annuler</button>}
                <button className="btn btn-o btn-sm" onClick={() => deleteRdv(r.id)} style={{ color: 'var(--text-muted)' }}>Suppr.</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <WaitingSection salon={salon} />
    </div>
  );
}

function WaitingSection({ salon }) {
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) setList(getAllByPrefix('attente:').filter(a => a.salonId === salon.id));
  }, [show, salon.id]);

  return (
    <div style={{ marginTop: 24 }}>
      <button className="btn btn-o btn-sm" onClick={() => setShow(!show)}>
        {show ? '▲' : '▼'} Liste d'attente ({getAllByPrefix('attente:').filter(a => a.salonId === salon.id).length})
      </button>
      {show && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {list.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Aucune demande d'attente.</p>}
          {list.map(a => (
            <div key={a.id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: 12, fontSize: 14 }}>
              <p><strong>{a.prestation}</strong> avec {a.barbier}</p>
              <p style={{ color: 'var(--text-dim)' }}>Créneaux souhaités : {(a.creneauxSouhaites || []).join(', ')}</p>
              <p style={{ color: 'var(--text-muted)' }}>Client ID : {a.clientId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EquipeTab({ salon, onUpdate }) {
  const [barbiers, setBarbiers] = useState(() => (salon.barbiers || []).map(b => ({ nom: b.nom || '', photo: b.photo || '', tarifs: b.tarifs || {}, portfolio: b.portfolio || [] })));
  const [saved, setSaved] = useState(false);

  function updField(bi, k, v) {
    setBarbiers(prev => prev.map((b, i) => i !== bi ? b : { ...b, [k]: v }));
  }
  function updTarif(bi, p, v) {
    setBarbiers(prev => prev.map((b, i) => i !== bi ? b : { ...b, tarifs: { ...b.tarifs, [p]: v === '' ? undefined : Number(v) } }));
  }
  function addBarber() {
    setBarbiers(prev => [...prev, { nom: '', photo: '', tarifs: {}, portfolio: [] }]);
  }
  function removeBarber(bi) {
    if (barbiers.length <= 1) return;
    setBarbiers(prev => prev.filter((_, i) => i !== bi));
  }

  function save() {
    onUpdate({ ...salon, barbiers, nbBarbiers: barbiers.length });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 17 }}>Équipe & Tarifs</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-o btn-sm" onClick={addBarber}><Icon name="plus" size={14} /> Ajouter</button>
          <button className="btn btn-b btn-sm" onClick={save}>{saved ? '✓ Enregistré' : 'Enregistrer'}</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {barbiers.map((b, bi) => (
          <div key={bi} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
            {/* Barber identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              {b.photo ? (
                <img src={b.photo} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)', flexShrink: 0 }} onError={e => { e.target.style.display = 'none'; }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--surface2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="user" size={20} style={{ color: 'var(--text-muted)' }} />
                </div>
              )}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="fi" placeholder="Prénom du barbier" value={b.nom} onChange={e => updField(bi, 'nom', e.target.value)} style={{ padding: '9px 12px' }} />
                <input className="fi" placeholder="URL photo de profil (optionnel)" value={b.photo} onChange={e => updField(bi, 'photo', e.target.value)} style={{ padding: '9px 12px', fontSize: 13 }} />
              </div>
              {barbiers.length > 1 && (
                <button onClick={() => removeBarber(bi)} className="btn btn-r btn-sm" style={{ flexShrink: 0 }} title="Supprimer ce barbier">
                  <Icon name="trash" size={14} />
                </button>
              )}
            </div>
            {/* Tarifs */}
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.08em' }}>Tarifs</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: 10 }}>
              {PRESTATIONS.map(p => (
                <div key={p}>
                  <label style={{ fontSize: 13, color: 'var(--text-dim)', display: 'block', marginBottom: 3 }}>{p}</label>
                  <div style={{ position: 'relative' }}>
                    <input className="fi" type="number" min={0} placeholder="—" value={b.tarifs?.[p] || ''} onChange={e => updTarif(bi, p, e.target.value)} style={{ paddingRight: 28 }} />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }}>€</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ParamsTab({ salon, onUpdate }) {
  const [form, setForm] = useState({
    nom: salon.nom || '',
    adresse: salon.adresse || '',
    ville: salon.ville || '',
    telephone: salon.telephone || '',
    lienAvisGoogle: salon.lienAvisGoogle || '',
    infos: salon.infos || '',
    horaires: salon.horaires && typeof salon.horaires === 'object' ? salon.horaires : { ...HORAIRES_DEFAULT },
    promoActive: !!salon.promo,
    promoDate: salon.promo?.date || '',
    promoReduction: salon.promo?.reduction || 15,
  });
  const [saved, setSaved] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updHoraire = (j, k, v) => setForm(f => ({ ...f, horaires: { ...f.horaires, [j]: { ...f.horaires[j], [k]: v } } }));

  function save() {
    const { promoActive, promoDate, promoReduction, ...rest } = form;
    const promo = (promoActive && promoDate && promoReduction > 0) ? { date: promoDate, reduction: Number(promoReduction) } : null;
    onUpdate({ ...salon, ...rest, promo });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 17 }}>Paramètres du salon</h3>
        <button className="btn btn-b btn-sm" onClick={save}>{saved ? '✓ Enregistré' : 'Enregistrer'}</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input className="fi" placeholder="Nom du salon" value={form.nom} onChange={e => upd('nom', e.target.value)} />
        <select className="fi" value={form.ville} onChange={e => upd('ville', e.target.value)}>
          <option value="">Ville</option>
          {VILLES.map(v => <option key={v}>{v}</option>)}
        </select>
        <input className="fi" placeholder="Adresse complète" value={form.adresse} onChange={e => upd('adresse', e.target.value)} />
        <input className="fi" placeholder="Téléphone" value={form.telephone} onChange={e => upd('telephone', e.target.value)} />
        <input className="fi" placeholder="Lien avis Google" value={form.lienAvisGoogle} onChange={e => upd('lienAvisGoogle', e.target.value)} />
        <textarea className="fi" placeholder="Infos pratiques (parking, accès…)" value={form.infos} onChange={e => upd('infos', e.target.value)} rows={3} />

        <div>
          <label style={{ color: 'var(--text-dim)', fontSize: 13, display: 'block', marginBottom: 8 }}>Horaires d'ouverture</label>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {JOURS.map((j, idx) => {
              const h = form.horaires[j] || { ouvert: false, debut: '09:00', fin: '19:00' };
              return (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', borderBottom: idx < 6 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ width: 88, fontSize: 14, fontWeight: 500, flexShrink: 0 }}>{JOURS_LABELS[j]}</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', minWidth: 66, flexShrink: 0 }}>
                    <input type="checkbox" checked={h.ouvert} onChange={e => updHoraire(j, 'ouvert', e.target.checked)} style={{ accentColor: 'var(--cream)', width: 14, height: 14 }} />
                    <span style={{ fontSize: 12, color: h.ouvert ? 'var(--cream-dim)' : 'var(--text-muted)' }}>{h.ouvert ? 'Ouvert' : 'Fermé'}</span>
                  </label>
                  <input type="time" className="fi" value={h.debut} disabled={!h.ouvert}
                    onChange={e => updHoraire(j, 'debut', e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', fontSize: 13, opacity: h.ouvert ? 1 : 0.3, minWidth: 0 }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: 12, flexShrink: 0 }}>–</span>
                  <input type="time" className="fi" value={h.fin} disabled={!h.ouvert}
                    onChange={e => updHoraire(j, 'fin', e.target.value)}
                    style={{ flex: 1, padding: '7px 10px', fontSize: 13, opacity: h.ouvert ? 1 : 0.3, minWidth: 0 }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Promotion sur une date précise */}
        <div style={{ background: 'var(--surface2)', border: `1px solid ${form.promoActive ? 'rgba(156,123,208,.4)' : 'var(--border)'}`, borderRadius: 12, padding: 16 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: form.promoActive ? 14 : 0 }}>
            <input type="checkbox" checked={form.promoActive} onChange={e => upd('promoActive', e.target.checked)} style={{ accentColor: '#9C7BD0', width: 16, height: 16 }} />
            <span style={{ fontWeight: 600, fontSize: 15 }}><Icon name="bolt" size={15} style={{ color: '#C9AEF0' }} /> Offre sur une date précise</span>
          </label>
          {form.promoActive && (
            <>
              <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 12 }}>Choisissez un jour creux du mois et appliquez une réduction pour le remplir. La promo s'affiche aux clients lors de la réservation.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 160px' }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Date de l'offre</label>
                  <input type="date" className="fi" value={form.promoDate} min={today()} onChange={e => upd('promoDate', e.target.value)} />
                </div>
                <div style={{ flex: '0 0 120px' }}>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Réduction</label>
                  <div style={{ position: 'relative' }}>
                    <input type="number" className="fi" min={5} max={70} value={form.promoReduction} onChange={e => upd('promoReduction', e.target.value)} style={{ paddingRight: 28 }} />
                    <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }}>%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PortfolioTab({ salon, onUpdate }) {
  const [barbiers, setBarbiers] = useState(salon.barbiers || []);
  const [saved, setSaved] = useState(false);

  function addPhoto(bi, url) {
    if (!url.trim()) return;
    setBarbiers(prev => prev.map((b, i) => i !== bi ? b : { ...b, portfolio: [...(b.portfolio || []), url.trim()] }));
  }

  function removePhoto(bi, pi) {
    setBarbiers(prev => prev.map((b, i) => i !== bi ? b : { ...b, portfolio: b.portfolio.filter((_, j) => j !== pi) }));
  }

  function save() {
    onUpdate({ ...salon, barbiers });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 17 }}>Portfolio des réalisations</h3>
        <button className="btn btn-b btn-sm" onClick={save}>{saved ? '✓ Enregistré' : 'Enregistrer'}</button>
      </div>
      {barbiers.map((b, bi) => (
        <BarberPortfolioEditor key={bi} barber={b} onAddPhoto={url => { addPhoto(bi, url); }} onRemovePhoto={pi => removePhoto(bi, pi)} />
      ))}
    </div>
  );
}

function BarberPortfolioEditor({ barber, onAddPhoto, onRemovePhoto }) {
  const [url, setUrl] = useState('');
  const fileRef = useRef(null);

  function handleFile(e) {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => onAddPhoto(ev.target.result);
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }

  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ color: 'var(--cream-dim)', marginBottom: 10 }}>{barber.nom || 'Barbier'}</h4>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
        <input className="fi" placeholder="Coller une URL de photo (optionnel)" value={url} onChange={e => setUrl(e.target.value)} style={{ flex: '1 1 200px' }} />
        <button className="btn btn-o btn-sm" onClick={() => { if (url.trim()) { onAddPhoto(url.trim()); setUrl(''); } }}>Ajouter URL</button>
      </div>
      <div style={{ marginBottom: 12 }}>
        <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleFile} />
        <button className="btn btn-b btn-sm" onClick={() => fileRef.current?.click()}><Icon name="camera" size={14} /> Depuis l'appareil</button>
      </div>
      {(barber.portfolio || []).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Aucune photo pour l'instant.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 8 }}>
        {(barber.portfolio || []).map((p, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <img src={p} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
            <button onClick={() => onRemovePhoto(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,.7)', border: 'none', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RappelsTab({ salon }) {
  const [rdvs, setRdvs] = useState([]);
  const [generated, setGenerated] = useState({});
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    setRdvs(getAllByPrefix('rdv:').filter(r => r.salonId === salon.id && r.date === tomorrowStr && r.statut !== 'annulé'));
  }, [salon.id]);

  async function generateMsg(rdv) {
    setLoading(rdv.id);
    try {
      const msg = await callAI([{ role: 'user', content: `Rédige un rappel de RDV WhatsApp pour ${rdv.clientNom}, RDV demain à ${rdv.heure} pour ${rdv.prestation} avec ${rdv.barbier} au salon ${salon.nom}. Court et chaleureux, en français.` }]);
      setGenerated(g => ({ ...g, [rdv.id]: msg }));
    } catch {
      setGenerated(g => ({ ...g, [rdv.id]: `Bonjour ${rdv.clientNom} ! Rappel : RDV demain à ${rdv.heure} au ${salon.nom} pour ${rdv.prestation} avec ${rdv.barbier}. À demain !` }));
    }
    setLoading(null);
  }

  return (
    <div>
      <div style={{ background: 'var(--brass-pale)', border: '1px solid var(--brass-dim)', borderRadius: 6, padding: 12, marginBottom: 20, fontSize: 14, color: 'var(--text-dim)' }}>
        <Icon name="bolt" size={15} style={{ color: 'var(--cream)' }} /> <strong style={{ color: 'var(--brass)' }}>Automatisable en Premium</strong> — En formule Premium, les rappels sont envoyés automatiquement la veille via WhatsApp Business.
      </div>
      <h3 style={{ fontSize: 17, marginBottom: 14 }}>RDV de demain — Rappels anti no-show</h3>
      {rdvs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun RDV demain à rappeler.</p>}
      {rdvs.map(r => (
        <div key={r.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{r.clientNom} — {r.heure} · {r.prestation}</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="phone" size={13} />{r.clientTel}</p>
          {!generated[r.id]
            ? <button className="btn btn-o btn-sm" onClick={() => generateMsg(r)} disabled={loading === r.id}>{loading === r.id ? <><Spin /> Génération…</> : <L icon="sparkle" size={14}>Générer le message</L>}</button>
            : (
              <div>
                <textarea className="fi" rows={3} value={generated[r.id]} onChange={e => setGenerated(g => ({ ...g, [r.id]: e.target.value }))} style={{ marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={phoneLink(r.clientTel, generated[r.id])} target="_blank" rel="noreferrer" className="btn btn-g btn-sm" style={{ textDecoration: 'none' }}>WhatsApp ↗</a>
                  <a href={smsLink(r.clientTel, generated[r.id])} className="btn btn-o btn-sm" style={{ textDecoration: 'none' }}>SMS</a>
                </div>
              </div>
            )
          }
        </div>
      ))}
    </div>
  );
}

function AvisRequestTab({ salon }) {
  const [rdvs, setRdvs] = useState([]);
  const [generated, setGenerated] = useState({});
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const allRdv = getAllByPrefix('rdv:').filter(r => r.salonId === salon.id && r.date < today() && r.statut !== 'annulé');
    setRdvs(allRdv.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20));
  }, [salon.id]);

  async function generateMsg(rdv) {
    setLoading(rdv.id);
    try {
      const msg = await callAI([{ role: 'user', content: `Rédige un message de demande d'avis après coiffure pour ${rdv.clientNom} qui avait RDV pour ${rdv.prestation}. Inclus une invitation à laisser un avis Google et dans l'appli. Court et sympa.` }]);
      setGenerated(g => ({ ...g, [rdv.id]: msg }));
    } catch {
      setGenerated(g => ({ ...g, [rdv.id]: `Bonjour ${rdv.clientNom} ! J'espère que votre ${rdv.prestation} vous a plu. Si vous êtes satisfait, un petit avis Google nous ferait vraiment plaisir : ${salon.lienAvisGoogle || '[lien]'}. Merci !` }));
    }
    setLoading(null);
  }

  return (
    <div>
      <div style={{ background: 'var(--brass-pale)', border: '1px solid var(--brass-dim)', borderRadius: 6, padding: 12, marginBottom: 20, fontSize: 14, color: 'var(--text-dim)' }}>
        <Icon name="bolt" size={15} style={{ color: 'var(--cream)' }} /> <strong style={{ color: 'var(--brass)' }}>Automatisable en Premium</strong> — En formule Premium, la demande d'avis est envoyée automatiquement après chaque RDV.
      </div>
      <h3 style={{ fontSize: 17, marginBottom: 14 }}>Demande d'avis après RDV</h3>
      {rdvs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun RDV passé à solliciter.</p>}
      {rdvs.slice(0, 8).map(r => (
        <div key={r.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{r.clientNom} — {fmtDate(r.date)} · {r.prestation}</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="phone" size={13} />{r.clientTel}</p>
          {!generated[r.id]
            ? <button className="btn btn-o btn-sm" onClick={() => generateMsg(r)} disabled={loading === r.id}>{loading === r.id ? <><Spin /> Génération…</> : <L icon="sparkle" size={14}>Générer</L>}</button>
            : (
              <div>
                <textarea className="fi" rows={3} value={generated[r.id]} onChange={e => setGenerated(g => ({ ...g, [r.id]: e.target.value }))} style={{ marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={phoneLink(r.clientTel, generated[r.id])} target="_blank" rel="noreferrer" className="btn btn-g btn-sm" style={{ textDecoration: 'none' }}>WhatsApp ↗</a>
                  <a href={smsLink(r.clientTel, generated[r.id])} className="btn btn-o btn-sm" style={{ textDecoration: 'none' }}>SMS</a>
                </div>
              </div>
            )
          }
        </div>
      ))}
    </div>
  );
}

function RelanceTab({ salon }) {
  const [weeks, setWeeks] = useState(4);
  const [clients, setClients] = useState([]);
  const [generated, setGenerated] = useState({});
  const [loading, setLoading] = useState(null);

  function loadInactifs() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - weeks * 7);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    const rdvs = getAllByPrefix('rdv:').filter(r => r.salonId === salon.id && r.statut !== 'annulé');
    const byClient = {};
    rdvs.forEach(r => {
      if (!byClient[r.clientId] || r.date > byClient[r.clientId].date) byClient[r.clientId] = r;
    });
    const inactifs = Object.values(byClient).filter(r => r.date < cutoffStr);
    const prix = rdvs.reduce((s, r) => s + (r.prix || 0), 0) / (rdvs.length || 1);
    setClients(inactifs.map(r => ({ ...r, prixMoyen: Math.round(prix) })));
  }

  async function generateMsg(r) {
    setLoading(r.clientId);
    try {
      const msg = await callAI([{ role: 'user', content: `Rédige un message de relance pour ${r.clientNom} qui n'est plus venu depuis ${weeks} semaines. Salon ${salon.nom}. Offre de revenir, chaleureux.` }]);
      setGenerated(g => ({ ...g, [r.clientId]: msg }));
    } catch {
      setGenerated(g => ({ ...g, [r.clientId]: `Bonjour ${r.clientNom} ! Ça fait un moment qu'on ne s'est pas vus au ${salon.nom}. Revenez nous voir, on sera ravis de vous retrouver !` }));
    }
    setLoading(null);
  }

  const totalPotentiel = clients.reduce((s, c) => s + (c.prixMoyen || 0), 0);

  return (
    <div>
      <h3 style={{ fontSize: 17, marginBottom: 14 }}>Relance des clients inactifs</h3>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <label style={{ color: 'var(--text-dim)', fontSize: 15 }}>Inactifs depuis :</label>
        <select className="fi" value={weeks} onChange={e => setWeeks(Number(e.target.value))} style={{ width: 'auto' }}>
          {[2,3,4,6,8,12].map(n => <option key={n} value={n}>{n} semaines</option>)}
        </select>
        <button className="btn btn-b btn-sm" onClick={loadInactifs}>Analyser</button>
      </div>

      {clients.length > 0 && (
        <div style={{ background: 'var(--brass-pale)', border: '1px solid var(--brass-dim)', borderRadius: 6, padding: 14, marginBottom: 16 }}>
          <span style={{ fontWeight: 700, color: 'var(--brass)', fontSize: 18 }}>{clients.length} clients</span>
          <span style={{ color: 'var(--text-dim)', marginLeft: 8 }}>× {clients[0]?.prixMoyen || '?'} € prix moyen = </span>
          <span style={{ color: 'var(--cream)', fontWeight: 700, fontSize: 18 }}>{totalPotentiel} € potentiels</span>
        </div>
      )}

      {clients.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Cliquez sur "Analyser" pour détecter les clients inactifs.</p>}

      {clients.map(r => (
        <div key={r.clientId} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{r.clientNom} — dernier RDV : {fmtDate(r.date)}</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 5 }}><Icon name="phone" size={13} />{r.clientTel}</p>
          {!generated[r.clientId]
            ? <button className="btn btn-o btn-sm" onClick={() => generateMsg(r)} disabled={loading === r.clientId}>{loading === r.clientId ? <><Spin /> Génération…</> : <L icon="sparkle" size={14}>Générer</L>}</button>
            : (
              <div>
                <textarea className="fi" rows={3} value={generated[r.clientId]} onChange={e => setGenerated(g => ({ ...g, [r.clientId]: e.target.value }))} style={{ marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={phoneLink(r.clientTel, generated[r.clientId])} target="_blank" rel="noreferrer" className="btn btn-g btn-sm" style={{ textDecoration: 'none' }}>WhatsApp ↗</a>
                  <a href={smsLink(r.clientTel, generated[r.clientId])} className="btn btn-o btn-sm" style={{ textDecoration: 'none' }}>SMS</a>
                </div>
              </div>
            )
          }
        </div>
      ))}
    </div>
  );
}

const MISE_EN_AVANT_PRIX = 29;

function MiseEnAvantCard({ salon, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  function handlePay() {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      onUpdate({ ...salon, miseEnAvant: true });
      setTimeout(() => { setShowModal(false); setPaid(false); }, 1800);
    }, 1500);
  }

  function deactivate() {
    onUpdate({ ...salon, miseEnAvant: false });
  }

  return (
    <div style={{ background: 'var(--card)', border: `1px solid ${salon.miseEnAvant ? 'var(--brass-dim)' : 'var(--border)'}`, borderRadius: 8, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <h4 style={{ color: 'var(--cream-dim)', marginBottom: 4 }}>Mise en avant</h4>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, margin: 0 }}>
            Votre salon apparaît en tête de la recherche dans votre ville. Visibilité maximale.
          </p>
        </div>
        <span style={{ color: 'var(--cream)', fontWeight: 700, fontSize: 18, whiteSpace: 'nowrap', marginLeft: 16 }}>
          {MISE_EN_AVANT_PRIX} €<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-dim)' }}>/mois</span>
        </span>
      </div>
      {salon.miseEnAvant ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="dispo-badge">● Actif — Votre salon est sponsorisé</span>
          <button className="btn btn-r btn-sm" onClick={deactivate}>Désactiver</button>
        </div>
      ) : (
        <button className="btn btn-b btn-sm" onClick={() => setShowModal(true)}>
          <Icon name="bolt" size={14} /> Activer la mise en avant — {MISE_EN_AVANT_PRIX} €/mois
        </button>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 style={{ marginBottom: 8 }}>Mise en avant</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 16 }}>
            Votre salon <strong style={{ color: 'var(--cream)' }}>{salon.nom}</strong> sera affiché en tête de la liste de <strong style={{ color: 'var(--cream)' }}>{salon.ville}</strong> avec le badge « Sponsorisé ».
          </p>
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
              <span style={{ color: 'var(--text-dim)' }}>Mise en avant mensuelle</span>
              <span style={{ fontWeight: 700 }}>{MISE_EN_AVANT_PRIX},00 €</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
              <span>Renouvellement automatique, annulable à tout moment</span>
            </div>
          </div>
          {paid ? (
            <p style={{ color: 'var(--success)', textAlign: 'center', fontWeight: 600 }}>✓ Paiement confirmé — mise en avant activée !</p>
          ) : (
            <button className="btn btn-b" style={{ width: '100%' }} onClick={handlePay} disabled={paying}>
              {paying ? <Spin /> : `Confirmer le paiement — ${MISE_EN_AVANT_PRIX} €`}
            </button>
          )}
        </Modal>
      )}
    </div>
  );
}

function StatsTab({ salon, setSalon }) {
  const rdvs = getAllByPrefix('rdv:').filter(r => r.salonId === salon.id);
  const thisMonth = rdvs.filter(r => r.date?.startsWith(new Date().toISOString().slice(0, 7)));
  const caMonth = thisMonth.reduce((s, r) => s + (r.prix || 0), 0);
  const avis = getAllByPrefix('avis:').filter(a => a.salonId === salon.id);

  return (
    <div>
      <h3 style={{ fontSize: 17, marginBottom: 20 }}>Statistiques du salon</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'RDV ce mois', val: thisMonth.length, unit: '' },
          { label: 'CA ce mois', val: caMonth, unit: ' €' },
          { label: 'RDV total', val: rdvs.length, unit: '' },
          { label: 'Avis', val: avis.length, unit: ` (${avgNote(avis)} ★)` },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--cream)', fontFamily: "'Fraunces',serif" }}>{s.val}{s.unit}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 16 }}>
        <h4 style={{ marginBottom: 12, color: 'var(--cream-dim)' }}>Revenus / RDV ce mois</h4>
        <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>{thisMonth.length} rendez-vous · {caMonth} € de CA estimé</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
          Commission plateforme (1 %) : ~{Math.round(caMonth * 0.01)} € · Abonnement {FORFAITS[salon.forfait]?.nom} : {FORFAITS[salon.forfait]?.prix} €/mois
        </p>
      </div>

      <MiseEnAvantCard salon={salon} onUpdate={s => { sset(`salon:${s.id}`, s); setSalon(s); }} />
    </div>
  );
}

// ============================================================
// SALON LOGIN
// ============================================================
function SalonLogin({ onDone, onRegister, onBack }) {
  const [nom, setNom] = useState('');
  const [err, setErr] = useState('');

  function login() {
    const all = getAllByPrefix('salon:');
    const found = all.find(s => s.nom.toLowerCase() === nom.toLowerCase().trim());
    if (!found) { setErr('Salon introuvable. Vérifiez le nom exact.'); return; }
    onDone(found);
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <button onClick={onBack} className="btn btn-o btn-sm" style={{ marginBottom: 20 }}>← Retour</button>
      <h2 style={{ marginBottom: 6 }}>Accès espace salon</h2>
      <p style={{ color: 'var(--text-dim)', marginBottom: 24, fontSize: 15 }}>Entrez le nom exact de votre salon</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input className="fi" placeholder="Nom du salon" value={nom} onChange={e => setNom(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        {err && <p style={{ color: '#E06060', fontSize: 14 }}>{err}</p>}
        <button className="btn btn-b" onClick={login}>Accéder à mon espace →</button>
        <div className="divider" />
        <button className="btn btn-o" onClick={onRegister}><L icon="scissors" size={15}>Inscrire mon salon</L></button>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminLogin({ onDone, onBack }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  return (
    <div style={{ maxWidth: 360, margin: '0 auto', padding: 24 }}>
      <button onClick={onBack} className="btn btn-o btn-sm" style={{ marginBottom: 20 }}>← Retour</button>
      <h2 style={{ marginBottom: 20 }}>Panneau Admin</h2>
      <input className="fi" type="password" placeholder="Code administrateur" value={code} onChange={e => setCode(e.target.value)} onKeyDown={e => e.key === 'Enter' && (code === ADMIN_CODE ? onDone() : setErr('Code incorrect'))} style={{ marginBottom: 10 }} />
      {err && <p style={{ color: '#E06060', fontSize: 14, marginBottom: 10 }}>{err}</p>}
      <button className="btn btn-b" onClick={() => code === ADMIN_CODE ? onDone() : setErr('Code incorrect')}>Accéder</button>
    </div>
  );
}

function AdminPanel({ onBack }) {
  const [salons, setSalons] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { setSalons(getAllByPrefix('salon:')); }, []);

  function toggleSponsored(s) {
    const upd = { ...s, miseEnAvant: !s.miseEnAvant };
    sset(`salon:${s.id}`, upd);
    setSalons(prev => prev.map(x => x.id === s.id ? upd : x));
  }

  function deleteSalon(id) {
    if (!window.confirm('Supprimer ce salon ?')) return;
    sdel(`salon:${id}`);
    setSalons(prev => prev.filter(s => s.id !== id));
  }

  const totalRdv = getAllByPrefix('rdv:').length;
  const totalAvis = getAllByPrefix('avis:').length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2>Panneau d'administration</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Cockpit de la plateforme BarberLink</p>
        </div>
        <button onClick={onBack} className="btn btn-o btn-sm">Retour</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { l: 'Salons inscrits', v: salons.length },
          { l: 'RDV total', v: totalRdv },
          { l: 'Avis clients', v: totalAvis },
          { l: 'Salons sponsorisés', v: salons.filter(s => s.miseEnAvant).length },
        ].map(s => (
          <div key={s.l} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: 'var(--cream)', fontFamily: "'Fraunces',serif" }}>{s.v}</div>
            <div style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 14, fontSize: 17 }}>Tous les salons</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {salons.map(s => {
          const rdvs = getAllByPrefix('rdv:').filter(r => r.salonId === s.id);
          const avis = getAllByPrefix('avis:').filter(a => a.salonId === s.id);
          return (
            <div key={s.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{s.nom}</span>
                    <Badge>{FORFAITS[s.forfait]?.nom || s.forfait}</Badge>
                    {s.miseEnAvant && <span className="badge-sponsored">Sponsorisé</span>}
                  </div>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{s.ville} · {s.adresse}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{rdvs.length} RDV · {avis.length} avis · {s.barbiers?.length} barbier(s)</p>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <button className="btn btn-o btn-sm" onClick={() => toggleSponsored(s)}>{s.miseEnAvant ? 'Retirer mise en avant' : 'Mettre en avant'}</button>
                  <button className="btn btn-o btn-sm" onClick={() => setSelected(s)}>Détails</button>
                  <button className="btn btn-r btn-sm" onClick={() => deleteSalon(s.id)}>Suppr.</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected && (
        <Modal onClose={() => setSelected(null)} title={`Détails — ${selected.nom}`} width={600}>
          <pre style={{ color: 'var(--text-dim)', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{JSON.stringify(selected, null, 2)}</pre>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine !== false);
  const [screen, setScreen] = useState('landing');
  const [client, setClient] = useState(null);
  const [salon, setSalon] = useState(null);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [bookingTarget, setBookingTarget] = useState(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminModal, setAdminModal] = useState(false);
  const [searchParams, setSearchParams] = useState({ prestation: '', ville: '' });

  useEffect(() => {
    // Inject CSS
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    // Seed demo data
    seedData();
    return () => { try { document.head.removeChild(el); } catch {} };
  }, []);

  // Watch connectivity
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  if (!online) return <OfflineScreen onRetry={() => setOnline(navigator.onLine !== false)} />;

  function handleBook(s, barbier) {
    setBookingTarget({ salon: s, barbier });
    setScreen('booking');
  }

  function handleRebook(rdv) {
    const s = sget(`salon:${rdv.salonId}`);
    if (s) { setBookingTarget({ salon: s, barbier: rdv.barbier || null }); setScreen('booking'); }
  }

  function handleAdminClick() {
    if (adminAuth) { setScreen('admin'); } else { setAdminModal(true); }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <PoleHeader onAdmin={handleAdminClick} />

      {adminModal && !adminAuth && (
        <Modal onClose={() => setAdminModal(false)} title="Administration" width={400}>
          <AdminLogin
            onDone={() => { setAdminAuth(true); setAdminModal(false); setScreen('admin'); }}
            onBack={() => setAdminModal(false)}
          />
        </Modal>
      )}

      <main>
        {screen === 'landing' && (
          <LandingScreen
            onClient={() => setScreen('client-login')}
            onSalon={() => setScreen('salon-login')}
            onSearch={params => { setSearchParams(params); setScreen('client-login-search'); }}
          />
        )}

        {screen === 'client-login' && (
          <Ambient>
            <ClientRegistration
              onDone={c => { setClient(c); setScreen('directory'); }}
              onBack={() => setScreen('landing')}
            />
          </Ambient>
        )}

        {screen === 'client-login-search' && (
          <Ambient>
            <ClientRegistration
              onDone={c => { setClient(c); setScreen('directory'); }}
              onBack={() => setScreen('landing')}
              subtitle={`Recherche : ${searchParams.prestation || 'tous services'}${searchParams.ville ? ' · ' + searchParams.ville : ''}`}
            />
          </Ambient>
        )}

        {screen === 'salon-login' && (
          <Ambient>
            <SalonLogin
              onDone={s => { setSalon(s); setScreen('salon-dashboard'); }}
              onRegister={() => setScreen('salon-register')}
              onBack={() => setScreen('landing')}
            />
          </Ambient>
        )}

        {screen === 'salon-register' && (
          <Ambient>
            <SalonRegistration
              onDone={s => { setSalon(s); setScreen('salon-dashboard'); }}
              onBack={() => setScreen('salon-login')}
            />
          </Ambient>
        )}

        {screen === 'directory' && client && (
          <SalonDirectory
            client={client}
            onSelectSalon={s => { setSelectedSalon(s); setScreen('salon-detail'); }}
            onAccount={() => setScreen('account')}
            initialPresta={searchParams.prestation}
            initialVille={searchParams.ville}
          />
        )}

        {screen === 'salon-detail' && selectedSalon && client && (
          <SalonDetail
            salon={selectedSalon}
            client={client}
            onBack={() => setScreen('directory')}
            onBook={handleBook}
            onUpdateClient={c => setClient(c)}
          />
        )}

        {screen === 'booking' && bookingTarget && (
          <AIBookingChat
            salon={bookingTarget.salon}
            preselectedBarbier={bookingTarget.barbier}
            client={client}
            onBack={() => setScreen(selectedSalon ? 'salon-detail' : 'directory')}
            onUpdateClient={c => setClient(c)}
          />
        )}

        {screen === 'account' && client && (
          <ClientAccount
            client={client}
            onUpdateClient={c => setClient(c)}
            onBack={() => setScreen('directory')}
            onRebook={handleRebook}
          />
        )}

        {screen === 'salon-dashboard' && salon && (
          <SalonDashboard
            salon={salon}
            onLogout={() => { setSalon(null); setScreen('landing'); }}
          />
        )}

        {screen === 'admin' && adminAuth && (
          <AdminPanel onBack={() => setScreen('landing')} />
        )}
      </main>
    </div>
  );
}
