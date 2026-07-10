import { useUsers, useToggleBanUser, useDeleteUser } from '../hooks/useUsers';

export default function UserManagePage() {
  const { data: users, isLoading } = useUsers();
  const toggleBanMut = useToggleBanUser();
  const deleteMut = useDeleteUser();

  const handleToggleBan = (id) => {
    if (window.confirm('Bạn có muốn thay đổi trạng thái khóa/mở khóa tài khoản này?')) {
      toggleBanMut.mutate(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('CẢNH BÁO: Xóa user sẽ xóa toàn bộ bình luận, lịch sử của họ. Bạn chắc chắn?')) {
      deleteMut.mutate(id, {
        onError: (err) => alert(err.response?.data?.message || 'Không thể xóa tài khoản Admin!')
      });
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Quản lý Thành viên</h1>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>Tổng số tài khoản: {users?.length || 0}</p>
      </div>

      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Thành viên</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Vai trò</th>
              <th style={thStyle}>Trạng thái</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải...</td></tr>
            ) : (
              users?.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>#{u.id}</td>
                  
                  {/* User Info */}
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', 
                        background: `hsl(${(u.id * 67) % 360}, 60%, 85%)`, 
                        color: `hsl(${(u.id * 67) % 360}, 60%, 35%)`, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                      }}>
                        {u.username?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>{u.username}</span>
                    </div>
                  </td>

                  <td style={{ ...tdStyle, color: '#64748b' }}>{u.email}</td>

                  {/* Role Badge */}
                  <td style={tdStyle}>
                    <span style={u.role === 'admin' ? badgeAdmin : badgeUser}>
                      {u.role === 'admin' ? 'Admin' : 'Thành viên'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td style={tdStyle}>
                    <span style={u.isBanned ? badgeBanned : badgeActive}>
                      {u.isBanned ? 'Bị khóa' : 'Hoạt động'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={tdStyle}>
                    {u.role !== 'admin' && (
                      <>
                        <button 
                          onClick={() => handleToggleBan(u.id)} 
                          style={u.isBanned ? btnUnban : btnBan}
                          disabled={toggleBanMut.isPending}
                        >
                          {u.isBanned ? 'Mở khóa' : 'Khóa'}
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)} 
                          style={btnDelete}
                          disabled={deleteMut.isPending}
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- UI Styles ---
const tableContainerStyle = { background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };
const thStyle = { textAlign: 'left', padding: '16px', color: '#64748b', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '16px', color: '#475569', fontSize: '14px' };

const badgeAdmin = { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#f3e8ff', color: '#7e22ce' };
const badgeUser = { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#e0f2fe', color: '#0284c7' };
const badgeActive = { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#dcfce7', color: '#15803d' };
const badgeBanned = { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#fee2e2', color: '#b91c1c' };

const btnBan = { background: '#fef3c7', color: '#d97706', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontWeight: 600, fontSize: '13px' };
const btnUnban = { background: '#dcfce7', color: '#059669', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontWeight: 600, fontSize: '13px' };
const btnDelete = { background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' };