import React, { useState, useEffect, useRef } from 'react';

// ============================================================
// CONSTANTS
// ============================================================
const FORFAITS = {
  essentiel: { id: 'essentiel', nom: 'Essentiel', prix: 49, color: '#8B7355' },
  croissance: { id: 'croissance', nom: 'Croissance', prix: 99, color: '#B8860B' },
  premium: { id: 'premium', nom: 'Premium', prix: 179, color: '#D4AF37' },
};
const PRESTATIONS = ['Coupe homme','Coupe femme','Coupe enfant','Barbe','Teinture / Coloration','Dessin / Tracé'];
const VILLES = ['Saint-Denis','Saint-Paul','Saint-Pierre','Le Tampon','Saint-Louis','Sainte-Marie','Saint-Benoît','Saint-André','Saint-Joseph','Sainte-Suzanne','Le Port','Saint-Leu'];
const ADMIN_CODE = 'ADMIN2025';
const HEURES = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00'];

// ============================================================
// GLOBAL CSS
// ============================================================
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Crimson+Text:wght@400;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#0c0804;--surface:#160c05;--surface2:#1e1008;--card:#1a0e07;--card2:#221408;
  --brass:#B8860B;--brass-light:#D4A520;--brass-dim:rgba(184,134,11,0.4);--brass-pale:rgba(184,134,11,0.08);
  --bordeaux:#6B2030;--bordeaux-light:#8B3040;
  --cream:#F2DEB8;--cream-dim:#C4965E;--text:#EDD8A8;--text-dim:#9A7B50;--text-muted:#5A4025;
  --success:#3D7A54;--danger:#8B2020;--border:rgba(184,134,11,0.22);
}
body{background:var(--bg);color:var(--text);font-family:'Crimson Text',Georgia,serif;font-size:17px;line-height:1.65;min-height:100vh;
  background-image:radial-gradient(ellipse at top,rgba(184,134,11,0.04) 0%,transparent 55%);}
