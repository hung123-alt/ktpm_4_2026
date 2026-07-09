import Header from './Header';
import Footer from './Footer';

// ============================================================
// MainLayout — bọc Header + Footer cho mọi trang.
// Đã sửa lỗi Light Mode: dùng CSS variables thay vì gán cứng màu.
// ============================================================

export default function MainLayout({ children }) {
  return (
    <div className="pp-app">
      <style>{LAYOUT_STYLES}</style>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

const LAYOUT_STYLES = `
  body { margin: 0; background: var(--color-cinema-900); }

  .pp-app {
    background: var(--color-cinema-900);
    color: #e5e7eb;
    min-height: 100vh;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  /* Light mode cho pp-app */
  html.light .pp-app {
    background: #ffffff;
    color: #1f2937;
  }
  html.light body { background: #ffffff; }

  .pp-app a { text-decoration: none; color: inherit; }

  /* ---------- HEADER ---------- */
  .pp-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    transition: background .3s ease, box-shadow .3s ease;
    background: linear-gradient(180deg, rgba(0,0,0,.75), rgba(0,0,0,0));
  }
  .pp-header.scrolled {
    background: rgba(11,11,15,.96);
    box-shadow: 0 4px 20px rgba(0,0,0,.5);
    backdrop-filter: blur(8px);
  }
  .html.light .pp-header.scrolled {
    background: rgba(255,255,255,.96);
    box-shadow: 0 4px 20px rgba(0,0,0,.1);
  }
  .pp-header-inner {
    display: flex; align-items: center; gap: 24px;
    padding: 14px 40px; max-width: 1600px; margin: 0 auto;
  }
  .pp-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .pp-logo-icon {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, #f59e0b, #f97316);
    display: grid; place-items: center; color: #111; font-size: 22px;
    box-shadow: 0 4px 12px rgba(245,158,11,.4);
  }
  .pp-logo-text { font-size: 22px; font-weight: 800; color: #fff; letter-spacing: .5px; }
  .html.light .pp-logo-text { color: #111; }
  .pp-logo-text span { color: #f59e0b; }

  .pp-search {
    flex: 1; max-width: 460px; display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.12);
    border-radius: 24px; padding: 10px 18px; transition: background .2s;
  }
  .html.light .pp-search {
    background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1);
  }
  .pp-search:focus-within { background: rgba(255,255,255,.16); }
  .pp-search i { color: #9ca3af; font-size: 18px; }
  .pp-search input {
    flex: 1; background: none; border: none; outline: none;
    color: #fff; font-size: 15px;
  }
  .html.light .pp-search input { color: #111; }
  .pp-search input::placeholder { color: #9ca3af; }

  .pp-nav { display: flex; align-items: center; gap: 6px; margin-left: auto; }
  .pp-nav-link {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 8px; color: #e5e7eb;
    font-size: 15px; font-weight: 500; cursor: pointer; white-space: nowrap;
    transition: color .2s, background .2s;
  }
  .html.light .pp-nav-link { color: #374151; }
  .pp-nav-link:hover { color: #f59e0b; }
  .pp-nav-link i.bi-caret-down-fill { font-size: 10px; opacity: .7; }
  .pp-nav-random { color: #22c55e; }
  .pp-nav-random:hover { color: #4ade80; }

  .pp-nav-item { position: relative; }
  .pp-menu {
    position: absolute; top: 100%; left: 0; margin-top: 6px;
    background: #16171d; border: 1px solid #2a2b33; border-radius: 12px;
    padding: 14px; box-shadow: 0 20px 50px rgba(0,0,0,.6);
    opacity: 0; visibility: hidden; transform: translateY(8px);
    transition: all .2s ease; z-index: 1100;
  }
  .html.light .pp-menu {
    background: #ffffff; border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  }
  .pp-has-menu:hover .pp-menu { opacity: 1; visibility: visible; transform: translateY(0); }
  .pp-menu-genres {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px 8px; width: 520px;
  }
  .pp-menu-countries { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px 8px; width: 260px; }
  .pp-menu-user { right: 0; left: auto; min-width: 200px; display: flex; flex-direction: column; }
  .pp-menu-link {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 12px; border-radius: 8px; color: #cbd5e1;
    font-size: 14px; white-space: nowrap;
    background: none; border: none; text-align: left; cursor: pointer; width: 100%;
    transition: background .15s, color .15s;
  }
  .html.light .pp-menu-link { color: #4b5563; }
  .pp-menu-link:hover { background: rgba(245,158,11,.15); color: #f59e0b; }
  .pp-logout:hover { background: rgba(239,68,68,.15); color: #f87171; }

  .pp-btn-member {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 18px; border-radius: 24px; font-weight: 600; font-size: 15px;
    color: #fff; background: rgba(255,255,255,.12);
    border: 1px solid rgba(255,255,255,.18); white-space: nowrap;
    transition: background .2s;
  }
  .html.light .pp-btn-member {
    color: #111; background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1);
  }
  .pp-btn-member:hover { background: rgba(255,255,255,.22); }
  .pp-user-pill {
    display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
    padding: 6px 14px; border-radius: 24px; background: rgba(255,255,255,.12);
    color: #fff; font-weight: 600; font-size: 15px;
  }
  .html.light .pp-user-pill {
    background: rgba(0,0,0,0.05); color: #111;
  }
  .pp-avatar {
    width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center;
    background: linear-gradient(135deg,#f59e0b,#f97316); color: #111; font-weight: 800;
  }

  /* ---------- HERO ---------- */
  .pp-hero { position: relative; height: 88vh; min-height: 560px; overflow: hidden; }
  .pp-hero-bg {
    position: absolute; inset: 0; background-size: cover; background-position: center 20%;
    animation: ppFade .8s ease;
  }
  @keyframes ppFade { from { opacity: .3; } to { opacity: 1; } }
  .pp-hero-shade {
    position: absolute; inset: 0;
    background:
      linear-gradient(90deg, rgba(11,11,15,.95) 0%, rgba(11,11,15,.6) 45%, rgba(11,11,15,.1) 100%),
      linear-gradient(0deg, #0b0b0f 2%, rgba(11,11,15,0) 40%);
  }
  .pp-hero-inner {
    position: relative; z-index: 2; max-width: 1600px; margin: 0 auto;
    height: 100%; padding: 0 40px; display: flex; flex-direction: column;
    justify-content: center; max-width: 720px;
  }
  .pp-hero-title {
    font-size: 56px; font-weight: 900; color: #fff; margin: 0 0 18px;
    line-height: 1.05; text-shadow: 0 4px 20px rgba(0,0,0,.6);
  }
  .pp-hero-meta {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    color: #d1d5db; font-size: 15px; margin-bottom: 16px;
  }
  .pp-dot-sep { opacity: .5; }
  .pp-top10 {
    background: #22c55e; color: #05270f; font-weight: 800; font-size: 12px;
    padding: 3px 8px; border-radius: 5px; letter-spacing: .5px;
  }
  .pp-hero-chips { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
  .pp-chip {
    border: 1px solid rgba(255,255,255,.25); color: #e5e7eb;
    padding: 5px 14px; border-radius: 18px; font-size: 13px;
    background: rgba(255,255,255,.06);
  }
  .pp-hero-desc {
    color: #cbd5e1; font-size: 16px; line-height: 1.6; margin-bottom: 26px;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .pp-hero-actions { display: flex; align-items: center; gap: 16px; }
  .pp-btn-play {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg,#16a34a,#22c55e); color: #fff;
    font-weight: 700; font-size: 17px; padding: 13px 30px; border-radius: 30px;
    box-shadow: 0 8px 24px rgba(34,197,94,.4); transition: transform .15s, box-shadow .2s;
  }
  .pp-btn-play:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(34,197,94,.5); }
  .pp-btn-play i { font-size: 22px; }
  .pp-btn-mute {
    width: 48px; height: 48px; border-radius: 50%; cursor: pointer;
    background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.3);
    color: #fff; font-size: 20px; transition: background .2s;
  }
  .pp-btn-mute:hover { background: rgba(255,255,255,.25); }
  .pp-hero-dots {
    position: absolute; right: 40px; bottom: 40px; z-index: 3; display: flex; gap: 8px;
  }
  .pp-dot {
    width: 9px; height: 9px; border-radius: 50%; border: none; cursor: pointer;
    background: rgba(255,255,255,.4); transition: all .3s;
  }
  .pp-dot.active { width: 26px; border-radius: 6px; background: #22c55e; }

  /* ---------- ROWS ---------- */
  .pp-main { max-width: 1600px; margin: 0 auto; padding: 10px 40px 40px; }
  .pp-row { margin-top: 38px; }
  .pp-row-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .pp-row-title { font-size: 24px; font-weight: 800; color: #fff; margin: 0; }
  .html.light .pp-row-title { color: #111; }
  .pp-row-title i { color: #f59e0b; margin-right: 6px; }
  .pp-row-more { color: #9ca3af; font-size: 14px; display: inline-flex; align-items: center; gap: 4px; }
  .pp-row-more:hover { color: #f59e0b; }

  .pp-row-wrap { position: relative; }
  .pp-row-scroller {
    display: flex; gap: 16px; overflow-x: auto; scroll-behavior: smooth;
    padding: 4px; scrollbar-width: none; -ms-overflow-style: none;
  }
  .pp-row-scroller::-webkit-scrollbar { display: none; }
  .pp-row-arrow {
    position: absolute; top: 50%; transform: translateY(-60%);
    width: 44px; height: 44px; border-radius: 50%; z-index: 5; cursor: pointer;
    background: rgba(0,0,0,.65); border: 1px solid rgba(255,255,255,.2); color: #fff;
    font-size: 20px; display: grid; place-items: center;
    opacity: 0; transition: opacity .2s, background .2s;
  }
  .pp-row-wrap:hover .pp-row-arrow { opacity: 1; }
  .pp-row-arrow:hover { background: #f59e0b; color: #111; }
  .pp-row-arrow.pp-left { left: -14px; }
  .pp-row-arrow.pp-right { right: -14px; }

  /* ---------- CARD ---------- */
  .pp-card { flex: 0 0 auto; width: 180px; }
  .pp-card-thumb {
    position: relative; width: 100%; aspect-ratio: 2/3; border-radius: 10px;
    overflow: hidden; background: #1a1a22; box-shadow: 0 6px 16px rgba(0,0,0,.4);
    transition: transform .2s, box-shadow .2s;
  }
  .pp-card:hover .pp-card-thumb { transform: translateY(-6px); box-shadow: 0 14px 30px rgba(0,0,0,.6); }
  .pp-card-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .pp-badge-imdb {
    position: absolute; top: 8px; left: 8px; z-index: 2;
    background: #f5c518; color: #000; font-weight: 800; font-size: 11px;
    padding: 2px 6px; border-radius: 4px;
  }
  .pp-badge-vip {
    position: absolute; top: 8px; right: 8px; z-index: 2;
    background: #000; color: #f5c518; font-weight: 800; font-size: 11px;
    padding: 2px 7px; border-radius: 4px; border: 1px solid #f5c518;
  }
  .pp-badge-type {
    position: absolute; bottom: 8px; left: 8px; z-index: 2;
    background: rgba(22,163,74,.9); color: #fff; font-weight: 600; font-size: 11px;
    padding: 2px 8px; border-radius: 4px;
  }
  .pp-card-overlay {
    position: absolute; inset: 0; display: grid; place-items: center;
    background: rgba(0,0,0,.45); opacity: 0; transition: opacity .2s;
    color: #fff; font-size: 46px;
  }
  .pp-card:hover .pp-card-overlay { opacity: 1; }
  .pp-card-title {
    margin-top: 10px; color: #f3f4f6; font-size: 15px; font-weight: 600;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .html.light .pp-card-title { color: #111; }
  .pp-card-sub {
    color: #9ca3af; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .pp-card:hover .pp-card-title { color: #f59e0b; }

  /* ---------- STATES ---------- */
  .pp-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 14px; color: #9ca3af; padding: 120px 20px; text-align: center;
  }
  .pp-state.pp-error { color: #f87171; }
  .pp-state i { font-size: 42px; }
  .pp-spinner {
    width: 46px; height: 46px; border-radius: 50%;
    border: 4px solid rgba(245,158,11,.25); border-top-color: #f59e0b;
    animation: ppSpin 1s linear infinite;
  }
  @keyframes ppSpin { to { transform: rotate(360deg); } }

  /* ---------- FOOTER ---------- */
  .pp-footer { background: #08080b; border-top: 1px solid #1f2028; margin-top: 30px; }
  .html.light .pp-footer { background: #f8f9fa; border-top: 1px solid #e5e7eb; }
  .pp-footer-inner {
    max-width: 1600px; margin: 0 auto; padding: 44px 40px 24px;
    display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 30px;
  }
  .pp-footer-col h4 { color: #fff; font-size: 15px; margin: 0 0 14px; font-weight: 700; }
  .html.light .pp-footer-col h4 { color: #111; }
  .pp-footer-col a, .pp-footer-desc { display: block; color: #9ca3af; font-size: 14px; margin-bottom: 9px; }
  .pp-footer-col a:hover { color: #f59e0b; }
  .pp-footer-brand .pp-logo { margin-bottom: 14px; }
  .pp-socials { display: flex; gap: 12px; margin-top: 6px; }
  .pp-socials a {
    width: 38px; height: 38px; border-radius: 50%; display: grid; place-items: center;
    background: #16171d; color: #cbd5e1; font-size: 18px; transition: all .2s;
  }
  .html.light .pp-socials a { background: #e5e7eb; color: #4b5563; }
  .pp-socials a:hover { background: #f59e0b; color: #111; }
  .pp-footer-bottom {
    text-align: center; color: #6b7280; font-size: 13px;
    padding: 18px 20px; border-top: 1px solid #1f2028;
  }
  .html.light .pp-footer-bottom { border-top: 1px solid #e5e7eb; }

  /* ---------- RESPONSIVE ---------- */
  @media (max-width: 1024px) {
    .pp-header-inner { flex-wrap: wrap; padding: 12px 20px; gap: 12px; }
    .pp-search { order: 3; max-width: none; flex-basis: 100%; }
    .pp-nav { gap: 2px; }
    .pp-menu-genres { grid-template-columns: repeat(2, 1fr); width: 300px; }
    .pp-hero-title { font-size: 38px; }
    .pp-main, .pp-footer-inner { padding-left: 20px; padding-right: 20px; }
    .pp-footer-inner { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 640px) {
    .pp-nav { display: none; }
    .pp-card { width: 140px; }
    .pp-hero-title { font-size: 30px; }
    .pp-footer-inner { grid-template-columns: 1fr; }
  }
`;