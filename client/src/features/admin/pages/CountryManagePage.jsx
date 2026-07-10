import { useState } from 'react';
import { useCountries, useSaveCountry, useDeleteCountry } from '../hooks/useAdminMeta';

export default function CountryManagePage() {
  const { data: countries, isLoading } = useCountries();
  const saveMut = useSaveCountry();
  const delMut = useDeleteCountry();
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    saveMut.mutate(
      { id: editing?.id, payload: { name } },
      {
        onSuccess: () => { setName(''); setEditing(null); },
        onError: (err) => alert(err.response?.data?.message || 'Lỗi Backend: Có thể do thiếu quyền Admin hoặc sai DTO!'),
      }
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa quốc gia này?')) {
      delMut.mutate(id, {
        onError: (err) => alert(err.response?.data?.message || 'Lỗi Backend: Không thể xóa!'),
      });
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={h1Style}>Quản lý Quốc gia</h1>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder={editing ? `Đang sửa: ${editing.name}` : "Nhập tên quốc gia mới..."}
          style={inputStyle} 
          required
        />
        <button type="submit" style={btnSave} disabled={saveMut.isPending}>
          {saveMut.isPending ? 'Đang lưu...' : (editing ? 'Cập nhật' : '+ Thêm')}
        </button>
        {editing && <button type="button" onClick={() => { setEditing(null); setName(''); }} style={btnCancel}>Hủy</button>}
      </form>

      <div style={tableStyle}>
        {isLoading ? <p style={{ padding: 20 }}>Đang tải...</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {countries?.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{c.name}</td>
                  <td style={{ ...tdStyle, color: '#94a3b8', fontSize: 13 }}>{c.slug}</td>
                  <td style={tdStyle}>
                    <button onClick={() => { setEditing(c); setName(c.name); }} style={btnEdit}>Sửa</button>
                    <button onClick={() => handleDelete(c.id)} style={btnDelete}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const h1Style = { fontSize: '26px', fontWeight: 700, color: '#1e293b', margin: '0 0 24px' };
const formStyle = { display: 'flex', gap: '12px', marginBottom: '24px', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #f1f5f9' };
const inputStyle = { flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none', fontSize: 14 };
const tableStyle = { background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden' };
const tdStyle = { padding: '14px 16px', color: '#475569', fontSize: '14px' };
const btnSave = { background: '#3c50e0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' };
const btnCancel = { background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' };
const btnEdit = { background: '#eef2ff', color: '#3c50e0', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontWeight: 600, fontSize: '13px' };
const btnDelete = { background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' };