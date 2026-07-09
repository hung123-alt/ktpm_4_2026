import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/useAuth';

/* ─── SVG Icon Components ─── */
const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  movie: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  bell: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  chevron: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  report: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuGroups = [
    {
      title: 'MENU',
      items: [
        { path: '/admin', label: 'Dashboard', icon: Icons.dashboard, end: true },
        { path: '/admin/phim', label: 'Quản lý Phim', icon: Icons.movie },
        { path: '/admin/users', label: 'Quản lý User', icon: Icons.users },
      ],
    },
    {
      title: 'KHÁC',
      items: [
        { path: '/admin/reports', label: 'Báo cáo', icon: Icons.report },
        { path: '/admin/settings', label: 'Cài đặt', icon: Icons.settings },
      ],
    },
  ];

  return (
    <>
      {/* Global font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #1c2434; }
        ::-webkit-scrollbar-thumb { background: #3c4e6a; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #4a6085; }
      `}</style>

      <div style={{
        display: 'flex',
        height: '100vh',
        background: '#1a222c',
        color: '#dee4ee',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: 'hidden',
      }}>

        {/* ───────── SIDEBAR ───────── */}
        <aside style={{
          width: sidebarCollapsed ? '80px' : '290px',
          background: '#1c2434',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          zIndex: 50,
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{
            padding: sidebarCollapsed ? '20px 16px' : '20px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minHeight: '70px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3c50e0, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '16px',
              color: '#fff',
              flexShrink: 0,
            }}>
              P
            </div>
            {!sidebarCollapsed && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
                  PhimPlay
                </span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#3c50e0' }}>24</span>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{
            flex: 1,
            padding: '16px 12px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}>
            {menuGroups.map((group) => (
              <div key={group.title} style={{ marginBottom: '24px' }}>
                {!sidebarCollapsed && (
                  <p style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#8a99af',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px',
                    padding: '0 16px',
                    marginBottom: '8px',
                  }}>
                    {group.title}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onMouseEnter={() => setHoveredItem(item.path)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: sidebarCollapsed ? '12px 16px' : '11px 16px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#fff' : '#8a99af',
                        background: isActive
                          ? 'linear-gradient(135deg, #3c50e0, #5b6fe6)'
                          : hoveredItem === item.path
                            ? 'rgba(255,255,255,0.04)'
                            : 'transparent',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                        position: 'relative',
                      })}
                    >
                      <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Sidebar Footer – Logout */}
          <div style={{
            padding: '16px 12px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <button
              onClick={handleLogout}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '11px 16px',
                background: 'transparent',
                color: '#ef4444',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.15s ease',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                fontFamily: 'inherit',
              }}
            >
              {Icons.logout}
              {!sidebarCollapsed && <span>Đăng xuất</span>}
            </button>
          </div>
        </aside>

        {/* ───────── MAIN AREA ───────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ── TOPBAR ── */}
          <header style={{
            height: '70px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            flexShrink: 0,
          }}>
            {/* Left: hamburger + search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  padding: '4px',
                }}
              >
                {Icons.menu}
              </button>

              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  display: 'flex',
                }}>
                  {Icons.search}
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  style={{
                    width: '320px',
                    padding: '10px 16px 10px 40px',
                    background: '#f1f5f9',
                    border: '1px solid transparent',
                    borderRadius: '8px',
                    color: '#1e293b',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3c50e0';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'transparent';
                    e.target.style.background = '#f1f5f9';
                  }}
                />
              </div>
            </div>

            {/* Right: actions + user */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Notification */}
              <button
                style={{
                  position: 'relative',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                {Icons.bell}
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  border: '2px solid #fff',
                }} />
              </button>

              {/* Chat */}
              <button
                style={{
                  position: 'relative',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'none',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
              >
                {Icons.chat}
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  background: '#3c50e0',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: '2px solid #fff',
                }}>
                  5
                </span>
              </button>

              {/* Separator */}
              <div style={{ width: '1px', height: '32px', background: '#e2e8f0', margin: '0 8px' }} />

              {/* User Profile */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', lineHeight: 1.3 }}>
                    {user?.username || 'Admin'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.3 }}>
                    Quản trị viên
                  </p>
                </div>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3c50e0, #8b5cf6)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                }}>
                  {user?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <span style={{
                  display: 'flex',
                  color: '#94a3b8',
                  transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}>
                  {Icons.chevron}
                </span>
              </div>
            </div>
          </header>

          {/* ── CONTENT ── */}
          <main style={{
            flex: 1,
            padding: '30px',
            overflowY: 'auto',
            background: '#f1f5f9',
          }}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
