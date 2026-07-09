import { useState, useEffect, useRef } from 'react';
import { useAdminStats, useTopMovies, useRecentUsers } from '../hooks/useAdmin';

/* ─── SVG Icons ─── */
const CardIcons = {
  eye: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  cart: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  box: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  userGroup: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  arrowUp: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  arrowDown: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
    </svg>
  ),
};

/* ─── Animated Number ─── */
function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) return;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setDisplay(end);
        clearInterval(timer);
      } else {
        setDisplay(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span ref={ref}>{display.toLocaleString()}</span>;
}

/* ─── Mini Bar Chart Component ─── */
function MiniBarChart({ data, labels }) {
  const max = Math.max(...data.map((d) => Math.max(d.sales, d.revenue)));
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '180px', padding: '0 4px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', gap: '3px', alignItems: 'flex-end', height: '100%' }}>
            <div
              style={{
                flex: 1,
                height: `${(d.sales / max) * 100}%`,
                background: 'linear-gradient(180deg, #3c50e0, #6577e6)',
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${i * 50}ms`,
                minHeight: '4px',
              }}
            />
            <div
              style={{
                flex: 1,
                height: `${(d.revenue / max) * 100}%`,
                background: 'linear-gradient(180deg, #80caee, #a3d9f3)',
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: `${i * 50}ms`,
                minHeight: '4px',
              }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        {labels.map((l, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>{l}</div>
        ))}
      </div>
    </div>
  );
}

/* ─── Area Chart Component (CSS only) ─── */
function AreaChart({ data1, data2, labels }) {
  const max = Math.max(...data1, ...data2);
  const h = 240;
  const w = 100;

  const toPath = (data) => {
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = 100 - (v / max) * 85;
      return `${x},${y}`;
    });
    return `M${points.join(' L')}`;
  };

  const toArea = (data) => {
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = 100 - (v / max) * 85;
      return `${x},${y}`;
    });
    return `M0,100 L${points.join(' L')} L${w},100 Z`;
  };

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <div style={{ position: 'relative' }}>
      {/* Y-axis labels */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: '30px', width: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        {gridLines.reverse().map((v) => (
          <span key={v} style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right', paddingRight: '8px' }}>{v}</span>
        ))}
      </div>

      <div style={{ marginLeft: '44px' }}>
        <svg viewBox={`0 0 ${w} 105`} style={{ width: '100%', height: `${h}px` }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3c50e0" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3c50e0" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#80caee" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#80caee" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[15, 36.25, 57.5, 78.75, 100].map((y, i) => (
            <line key={i} x1="0" y1={y} x2={w} y2={y} stroke="#e2e8f0" strokeWidth="0.3" strokeDasharray="2,2" />
          ))}

          {/* Area fills */}
          <path d={toArea(data1)} fill="url(#grad1)" />
          <path d={toArea(data2)} fill="url(#grad2)" />

          {/* Lines */}
          <path d={toPath(data1)} fill="none" stroke="#3c50e0" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d={toPath(data2)} fill="none" stroke="#80caee" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {data1.map((v, i) => {
            const x = (i / (data1.length - 1)) * w;
            const y = 100 - (v / max) * 85;
            return <circle key={i} cx={x} cy={y} r="1" fill="#3c50e0" />;
          })}
          {data2.map((v, i) => {
            const x = (i / (data2.length - 1)) * w;
            const y = 100 - (v / max) * 85;
            return <circle key={i} cx={x} cy={y} r="1" fill="#80caee" />;
          })}
        </svg>

        {/* X labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {labels.map((l, i) => (
            <span key={i} style={{ fontSize: '11px', color: '#94a3b8' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════ MAIN DASHBOARD PAGE ═══════════ */
export default function DashboardPage() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: topMovies } = useTopMovies();
  const { data: recentUsers } = useRecentUsers();
  const [activeChartTab, setActiveChartTab] = useState('Month');
  const [hoveredRow, setHoveredRow] = useState(null);

  /* ─── Stat Cards Config ─── */
  const cards = [
    {
      label: 'Tổng số Phim',
      value: stats?.totalMovies || 0,
      trend: 0.43,
      positive: true,
      icon: CardIcons.eye,
      iconBg: 'linear-gradient(135deg, #ede9fe, #e0e7ff)',
      iconColor: '#3c50e0',
    },
    {
      label: 'Doanh thu',
      value: stats?.totalRevenue || 45200,
      trend: 4.35,
      positive: true,
      icon: CardIcons.cart,
      iconBg: 'linear-gradient(135deg, #e0f2fe, #dbeafe)',
      iconColor: '#3c50e0',
      prefix: '$',
      suffix: 'K',
    },
    {
      label: 'Bình luận',
      value: stats?.totalComments || 2450,
      trend: 2.59,
      positive: true,
      icon: CardIcons.box,
      iconBg: 'linear-gradient(135deg, #e0f2fe, #dbeafe)',
      iconColor: '#3c50e0',
    },
    {
      label: 'Thành viên',
      value: stats?.totalUsers || 3456,
      trend: 0.95,
      positive: false,
      icon: CardIcons.userGroup,
      iconBg: 'linear-gradient(135deg, #ede9fe, #e0e7ff)',
      iconColor: '#3c50e0',
    },
  ];

  /* ─── Chart Mock Data ─── */
  const chartMonths = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const revenueData = [25, 30, 20, 35, 22, 55, 45, 65, 50, 60, 58, 75];
  const salesData = [15, 18, 22, 12, 35, 28, 40, 55, 48, 38, 68, 55];

  const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const barData = [
    { sales: 40, revenue: 55 },
    { sales: 65, revenue: 50 },
    { sales: 45, revenue: 70 },
    { sales: 75, revenue: 60 },
    { sales: 50, revenue: 80 },
    { sales: 60, revenue: 45 },
    { sales: 80, revenue: 65 },
  ];

  const chartTabs = ['Day', 'Week', 'Month'];

  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* ═══ Breadcrumb ═══ */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: 700,
          color: '#1e293b',
          margin: '0 0 4px',
        }}>
          eCommerce Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
          Tổng quan hoạt động hệ thống
        </p>
      </div>

      {/* ═══ 1. STAT CARDS ═══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '28px',
      }}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '24px',
                height: '130px',
                animation: 'pulse 1.5s infinite',
              }}>
                <div style={{ width: '60%', height: '14px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }} />
                <div style={{ width: '40%', height: '32px', background: '#e2e8f0', borderRadius: '4px' }} />
              </div>
            ))
          : cards.map((card) => (
              <div
                key={card.label}
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '24px 28px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  border: '1px solid #f1f5f9',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: card.iconBg,
                  color: card.iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}>
                  {card.icon}
                </div>

                {/* Value */}
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#1e293b',
                  margin: '0 0 8px',
                  letterSpacing: '-0.5px',
                }}>
                  {card.prefix || ''}<AnimatedNumber value={card.value} />{card.suffix || ''}
                </h2>

                {/* Label + Trend */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>{card.label}</span>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: card.positive ? '#10b981' : '#ef4444',
                  }}>
                    {card.trend}%
                    {card.positive ? CardIcons.arrowUp : CardIcons.arrowDown}
                  </span>
                </div>
              </div>
            ))
        }
      </div>

      {/* ═══ 2. CHARTS ROW ═══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px',
        marginBottom: '28px',
      }}>
        {/* ── Area Chart ── */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3c50e0', display: 'inline-block' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>Tổng lượt xem</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#80caee', display: 'inline-block' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>Đăng ký mới</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>12.04.2024 - 12.05.2024</p>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              background: '#f8fafc',
              borderRadius: '6px',
              padding: '3px',
              border: '1px solid #e2e8f0',
            }}>
              {chartTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveChartTab(tab)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                    background: activeChartTab === tab ? '#fff' : 'transparent',
                    color: activeChartTab === tab ? '#3c50e0' : '#64748b',
                    boxShadow: activeChartTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <AreaChart data1={revenueData} data2={salesData} labels={chartMonths} />
        </div>

        {/* ── Bar Chart (Profit) ── */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px' }}>
                Lợi nhuận tuần này
              </h3>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3c50e0', display: 'inline-block' }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Sales</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#80caee', display: 'inline-block' }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Revenue</span>
                </div>
              </div>
            </div>
            <select style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '13px',
              color: '#64748b',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit',
            }}>
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>

          <MiniBarChart data={barData} labels={weekDays} />
        </div>
      </div>

      {/* ═══ 3. BOTTOM ROW: Top Movies + Recent Users ═══ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
      }}>
        {/* ── Top Phim ── */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
              Top Phim Hot 🔥
            </h3>
            <select style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '13px',
              color: '#64748b',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit',
            }}>
              <option>Monthly</option>
              <option>Weekly</option>
            </select>
          </div>

          {topMovies?.slice(0, 5).map((m, i) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 8px',
                borderRadius: '8px',
                transition: 'background 0.15s',
                background: hoveredRow === `movie-${i}` ? '#f8fafc' : 'transparent',
                borderBottom: i < 4 ? '1px solid #f1f5f9' : 'none',
                cursor: 'default',
              }}
              onMouseEnter={() => setHoveredRow(`movie-${i}`)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Rank */}
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '13px',
                background: i === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' : i === 2 ? 'linear-gradient(135deg, #cd7f32, #b5651d)' : '#f1f5f9',
                color: i < 3 ? '#fff' : '#64748b',
                flexShrink: 0,
              }}>
                {i + 1}
              </div>

              {/* Title */}
              <span style={{
                flex: 1,
                fontSize: '14px',
                fontWeight: 500,
                color: '#1e293b',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {m.title}
              </span>

              {/* Views */}
              <span style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#3c50e0',
                background: '#eef2ff',
                padding: '4px 10px',
                borderRadius: '6px',
                flexShrink: 0,
              }}>
                {m.viewCount.toLocaleString()} views
              </span>
            </div>
          ))}
        </div>

        {/* ── Recent Users ── */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          border: '1px solid #f1f5f9',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 20px' }}>
            Thành viên mới đăng ký
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['ID', 'Tên đăng nhập', 'Email', 'Trạng thái'].map((h) => (
                  <th key={h} style={{
                    textAlign: 'left',
                    padding: '12px 8px',
                    color: '#64748b',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderBottom: '2px solid #f1f5f9',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers?.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    transition: 'background 0.15s',
                    background: hoveredRow === `user-${i}` ? '#f8fafc' : 'transparent',
                    cursor: 'default',
                  }}
                  onMouseEnter={() => setHoveredRow(`user-${i}`)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td style={{ padding: '14px 8px', fontSize: '14px', color: '#64748b', borderBottom: '1px solid #f8fafc' }}>
                    #{u.id}
                  </td>
                  <td style={{ padding: '14px 8px', borderBottom: '1px solid #f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: `hsl(${(u.id * 67) % 360}, 60%, 85%)`,
                        color: `hsl(${(u.id * 67) % 360}, 60%, 35%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        flexShrink: 0,
                      }}>
                        {u.username?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{u.username}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 8px', fontSize: '14px', color: '#64748b', borderBottom: '1px solid #f8fafc' }}>
                    {u.email}
                  </td>
                  <td style={{ padding: '14px 8px', borderBottom: '1px solid #f8fafc' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: '#ecfdf5',
                      color: '#059669',
                    }}>
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
