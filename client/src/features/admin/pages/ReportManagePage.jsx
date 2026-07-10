import { useReports, useUpdateReport } from '../../reports/hooks/useReports';

export default function ReportManagePage() {
  const { data: reports, isLoading } = useReports();
  const updateMut = useUpdateReport();

  const handleUpdate = (id, status) => {
    updateMut.mutate({ id, payload: { status } });
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', margin: '0 0 24px' }}>Quản lý Báo lỗi</h1>
      
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={th}>Phim</th>
              <th style={th}>Người báo</th>
              <th style={th}>Lỗi</th>
              <th style={th}>Mô tả</th>
              <th style={th}>Trạng thái</th>
              <th style={th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: 40 }}>Đang tải...</td></tr>
            ) : reports?.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={td}>{r.movie?.title || 'Đã xóa'} (Tập {r.episodeId || '?'})</td>
                <td style={td}>{r.user?.username || 'Ẩn danh'}</td>
                <td style={td}><span style={badgeErr}>{r.errorType}</span></td>
                <td style={{ ...td, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.description || '-'}</td>
                <td style={td}>
                  <span style={r.status === 'pending' ? badgePending : r.status === 'resolved' ? badgeResolved : badgeIgnored}>
                    {r.status}
                  </span>
                </td>
                <td style={td}>
                  {r.status === 'pending' && (
                    <>
                      <button onClick={() => handleUpdate(r.id, 'resolved')} style={btnGreen}>Xong</button>
                      <button onClick={() => handleUpdate(r.id, 'ignored')} style={btnGray}>Bỏ qua</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th = { textAlign: 'left', padding: '16px', color: '#64748b', fontSize: 13, fontWeight: 600 };
const td = { padding: '16px', color: '#475569', fontSize: 14 };
const badgeErr = { padding: '4px 8px', borderRadius: 6, background: '#fee2e2', color: '#b91c1c', fontSize: 12, fontWeight: 600 };
const badgePending = { padding: '4px 8px', borderRadius: 6, background: '#fef3c7', color: '#d97706', fontSize: 12, fontWeight: 600 };
const badgeResolved = { padding: '4px 8px', borderRadius: 6, background: '#dcfce7', color: '#15803d', fontSize: 12, fontWeight: 600 };
const badgeIgnored = { padding: '4px 8px', borderRadius: 6, background: '#f1f5f9', color: '#64748b', fontSize: 12, fontWeight: 600 };
const btnGreen = { background: '#dcfce7', color: '#059669', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', marginRight: 8, fontWeight: 600, fontSize: 13 };
const btnGray = { background: '#f1f5f9', color: '#64748b', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 13 };