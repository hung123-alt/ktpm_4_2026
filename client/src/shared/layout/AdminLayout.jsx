import { useState, useMemo } from "react";
import { NavLink, Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../providers/useAuth";
import { useMovies } from "../../features/movies/hooks/useMovies";
import { useUsers } from "../../features/admin/hooks/useUsers";
import {
  useNotifications,
  useMarkAllAsRead,
} from "../../features/notifications/hooks/useNotifications";
// (Giữ nguyên phần Icons như cũ của bạn)
const Icons = {
  dashboard: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  movie: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  ),
  users: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  // ===== BỔ SUNG: thiếu icon này gây lỗi hiển thị "Quản lý Thể loại" =====
  tags: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41 11 3.83 3.83 11l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  // ===== BỔ SUNG: thiếu icon này gây lỗi hiển thị "Quản lý Quốc gia" =====
  globe: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  search: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  bell: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  chat: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  logout: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  chevron: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  report: (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  ),
  menu: (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const { data: notifications } = useNotifications();
  const markAllReadMut = useMarkAllAsRead();
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  // === LOGIC TÌM KIẾM TOÀN CỤC ===
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const { data: moviesData } = useMovies();
  const { data: usersData } = useUsers();

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return { movies: [], users: [] };
    const term = searchTerm.toLowerCase();
    return {
      movies: (moviesData || [])
        .filter((m) => m.title.toLowerCase().includes(term))
        .slice(0, 5),
      users: (usersData || [])
        .filter(
          (u) =>
            u.username.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term),
        )
        .slice(0, 5),
    };
  }, [searchTerm, moviesData, usersData]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuGroups = [
    {
      title: "MENU",
      items: [
        {
          path: "/admin",
          label: "Dashboard",
          icon: Icons.dashboard,
          end: true,
        },
        { path: "/admin/phim", label: "Quản lý Phim", icon: Icons.movie },
        { path: "/admin/genres", label: "Quản lý Thể loại", icon: Icons.tags },
        {
          path: "/admin/countries",
          label: "Quản lý Quốc gia",
          icon: Icons.globe,
        },
        { path: "/admin/users", label: "Quản lý User", icon: Icons.users },
      ],
    },
    {
      title: "KHÁC",
      items: [
        { path: "/admin/reports", label: "Báo cáo", icon: Icons.report },
        {
          path: "/admin/comments",
          label: "Quản lý Bình luận",
          icon: Icons.chat,
        },
      ],
    },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'); * { margin: 0; padding: 0; box-sizing: border-box; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #1c2434; } ::-webkit-scrollbar-thumb { background: #3c4e6a; border-radius: 3px; }`}</style>

      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "#1a222c",
          color: "#dee4ee",
          fontFamily: "'Inter', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* SIDEBAR (Giữ nguyên như cũ) */}
        <aside
          style={{
            width: sidebarCollapsed ? "80px" : "290px",
            background: "#1c2434",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.3s",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: sidebarCollapsed ? "20px 16px" : "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              minHeight: "70px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #3c50e0, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              P
            </div>
            {!sidebarCollapsed && (
              <div>
                <span
                  style={{ fontSize: "18px", fontWeight: 800, color: "#fff" }}
                >
                  PhimPlay
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#3c50e0",
                  }}
                >
                  24
                </span>
              </div>
            )}
          </div>
          <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
            {menuGroups.map((group) => (
              <div key={group.title} style={{ marginBottom: "24px" }}>
                {!sidebarCollapsed && (
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#8a99af",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                      padding: "0 16px",
                      marginBottom: "8px",
                    }}
                  >
                    {group.title}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      style={({ isActive }) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: sidebarCollapsed ? "12px 16px" : "11px 16px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "#fff" : "#8a99af",
                        background: isActive
                          ? "linear-gradient(135deg, #3c50e0, #5b6fe6)"
                          : "transparent",
                        textDecoration: "none",
                        justifyContent: sidebarCollapsed
                          ? "center"
                          : "flex-start",
                      })}
                    >
                      <span style={{ display: "flex", flexShrink: 0 }}>
                        {item.icon}
                      </span>
                      {!sidebarCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          <div
            style={{
              padding: "16px 12px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "11px 16px",
                background: "transparent",
                color: "#ef4444",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 500,
                justifyContent: sidebarCollapsed ? "center" : "flex-start",
              }}
            >
              {Icons.logout}
              {!sidebarCollapsed && <span>Đăng xuất</span>}
            </button>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* TOPBAR */}
          <header
            style={{
              height: "70px",
              background: "#ffffff",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              flexShrink: 0,
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                {Icons.menu}
              </button>

              {/* ===== THANH TÌM KIẾM TOÀN CỤC ===== */}
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#94a3b8",
                  }}
                >
                  {Icons.search}
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm phim, user..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSearchDropdown(false), 200)
                  }
                  style={{
                    width: "320px",
                    padding: "10px 16px 10px 40px",
                    background: "#f1f5f9",
                    border: "1px solid transparent",
                    borderRadius: "8px",
                    color: "#1e293b",
                    fontSize: "14px",
                    outline: "none",
                    fontFamily: "inherit",
                  }}
                />

                {/* DROPDOWN KẾT QUẢ */}
                {showSearchDropdown && searchTerm.trim() !== "" && (
                  <div
                    style={{
                      position: "absolute",
                      top: "55px",
                      left: 0,
                      width: "100%",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      zIndex: 9999,
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    {searchResults.movies.length === 0 &&
                    searchResults.users.length === 0 ? (
                      <p
                        style={{
                          padding: "20px",
                          textAlign: "center",
                          color: "#64748b",
                          fontSize: "14px",
                        }}
                      >
                        Không tìm thấy kết quả.
                      </p>
                    ) : (
                      <>
                        {searchResults.movies.length > 0 && (
                          <div style={{ padding: "10px 0" }}>
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#94a3b8",
                                padding: "0 16px 8px",
                                textTransform: "uppercase",
                              }}
                            >
                              Phim
                            </p>
                            {searchResults.movies.map((m) => (
                              <div
                                key={m.id}
                                onClick={() => {
                                  navigate("/admin/phim");
                                  setSearchTerm("");
                                }}
                                style={{
                                  padding: "10px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                <img
                                  src={m.posterUrl}
                                  alt={m.title}
                                  style={{
                                    width: "30px",
                                    height: "45px",
                                    borderRadius: "4px",
                                    objectFit: "cover",
                                  }}
                                />
                                <div>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      color: "#1e293b",
                                    }}
                                  >
                                    {m.title}
                                  </p>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "12px",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    {m.releaseYear} • {m.type}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        {searchResults.users.length > 0 && (
                          <div
                            style={{
                              padding: "10px 0",
                              borderTop: "1px solid #f1f5f9",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "#94a3b8",
                                padding: "0 16px 8px",
                                textTransform: "uppercase",
                              }}
                            >
                              Người dùng
                            </p>
                            {searchResults.users.map((u) => (
                              <div
                                key={u.id}
                                onClick={() => {
                                  navigate("/admin/users");
                                  setSearchTerm("");
                                }}
                                style={{
                                  padding: "10px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  cursor: "pointer",
                                }}
                              >
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    background: "#3c50e0",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                  }}
                                >
                                  {u.username[0].toUpperCase()}
                                </div>
                                <div>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "14px",
                                      fontWeight: 600,
                                      color: "#1e293b",
                                    }}
                                  >
                                    {u.username}
                                  </p>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "12px",
                                      color: "#94a3b8",
                                    }}
                                  >
                                    {u.email}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {/* Notification Bell */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowNotiDropdown(!showNotiDropdown)}
                  style={{
                    position: "relative",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "none",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    color: "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {Icons.bell}
                  {unreadCount > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        minWidth: "18px",
                        height: "18px",
                        borderRadius: "9px",
                        background: "#ef4444",
                        color: "#fff",
                        fontSize: "10px",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid #fff",
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Thông báo */}
                {showNotiDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50px",
                      right: 0,
                      width: "350px",
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      zIndex: 9999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        padding: "16px",
                        borderBottom: "1px solid #f1f5f9",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "16px",
                          color: "#1e293b",
                        }}
                      >
                        Thông báo
                      </h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllReadMut.mutate()}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#3c50e0",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Đánh dấu đã đọc
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {notifications?.length === 0 ? (
                        <p
                          style={{
                            padding: "40px 20px",
                            textAlign: "center",
                            color: "#94a3b8",
                            fontSize: "14px",
                          }}
                        >
                          Không có thông báo mới.
                        </p>
                      ) : (
                        notifications?.slice(0, 5).map((noti) => (
                          <div
                            key={noti.id}
                            style={{
                              padding: "12px 16px",
                              borderBottom: "1px solid #f8fafc",
                              background: noti.isRead
                                ? "transparent"
                                : "#f8fafc",
                              cursor: "pointer",
                            }}
                          >
                            <p
                              style={{
                                margin: 0,
                                fontSize: "14px",
                                fontWeight: 600,
                                color: "#1e293b",
                              }}
                            >
                              {noti.title}
                            </p>
                            {noti.content && (
                              <p
                                style={{
                                  margin: "4px 0 0",
                                  fontSize: "13px",
                                  color: "#64748b",
                                }}
                              >
                                {noti.content}
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button
                style={{
                  position: "relative",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "none",
                  border: "1px solid #e2e8f0",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                {Icons.chat}
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "9px",
                    background: "#3c50e0",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                  }}
                >
                  5
                </span>
              </button>
              <div
                style={{
                  width: "1px",
                  height: "32px",
                  background: "#e2e8f0",
                  margin: "0 8px",
                }}
              />
              <Link
                to="/profile"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                  padding: "6px 8px",
                  borderRadius: "8px",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e293b",
                    }}
                  >
                    {user?.username || "Admin"}
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Quản trị viên
                  </p>
                </div>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3c50e0, #8b5cf6)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {user?.username?.[0]?.toUpperCase() || "A"}
                </div>
                <span
                  style={{
                    display: "flex",
                    color: "#94a3b8",
                    transform: showProfileMenu ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform 0.2s",
                  }}
                >
                  {Icons.chevron}
                </span>
              </Link>
            </div>
          </header>

          <main
            style={{
              flex: 1,
              padding: "30px",
              overflowY: "auto",
              background: "#f1f5f9",
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}