h1,h2,h3,h4{font-family:'Playfair Display',Georgia,serif;color:var(--cream);letter-spacing:.02em;line-height:1.25;}
button{cursor:pointer;font-family:inherit;}
input,textarea,select{font-family:inherit;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:var(--surface);}::-webkit-scrollbar-thumb{background:var(--brass-dim);border-radius:3px;}
@keyframes fadeInUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes poleMove{from{background-position:0 0;}to{background-position:0 60px;}}
@keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(184,134,11,.35);}50%{box-shadow:0 0 0 8px rgba(184,134,11,0);}}
.afu{animation:fadeInUp .5s ease both;}
.af{animation:fadeIn .35s ease both;}
.s1{animation-delay:.05s;}.s2{animation-delay:.1s;}.s3{animation-delay:.15s;}.s4{animation-delay:.2s;}.s5{animation-delay:.25s;}
.card-hover{transition:transform .2s,box-shadow .2s,border-color .2s;}
.card-hover:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,0,0,.5),0 0 20px rgba(184,134,11,.12);border-color:var(--brass)!important;}
.pole{width:10px;border-radius:5px;background:repeating-linear-gradient(0deg,#CC2222 0,#CC2222 10px,#F5F5F5 10px,#F5F5F5 20px,#1A4F9A 20px,#1A4F9A 30px);animation:poleMove 1.8s linear infinite;}
.divider{height:1px;background:linear-gradient(90deg,transparent,var(--brass),transparent);margin:14px 0;}
.fi{background:var(--surface2);border:1px solid var(--border);color:var(--text);border-radius:4px;padding:9px 13px;width:100%;font-size:16px;transition:border-color .2s,box-shadow .2s;outline:none;}
.fi:focus{border-color:var(--brass);box-shadow:0 0 0 2px rgba(184,134,11,.12);}
.fi::placeholder{color:var(--text-muted);}
.fi option{background:var(--card2);}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 20px;border-radius:4px;font-size:15px;font-weight:600;letter-spacing:.04em;border:none;transition:all .2s;}
.btn-b{background:var(--brass);color:var(--bg);}
.btn-b:hover{background:var(--brass-light);box-shadow:0 4px 14px rgba(184,134,11,.35);transform:translateY(-1px);}
.btn-o{background:transparent;color:var(--brass);border:1px solid var(--brass-dim);}
.btn-o:hover{background:var(--brass-pale);border-color:var(--brass);}
.btn-r{background:var(--bordeaux);color:var(--cream);}
.btn-r:hover{background:var(--bordeaux-light);transform:translateY(-1px);}
.btn-g{background:var(--success);color:#fff;}
.btn-g:hover{filter:brightness(1.15);}
.btn-sm{padding:6px 14px;font-size:13px;}
.btn-lg{padding:13px 30px;font-size:17px;}
.bubble-ai{background:var(--surface2);border:1px solid var(--border);border-radius:4px 14px 14px 14px;padding:11px 15px;max-width:84%;}
.bubble-u{background:var(--brass-pale);border:1px solid var(--brass-dim);border-radius:14px 4px 14px 14px;padding:11px 15px;max-width:84%;margin-left:auto;}
@media(max-width:640px){h1{font-size:1.7rem;}h2{font-size:1.35rem;}.hide-sm{display:none!important;}}
/* Hero search */
.hero-search{background:var(--surface2);border:2px solid var(--border);border-radius:50px;display:flex;align-items:center;gap:0;overflow:hidden;transition:border-color .2s,box-shadow .2s;max-width:660px;width:100%;}
.hero-search:focus-within{border-color:var(--brass);box-shadow:0 0 0 3px rgba(184,134,11,.12);}
.hero-search input{background:none;border:none;color:var(--text);padding:14px 20px;font-size:16px;outline:none;flex:1;min-width:0;}
.hero-search input::placeholder{color:var(--text-muted);}
.hero-search .sep{width:1px;height:28px;background:var(--border);flex-shrink:0;}
.hero-search select{background:none;border:none;color:var(--text-dim);padding:14px 16px;font-size:15px;outline:none;cursor:pointer;min-width:0;}
.hero-search .search-btn{background:var(--brass);border:none;color:var(--bg);padding:10px 22px;margin:5px;border-radius:40px;font-size:15px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .2s;}
.hero-search .search-btn:hover{background:var(--brass-light);}
/* Category chips */
.cat-chip{display:inline-flex;align-items:center;gap:7px;padding:10px 18px;border-radius:50px;border:1px solid var(--border);background:var(--surface2);color:var(--text-dim);font-size:14px;cursor:pointer;transition:all .2s;white-space:nowrap;}
.cat-chip:hover,.cat-chip.active{background:var(--brass-pale);border-color:var(--brass);color:var(--brass);}
/* Salon card cover */
.salon-cover{width:100%;height:130px;border-radius:6px 6px 0 0;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:48px;font-weight:900;letter-spacing:-.02em;overflow:hidden;position:relative;flex-shrink:0;}
/* Dispo badge */
.dispo-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:12px;font-weight:700;background:#3D7A5420;color:#7DC89A;border:1px solid #3D7A5440;}
.dispo-badge::before{content:'';width:6px;height:6px;border-radius:50%;background:#7DC89A;display:inline-block;}
/* Slot picker */
.slot-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(72px,1fr));gap:8px;margin-top:10px;}
.slot-btn{padding:8px 4px;border-radius:6px;border:1px solid var(--border);background:var(--surface2);color:var(--text-dim);font-size:14px;cursor:pointer;text-align:center;transition:all .15s;}
.slot-btn:hover:not(:disabled){border-color:var(--brass);color:var(--brass);background:var(--brass-pale);}
.slot-btn.selected{background:var(--brass);color:var(--bg);border-color:var(--brass);font-weight:700;}
.slot-btn:disabled{opacity:.35;cursor:not-allowed;}
/* Pro section */
.pro-section{background:var(--surface);border-top:1px solid var(--border);padding:60px 24px;text-align:center;}
/* Stat cards */
.stat-card{background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:20px;text-align:center;flex:1;min-width:120px;}
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
      <span style={{ fontSize: 20 }}>🔒</span>
      <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>Disponible en formule <strong style={{ color: 'var(--brass)' }}>{plan}</strong> ou supérieure</span>
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
    <header style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '0 20px', height: 54, display: 'flex', alignItems: 'center', gap: 14, position: 'sticky', top: 0, zIndex: 90 }}>
      <div className="pole" style={{ height: 36 }} />
      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, color: 'var(--brass)', letterSpacing: '.04em' }}>BarberLink</span>
      <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 2 }}>La Réunion</span>
      <div style={{ flex: 1 }} />
      <button onClick={onAdmin} className="btn btn-o btn-sm" style={{ fontSize: 12 }}>Admin</button>
    </header>
  );
}

