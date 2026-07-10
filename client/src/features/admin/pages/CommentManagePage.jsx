import { useAdminComments, useDeleteComment, useToggleHideComment } from '../hooks/useAdminComments';

export default function CommentManagePage() {
  const { data: comments, isLoading } = useAdminComments();
  const deleteMut = useDeleteComment();
  const toggleHideMut = useToggleHideComment();

  const handleDelete = (id) => {
    if (window.confirm('Xóa bình luận này vĩnh viễn?')) {
      deleteMut.mutate(id);
    }
  };

  const handleToggleHide = (id) => {
    toggleHideMut.mutate(id);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', margin: '0 0 24px' }}>Quản lý Bình luận</h1>
      
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={th}>Người gửi</th>
              <th style={th}>Phim</th>
              <th style={th}>Nội dung</th>
              <th style={th}>Trạng thái</th>
              <th style={th}>Ngày gửi</th>
              <th style={th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>Đang tải...</td></tr>
            ) : comments?.map(cmt => (
              <tr key={cmt.id} style={{ borderBottom: '1px solid #f1f5f9', background: cmt.isHidden ? '#fffbeb' : 'transparent' }}>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${(cmt.userId * 67) % 360}, 60%, 50%)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                      {cmt.user?.username?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{cmt.user?.username || 'Ẩn danh'}</span>
                  </div>
                </td>
                <td style={{ ...td, maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#3c50e0' }}>
                  {cmt.movie?.title || 'Đã xóa'}
                </td>
                <td style={{ ...td, maxWidth: 300, color: '#475569' }}>{cmt.content}</td>
                <td style={td}>
                  <span style={cmt.isHidden ? badgeHidden : badgeVisible}>
                    {cmt.isHidden ? 'Đã ẩn' : 'Đang hiện'}
                  </span>
                </td>
                <td style={{ ...td, color: '#94a3b8', fontSize: 13 }}>{new Date(cmt.createdAt).toLocaleDateString('vi-VN')}</td>
                <td style={td}>
                  <button onClick={() => handleToggleHide(cmt.id)} style={cmt.isHidden ? btnShow : btnHide} disabled={toggleHideMut.isPending}>
                    {cmt.isHidden ? 'Hiện' : 'Ẩn'}
                  </button>
                  <button onClick={() => handleDelete(cmt.id)} style={btnDelete} disabled={deleteMut.isPending}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = { textAlign: 'left', padding: '16px', color: '#64748b', fontSize: '13px', fontWeight: 600 };
const td = { padding: '16px', color: '#475569', fontSize: '14px' };

const badgeVisible = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#dcfce7', color: '#15803d' };
const badgeHidden = { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: '#fef3c7', color: '#d97706' };

const btnHide = { background: '#fef3c7', color: '#d97706', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', marginRight: 8, fontWeight: 600, fontSize: 13 };
const btnShow = { background: '#dcfce7', color: '#059669', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', marginRight: 8, fontWeight: 600, fontSize: 13 };
const btnDelete = { background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 };