// ============================================================
// LANDING
// ============================================================
const CATEGORIES = [
  { icon: '✂', label: 'Coupe', prestation: 'Coupe homme' },
  { icon: '🧔', label: 'Barbe', prestation: 'Barbe' },
  { icon: '👦', label: 'Enfant', prestation: 'Coupe enfant' },
  { icon: '🎨', label: 'Coloration', prestation: 'Teinture / Coloration' },
  { icon: '✏️', label: 'Dessin', prestation: 'Dessin / Tracé' },
  { icon: '💇', label: 'Femme', prestation: 'Coupe femme' },
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px 40px', textAlign: 'center' }}>
        <div className="afu" style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 28 }}>
          {[0,1,2].map(i => <div key={i} className="pole" style={{ height: 64, animationDelay: `${i * 0.3}s` }} />)}
        </div>

        <h1 className="afu s1" style={{ fontSize: 'clamp(2.4rem,7vw,4rem)', fontWeight: 900, letterSpacing: '.02em', marginBottom: 10 }}>
          Réservez votre barbier<br /><span style={{ color: 'var(--brass)' }}>en 3 clics</span>
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
              <span>{c.icon}</span> {c.label}
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
              <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--brass)', fontFamily: "'Playfair Display',serif" }}>{s.val}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="afu s4" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={onClient} className="btn btn-b btn-lg">✂ Trouver un barbier</button>
          <button onClick={onSalon} className="btn btn-o btn-lg">🏪 Espace salon</button>
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
              { icon: '📅', txt: 'Agenda digital temps réel' },
              { icon: '🤖', txt: 'Assistant IA 24h/24' },
              { icon: '⏰', txt: 'Rappels anti no-show' },
              { icon: '📊', txt: 'Stats & CA mensuel' },
            ].map(f => (
              <div key={f.txt} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-dim)', fontSize: 15 }}>
                <span style={{ fontSize: 20 }}>{f.icon}</span> {f.txt}
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
  const [err, setErr] = useState('');

  function submit() {
    if (!nom.trim() || !tel.trim()) { setErr('Veuillez remplir tous les champs.'); return; }
    const id = 'c_' + uid();
    const client = { id, nom: nom.trim(), telephone: tel.trim(), favoris: [], historique: [] };
    sset(`client:${id}`, client);
    onDone(client);
  }

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <button onClick={onBack} className="btn btn-o btn-sm" style={{ marginBottom: 20 }}>← Retour</button>
      <h2 className="afu" style={{ marginBottom: 6 }}>Créer mon compte client</h2>
      <p className="afu s1" style={{ color: 'var(--text-dim)', marginBottom: subtitle ? 8 : 28, fontSize: 15 }}>Gratuit · Sans carte bancaire</p>
      {subtitle && <p className="afu s1" style={{ color: 'var(--brass)', fontSize: 13, marginBottom: 20, background: 'var(--brass-pale)', padding: '5px 10px', borderRadius: 4, border: '1px solid var(--brass-dim)' }}>🔍 {subtitle}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input className="fi" placeholder="Votre prénom et nom" value={nom} onChange={e => setNom(e.target.value)} />
        <input className="fi" placeholder="Numéro de téléphone" value={tel} onChange={e => setTel(e.target.value)} type="tel" />
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
  const [form, setForm] = useState({ nom: '', ville: '', adresse: '', telephone: '', horaires: '', lienAvisGoogle: '', infos: '', forfait: 'essentiel', nbBarbiers: 1, barbiers: [{ nom: '', tarifs: {}, portfolio: [] }] });
  const [err, setErr] = useState('');

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const updBarb = (i, k, v) => setForm(f => { const b = [...f.barbiers]; b[i] = { ...b[i], [k]: v }; return { ...f, barbiers: b }; });
  const updTarif = (i, p, v) => setForm(f => { const b = [...f.barbiers]; b[i] = { ...b[i], tarifs: { ...b[i].tarifs, [p]: v ? Number(v) : undefined } }; return { ...f, barbiers: b }; });

  function setNbBarbiers(n) {
    const nb = Math.max(1, Math.min(10, Number(n)));
    const barb = [...form.barbiers];
    while (barb.length < nb) barb.push({ nom: '', tarifs: {}, portfolio: [] });
    setForm(f => ({ ...f, nbBarbiers: nb, barbiers: barb.slice(0, nb) }));
  }

  function submit() {
    if (!form.nom.trim() || !form.ville || !form.adresse.trim()) { setErr('Champs obligatoires manquants.'); return; }
    const id = 's_' + uid();
    const lat = -20.5 + Math.random() * 1.5;
    const lng = 55.2 + Math.random() * 0.6;
    const salon = { ...form, id, lat, lng, miseEnAvant: false };
    sset(`salon:${id}`, salon);
    onDone(salon);
  }

  const steps = [
    { label: 'Infos salon' },
    { label: 'Barbiers & Tarifs' },
    { label: 'Forfait' },
  ];

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: 24 }}>
      <button onClick={onBack} className="btn btn-o btn-sm" style={{ marginBottom: 20 }}>← Retour</button>
      <h2 style={{ marginBottom: 20 }}>Inscrire mon salon</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '6px 4px', textAlign: 'center', fontSize: 13, borderBottom: `2px solid ${i <= step ? 'var(--brass)' : 'var(--border)'}`, color: i <= step ? 'var(--brass)' : 'var(--text-muted)' }}>
            {s.label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="fi" placeholder="Nom du salon *" value={form.nom} onChange={e => upd('nom', e.target.value)} />
          <select className="fi" value={form.ville} onChange={e => upd('ville', e.target.value)}>
            <option value="">Ville *</option>
            {VILLES.map(v => <option key={v}>{v}</option>)}
          </select>
          <input className="fi" placeholder="Adresse complète *" value={form.adresse} onChange={e => upd('adresse', e.target.value)} />
          <input className="fi" placeholder="Téléphone" value={form.telephone} onChange={e => upd('telephone', e.target.value)} />
          <input className="fi" placeholder="Horaires (ex : Lun–Sam 9h–19h)" value={form.horaires} onChange={e => upd('horaires', e.target.value)} />
          <input className="fi" placeholder="Lien avis Google (optionnel)" value={form.lienAvisGoogle} onChange={e => upd('lienAvisGoogle', e.target.value)} />
          <textarea className="fi" placeholder="Infos pratiques (parking, etc.)" value={form.infos} onChange={e => upd('infos', e.target.value)} rows={3} />
          <div>
            <label style={{ color: 'var(--text-dim)', fontSize: 14 }}>Nombre de barbiers</label>
            <input className="fi" type="number" min={1} max={10} value={form.nbBarbiers} onChange={e => setNbBarbiers(e.target.value)} style={{ marginTop: 6 }} />
          </div>
          {err && <p style={{ color: '#E06060', fontSize: 14 }}>{err}</p>}
          <button className="btn btn-b" onClick={() => { setErr(''); setStep(1); }}>Suivant →</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {form.barbiers.slice(0, form.nbBarbiers).map((b, i) => (
            <div key={i} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: 16 }}>
              <h4 style={{ marginBottom: 12, color: 'var(--cream-dim)', fontSize: 15 }}>Barbier {i + 1}</h4>
              <input className="fi" placeholder="Prénom du barbier" value={b.nom} onChange={e => updBarb(i, 'nom', e.target.value)} style={{ marginBottom: 12 }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {PRESTATIONS.map(p => (
                  <div key={p}>
                    <label style={{ fontSize: 13, color: 'var(--text-dim)', display: 'block', marginBottom: 3 }}>{p}</label>
                    <div style={{ position: 'relative' }}>
                      <input className="fi" type="number" placeholder="Prix €" min={0} value={b.tarifs[p] || ''} onChange={e => updTarif(i, p, e.target.value)} style={{ paddingRight: 28 }} />
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 13 }}>€</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-o" onClick={() => setStep(0)}>← Retour</button>
            <button className="btn btn-b" onClick={() => setStep(2)}>Suivant →</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ color: 'var(--text-dim)', marginBottom: 8 }}>Choisissez votre formule :</p>
          {Object.values(FORFAITS).map(f => (
            <div key={f.id} onClick={() => upd('forfait', f.id)}
              style={{ padding: 16, border: `2px solid ${form.forfait === f.id ? f.color : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer', background: form.forfait === f.id ? `${f.color}12` : 'transparent', transition: 'all .2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: f.color, fontWeight: 700 }}>{f.nom}</span>
                <span style={{ color: f.color, fontWeight: 700, fontSize: 20 }}>{f.prix} €<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-dim)' }}>/mois</span></span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 6 }}>
                {f.id === 'essentiel' && 'Fiche salon · Réservations IA · Espace gérant'}
                {f.id === 'croissance' && 'Tout Essentiel + Rappels anti no-show · Demande d\'avis'}
                {f.id === 'premium' && 'Tout Croissance + Relance clients inactifs · Envois automatiques'}
              </div>
            </div>
          ))}
          {err && <p style={{ color: '#E06060', fontSize: 14 }}>{err}</p>}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-o" onClick={() => setStep(1)}>← Retour</button>
            <button className="btn btn-b" onClick={submit}>Créer mon salon ✓</button>
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
          <input className="fi" placeholder="🔍 Rechercher un salon…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: '1 1 180px', minWidth: 0 }} />
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
              {c.icon} {c.label}
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
  'linear-gradient(135deg,#2a1508,#4a2010)',
  'linear-gradient(135deg,#0a1a10,#1a3a20)',
  'linear-gradient(135deg,#0a0a1a,#1a1a3a)',
  'linear-gradient(135deg,#1a0a10,#3a1020)',
  'linear-gradient(135deg,#1a1000,#3a2800)',
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
        <span style={{ color: 'rgba(184,134,11,0.25)', userSelect: 'none' }}>{initial}</span>
        {salon.miseEnAvant && (
          <span className="badge-sponsored" style={{ position: 'absolute', top: 10, left: 10 }}>Sponsorisé</span>
        )}
        {hasDispo && (
          <span className="dispo-badge" style={{ position: 'absolute', top: 10, right: 10 }}>Disponible</span>
        )}
      </div>
      {/* Info */}
      <div style={{ padding: '12px 14px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, flex: 1 }}>{salon.nom}</h3>
          {note > 0 && <span style={{ color: '#D4AF37', fontSize: 13, whiteSpace: 'nowrap', marginLeft: 8 }}>★ {note}</span>}
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 8 }}>📍 {salon.ville} · {salon.adresse}</p>
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

  function confirm() {
    const id = 'rdv_' + uid();
    const prix = barbierObj?.tarifs?.[prestation] || 0;
    const rdv = { id, salonId: salon.id, barbier, prestation, prix, date: selectedDate, heure, clientId: client?.id || 'anon', clientNom: client?.nom || 'Client', clientTel: client?.telephone || '', statut: 'en attente', createdAt: new Date().toISOString() };
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
      <p style={{ color: 'var(--text-dim)' }}>{fmtDate(confirmed.date)} à {confirmed.heure} · {confirmed.prix} €</p>
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
              return (
                <button key={d} onClick={() => { setDateIdx(i); setHeure(''); }}
                  style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 8, border: `1px solid ${dateIdx === i ? 'var(--brass)' : 'var(--border)'}`, background: dateIdx === i ? 'var(--brass-pale)' : 'var(--surface2)', color: dateIdx === i ? 'var(--brass)' : 'var(--text-dim)', cursor: 'pointer', textAlign: 'center', minWidth: 58 }}>
                  <div style={{ fontSize: 11, marginBottom: 2 }}>{dayNames[dd.getDay()]}</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{dd.getDate()}</div>
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

        {heure && (
          <button className="btn btn-b" style={{ width: '100%' }} onClick={confirm}>
            Confirmer — {prestation} avec {barbier} le {fmtDate(selectedDate)} à {heure} · {barbierObj?.tarifs[prestation]} €
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
  const [tab, setTab] = useState('barbiers');
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

  const tabs = [{ id: 'reserver', label: '📅 Réserver' }, { id: 'barbiers', label: '✂ Barbiers & Tarifs' }, { id: 'portfolio', label: '📸 Réalisations' }, { id: 'avis', label: `⭐ Avis (${avis.length})` }];

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <button onClick={onBack} className="btn btn-o btn-sm">← Annuaire</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={toggleFav} className={`btn btn-sm ${isFav ? 'btn-r' : 'btn-o'}`}>{isFav ? '♥ Favori' : '♡ Ajouter'}</button>
          <button className="btn btn-b btn-sm" onClick={() => onBook(salon, null)}>📅 Réserver</button>
        </div>
      </div>

      <div className="afu" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <h2 style={{ fontSize: 24 }}>{salon.nom}</h2>
              {salon.miseEnAvant && <span className="badge-sponsored">Sponsorisé</span>}
            </div>
            <p style={{ color: 'var(--text-dim)', marginBottom: 6 }}>📍 {salon.adresse}, {salon.ville}</p>
            {salon.horaires && <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>🕐 {salon.horaires}</p>}
            {salon.telephone && <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>📞 {salon.telephone}</p>}
            {salon.infos && <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>ℹ {salon.infos}</p>}
          </div>
          <div style={{ textAlign: 'center', minWidth: 80 }}>
            {noteGlobale > 0 && <>
              <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--brass)', fontFamily: "'Playfair Display',serif" }}>{noteGlobale}</div>
              <StarRow n={noteGlobale} size={14} />
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{avis.length} avis</div>
            </>}
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'reserver' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <QuickBook salon={salon} preselectedBarbier={null} client={client} onConfirmed={() => {}} />
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            — ou —&nbsp;
            <button className="btn btn-o btn-sm" onClick={() => onBook(salon, null)}>💬 Réserver avec l'assistant IA</button>
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
    return `Bonjour ! Je suis l'assistant IA de **${salon.nom}**.\n\nJe suis là pour vous aider à réserver votre RDV${barb}. Quelle prestation souhaitez-vous ? 💈\n\n${PRESTATIONS.map(p => `• ${p}`).join('\n')}`;
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
            if (barb?.tarifs?.[data.prestation]) rdv.prix = barb.tarifs[data.prestation];
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
            {rdvConfirmed.prix ? ` · ${rdvConfirmed.prix} €` : ''}
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
  const [newAvis, setNewAvis] = useState(null);
  const [avisForm, setAvisForm] = useState({ note: 5, commentaire: '' });

  useEffect(() => {
    const allRdv = getAllByPrefix('rdv:').filter(r => r.clientId === client.id);
    setRdvs(allRdv.sort((a, b) => b.createdAt?.localeCompare(a.createdAt)));
    const favs = getAllByPrefix('salon:').filter(s => (client.favoris || []).includes(s.id));
    setFavSalons(favs);
    const att = getAllByPrefix('attente:').filter(a => a.clientId === client.id);
    setWaiting(att);
  }, [client]);

  function submitAvis() {
    const a = { id: 'avis_' + uid(), salonId: newAvis.salonId, barbier: newAvis.barbier, clientNom: client.nom, note: avisForm.note, commentaire: avisForm.commentaire, date: today() };
    sset(`avis:${a.id}`, a);
    setNewAvis(null);
    setAvisForm({ note: 5, commentaire: '' });
  }

  const tabs = [{ id: 'rdv', label: '📋 Mes RDV' }, { id: 'favoris', label: '♥ Favoris' }, { id: 'attente', label: '⏳ Liste d\'attente' }];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2>Mon compte</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>{client.nom} · {client.telephone}</p>
        </div>
        <button onClick={onBack} className="btn btn-o btn-sm">← Annuaire</button>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      {tab === 'rdv' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {rdvs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun rendez-vous.</p>}
          {rdvs.map((r, i) => (
            <div key={r.id} className="afu card-hover" style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 14, animationDelay: `${i * 0.07}s` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--cream)' }}>{r.prestation} <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>avec {r.barbier}</span></p>
                  <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{fmtDate(r.date)} à {r.heure}{r.prix ? ` · ${r.prix} €` : ''}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{getAllByPrefix('salon:').find(s => s.id === r.salonId)?.nom}</p>
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
                    <button className="btn btn-o btn-sm" onClick={() => setNewAvis(r)}>⭐ Avis</button>
                  )}
                </div>
              </div>
            </div>
          ))}
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
  const canCroissance = ['croissance', 'premium'].includes(forfait);
  const canPremium = forfait === 'premium';

  const allTabs = [
    { id: 'rdv', label: '📋 Agenda' },
    { id: 'tarifs', label: '💰 Tarifs' },
    { id: 'portfolio', label: '📸 Portfolio' },
    { id: 'rappels', label: '⏰ Rappels' + (!canCroissance ? ' 🔒' : '') },
    { id: 'avis', label: '🌟 Demande d\'avis' + (!canCroissance ? ' 🔒' : '') },
    { id: 'relance', label: '🔄 Relance' + (!canPremium ? ' 🔒' : '') },
    { id: 'stats', label: '📊 Stats' },
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
      {tab === 'tarifs' && <TariffTab salon={salon} onUpdate={s => { sset(`salon:${s.id}`, s); setSalon(s); }} />}
      {tab === 'portfolio' && <PortfolioTab salon={salon} onUpdate={s => { sset(`salon:${s.id}`, s); setSalon(s); }} />}
      {tab === 'rappels' && (!canCroissance ? <LockBadge plan="Croissance" /> : <RappelsTab salon={salon} />)}
      {tab === 'avis' && (!canCroissance ? <LockBadge plan="Croissance" /> : <AvisRequestTab salon={salon} />)}
      {tab === 'relance' && (!canPremium ? <LockBadge plan="Premium" /> : <RelanceTab salon={salon} />)}
      {tab === 'stats' && <StatsTab salon={salon} />}
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
    const waitList = getAllByPrefix('attente:').filter(a => a.salonId === rdv.salonId && a.barbier === rdv.barbier && (a.creneauxSouhaites || []).includes(rdv.heure));
    waitList.forEach(a => {
      // In real app: send notification. Here: just mark with flag.
      const client = sget(`client:${a.clientId}`);
      if (client) {
        // Would notify client here
      }
    });
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
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>📞 {r.clientTel}</p>
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

function TariffTab({ salon, onUpdate }) {
  const [barbiers, setBarbiers] = useState(salon.barbiers || []);
  const [saved, setSaved] = useState(false);

  function updTarif(bi, p, v) {
    setBarbiers(prev => {
      const b = prev.map((barb, i) => i !== bi ? barb : { ...barb, tarifs: { ...barb.tarifs, [p]: v === '' ? undefined : Number(v) } });
      return b;
    });
  }

  function save() {
    const updated = { ...salon, barbiers };
    onUpdate(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 17 }}>Tarifs par barbier</h3>
        <button className="btn btn-b btn-sm" onClick={save}>{saved ? '✓ Enregistré' : 'Enregistrer'}</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {barbiers.map((b, bi) => (
          <div key={bi} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
            <h4 style={{ marginBottom: 12, color: 'var(--cream-dim)' }}>{b.nom}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
              {PRESTATIONS.map(p => (
                <div key={p}>
                  <label style={{ fontSize: 13, color: 'var(--text-dim)', display: 'block', marginBottom: 3 }}>{p}</label>
                  <div style={{ position: 'relative' }}>
                    <input className="fi" type="number" min={0} placeholder="0" value={b.tarifs?.[p] || ''} onChange={e => updTarif(bi, p, e.target.value)} style={{ paddingRight: 28 }} />
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
  return (
    <div style={{ marginBottom: 24 }}>
      <h4 style={{ color: 'var(--cream-dim)', marginBottom: 10 }}>{barber.nom}</h4>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input className="fi" placeholder="URL de la photo (avant/après)" value={url} onChange={e => setUrl(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-b btn-sm" onClick={() => { onAddPhoto(url); setUrl(''); }}>Ajouter</button>
      </div>
      {(barber.portfolio || []).length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Aucune photo. Ajoutez des URLs.</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 8 }}>
        {(barber.portfolio || []).map((p, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <img src={p} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
            <button onClick={() => onRemovePhoto(i)} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,.7)', border: 'none', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: 12, cursor: 'pointer' }}>✕</button>
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
        ⚡ <strong style={{ color: 'var(--brass)' }}>Automatisable en Premium</strong> — En formule Premium, les rappels sont envoyés automatiquement la veille via WhatsApp Business.
      </div>
      <h3 style={{ fontSize: 17, marginBottom: 14 }}>RDV de demain — Rappels anti no-show</h3>
      {rdvs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun RDV demain à rappeler.</p>}
      {rdvs.map(r => (
        <div key={r.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{r.clientNom} — {r.heure} · {r.prestation}</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 10 }}>📞 {r.clientTel}</p>
          {!generated[r.id]
            ? <button className="btn btn-o btn-sm" onClick={() => generateMsg(r)} disabled={loading === r.id}>{loading === r.id ? <><Spin /> Génération…</> : '🤖 Générer le message'}</button>
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
      setGenerated(g => ({ ...g, [rdv.id]: `Bonjour ${rdv.clientNom} ! J'espère que votre ${rdv.prestation} vous a plu 😊 Si vous êtes satisfait, un petit avis Google nous ferait vraiment plaisir : ${salon.lienAvisGoogle || '[lien]'}. Merci !` }));
    }
    setLoading(null);
  }

  return (
    <div>
      <div style={{ background: 'var(--brass-pale)', border: '1px solid var(--brass-dim)', borderRadius: 6, padding: 12, marginBottom: 20, fontSize: 14, color: 'var(--text-dim)' }}>
        ⚡ <strong style={{ color: 'var(--brass)' }}>Automatisable en Premium</strong> — En formule Premium, la demande d'avis est envoyée automatiquement après chaque RDV.
      </div>
      <h3 style={{ fontSize: 17, marginBottom: 14 }}>Demande d'avis après RDV</h3>
      {rdvs.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Aucun RDV passé à solliciter.</p>}
      {rdvs.slice(0, 8).map(r => (
        <div key={r.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>{r.clientNom} — {fmtDate(r.date)} · {r.prestation}</p>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 10 }}>📞 {r.clientTel}</p>
          {!generated[r.id]
            ? <button className="btn btn-o btn-sm" onClick={() => generateMsg(r)} disabled={loading === r.id}>{loading === r.id ? <><Spin /> Génération…</> : '🤖 Générer'}</button>
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
      setGenerated(g => ({ ...g, [r.clientId]: `Bonjour ${r.clientNom} ! Ça fait un moment qu'on ne s'est pas vus au ${salon.nom} 😊 Revenez nous voir, on sera ravis de vous retrouver !` }));
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
          <p style={{ color: 'var(--text-dim)', fontSize: 14, marginBottom: 10 }}>📞 {r.clientTel}</p>
          {!generated[r.clientId]
            ? <button className="btn btn-o btn-sm" onClick={() => generateMsg(r)} disabled={loading === r.clientId}>{loading === r.clientId ? <><Spin /> Génération…</> : '🤖 Générer'}</button>
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

function StatsTab({ salon }) {
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
            <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--brass)', fontFamily: "'Playfair Display',serif" }}>{s.val}{s.unit}</div>
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

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h4 style={{ color: 'var(--cream-dim)' }}>Mise en avant</h4>
          {salon.miseEnAvant
            ? <Badge color="var(--brass)">● Actif — Sponsorisé</Badge>
            : <button className="btn btn-b btn-sm" onClick={() => { const upd = { ...salon, miseEnAvant: true }; sset(`salon:${salon.id}`, upd); window.location.reload(); }}>Mettre en avant</button>
          }
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Votre salon apparaît en tête de l'annuaire de {salon.ville}. Visibilité maximale.</p>
      </div>
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
        <button className="btn btn-o" onClick={onRegister}>Inscrire mon salon ✂</button>
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
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--brass)', fontFamily: "'Playfair Display',serif" }}>{s.v}</div>
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
          <ClientRegistration
            onDone={c => { setClient(c); setScreen('directory'); }}
            onBack={() => setScreen('landing')}
          />
        )}

        {screen === 'client-login-search' && (
          <ClientRegistration
            onDone={c => { setClient(c); setScreen('directory'); }}
            onBack={() => setScreen('landing')}
            subtitle={`Recherche : ${searchParams.prestation || 'tous services'}${searchParams.ville ? ' · ' + searchParams.ville : ''}`}
          />
        )}

        {screen === 'salon-login' && (
          <SalonLogin
            onDone={s => { setSalon(s); setScreen('salon-dashboard'); }}
            onRegister={() => setScreen('salon-register')}
            onBack={() => setScreen('landing')}
          />
        )}

        {screen === 'salon-register' && (
          <SalonRegistration
            onDone={s => { setSalon(s); setScreen('salon-dashboard'); }}
            onBack={() => setScreen('salon-login')}
          />
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
