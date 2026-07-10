import { useState } from 'react';
import { useMovies } from '../../movies/hooks/useMovies';
import { useCreateMovie, useUpdateMovie, useDeleteMovie } from '../hooks/useMovieMutations';
import { useEpisodes } from '../../movies/hooks/useEpisodes';
import { useCreateEpisode, useDeleteEpisode } from '../hooks/useEpisodeMutations';

export default function MovieManagePage() {
  const { data: movies, isLoading } = useMovies();
  const createMut = useCreateMovie();
  const updateMut = useUpdateMovie();
  const deleteMut = useDeleteMovie();

  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  
  // State cho Modal Tập Phim
  const [episodeModalMovie, setEpisodeModalMovie] = useState(null);

  const handleAdd = () => {
    setEditingMovie(null);
    setIsMovieModalOpen(true);
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setIsMovieModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phim này?')) {
      deleteMut.mutate(id);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Quản lý Phim</h1>
        <button onClick={handleAdd} style={btnAdd}>+ Thêm Phim Mới</button>
      </div>

      <div style={tableContainerStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Tiêu đề</th>
              <th style={thStyle}>Loại</th>
              <th style={thStyle}>Năm</th>
              <th style={thStyle}>Lượt xem</th>
              <th style={thStyle}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Đang tải...</td></tr>
            ) : (
              movies?.map(movie => (
                <tr key={movie.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>#{movie.id}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: '#1e293b' }}>{movie.title}</td>
                  <td style={tdStyle}><span style={badgeType(movie.type)}>{movie.type}</span></td>
                  <td style={tdStyle}>{movie.releaseYear}</td>
                  <td style={tdStyle}>{movie.viewCount.toLocaleString()}</td>
                  <td style={tdStyle}>
                    <button onClick={() => setEpisodeModalMovie(movie)} style={btnEpisode}>Tập phim</button>
                    <button onClick={() => handleEdit(movie)} style={btnEdit}>Sửa</button>
                    <button onClick={() => handleDelete(movie.id)} style={btnDelete}>Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isMovieModalOpen && (
        <MovieFormModal 
          movie={editingMovie} 
          onClose={() => setIsMovieModalOpen(false)}
          onSubmit={(payload) => {
            if (editingMovie) {
              updateMut.mutate({ id: editingMovie.id, payload }, {
                onError: (err) => alert(err.response?.data?.message?.join('\n') || 'Lỗi cập nhật')
              });
            } else {
              createMut.mutate(payload, {
                onError: (err) => alert(err.response?.data?.message?.join('\n') || 'Lỗi thêm phim')
              });
            }
            setIsMovieModalOpen(false);
          }}
        />
      )}

      {episodeModalMovie && (
        <EpisodeManageModal 
          movie={episodeModalMovie} 
          onClose={() => setEpisodeModalMovie(null)} 
        />
      )}
    </div>
  );
}

// ============================================================
// MODAL QUẢN LÝ TẬP PHIM
// ============================================================
function EpisodeManageModal({ movie, onClose }) {
  const { data: episodes, isLoading } = useEpisodes(movie.id);
  const createEpMut = useCreateEpisode(movie.id);
  const deleteEpMut = useDeleteEpisode(movie.id);

  const [epData, setEpData] = useState({
    episodeNumber: 1,
    title: '',
    embedUrl: '',
    serverName: 'Server 1'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEpData(prev => ({ ...prev, [name]: value }));
  };

    const handleAddEpisode = (e) => {
    e.preventDefault();
    
    // ✅ LÀM SẠCH DỮ LIỆU TRƯỚC KHI GỬI
    const epNum = parseInt(epData.episodeNumber, 10);
    if (isNaN(epNum) || epNum <= 0) {
      alert("Số tập phải là số nguyên dương!");
      return;
    }
    if (!epData.embedUrl || epData.embedUrl.trim() === '') {
      alert("Vui lòng nhập Link Embed!");
      return;
    }

    const payload = {
      movieId: movie.id,
      episodeNumber: epNum,
      title: epData.title.trim() || `Tập ${epNum}`, // Nếu để trống thì tự động đặt tên
      embedUrl: epData.embedUrl.trim(),
      serverName: epData.serverName.trim() || 'Server 1' // Nếu để trống thì mặc định Server 1
    };

    createEpMut.mutate(payload, {
      onSuccess: () => {
        // Reset form và tự động tăng số tập lên 1
        setEpData({ 
          episodeNumber: epNum + 1, 
          title: '', 
          embedUrl: '', 
          serverName: 'Server 1' 
        });
      },
      onError: (err) => {
        // ✅ BẮT LỖI CHI TIẾT ĐỂ BIẾT CHÍNH XÁC BACKEND BÁO GÌ
        const msg = err.response?.data?.message;
        if (Array.isArray(msg)) {
          alert(msg.join('\n'));
        } else if (msg) {
          alert(msg);
        } else if (err.response?.status === 401) {
          alert('Phiền đăng nhập đã hết hạn. Vui lòng đăng nhập lại tài khoản Admin.');
        } else if (err.response?.status === 403) {
          alert('Bạn không có quyền Admin để thực hiện thao tác này.');
        } else {
          alert('Lỗi kết nối tới máy chủ.');
        }
      }
    });
  };
  const handleDeleteEp = (id) => {
    if (window.confirm('Xóa tập phim này?')) deleteEpMut.mutate(id);
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: '#1e293b', marginTop: 0, marginBottom: '4px' }}>Quản lý Tập Phim</h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px' }}>Phim: <span style={{ fontWeight: 600, color: '#3c50e0' }}>{movie.title}</span></p>

        {/* Form thêm tập */}
        <form onSubmit={handleAddEpisode} style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 120px auto', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Số tập</label>
              <input type="number" name="episodeNumber" value={epData.episodeNumber} onChange={handleChange} style={inputStyle} required min="1" />
            </div>
            <div>
              <label style={labelStyle}>Tiêu đề</label>
              <input type="text" name="title" value={epData.title} onChange={handleChange} style={inputStyle} placeholder={`Tập ${epData.episodeNumber}`} />
            </div>
            <div>
              <label style={labelStyle}>Link Embed (iframe src)</label>
              <input type="text" name="embedUrl" value={epData.embedUrl} onChange={handleChange} style={inputStyle} placeholder="https://..." required />
            </div>
            <div>
              <label style={labelStyle}>Server</label>
              <input type="text" name="serverName" value={epData.serverName} onChange={handleChange} style={inputStyle} />
            </div>
            <button type="submit" style={btnAdd} disabled={createEpMut.isPending}>+</button>
          </div>
        </form>

        {/* Danh sách tập */}
        {isLoading ? <p>Đang tải...</p> : (
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0 }}>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={thStyle}>Tập</th>
                  <th style={thStyle}>Tiêu đề</th>
                  <th style={thStyle}>Link</th>
                  <th style={thStyle}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {episodes?.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Chưa có tập phim nào.</td></tr>
                ) : (
                  episodes?.map(ep => (
                    <tr key={ep.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={tdStyle}>{ep.episodeNumber}</td>
                      <td style={tdStyle}>{ep.title}</td>
                      <td style={{ ...tdStyle, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#3c50e0' }}>{ep.embedUrl}</td>
                      <td style={tdStyle}>
                        <button onClick={() => handleDeleteEp(ep.id)} style={btnDelete}>Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button onClick={onClose} style={btnCancel}>Đóng</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MODAL SỬA PHIM (Giữ nguyên logic cũ)
// ============================================================
function MovieFormModal({ movie, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: movie?.title || '',
    description: movie?.description || '',
    posterUrl: movie?.posterUrl || '',
    bannerUrl: movie?.bannerUrl || '',
    type: movie?.type || 'phim_le',
    status: movie?.status || 'ongoing',
    releaseYear: movie?.releaseYear || 2024,
    totalEpisodes: movie?.totalEpisodes || 0,
    avgRating: movie?.avgRating || 0,
    isFeatured: movie?.isFeatured || false,
    isVisible: movie?.isVisible ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {};
    if (formData.title) payload.title = formData.title;
    if (formData.description) payload.description = formData.description;
    if (formData.posterUrl) payload.posterUrl = formData.posterUrl;
    if (formData.bannerUrl) payload.bannerUrl = formData.bannerUrl;
    if (formData.type) payload.type = formData.type;
    if (formData.status) payload.status = formData.status;
    
    const releaseYear = parseInt(formData.releaseYear, 10);
    if (!isNaN(releaseYear)) payload.releaseYear = releaseYear;
    const totalEpisodes = parseInt(formData.totalEpisodes, 10);
    if (!isNaN(totalEpisodes)) payload.totalEpisodes = totalEpisodes;
    const avgRating = parseFloat(formData.avgRating);
    if (!isNaN(avgRating)) payload.avgRating = avgRating;
    
    payload.isFeatured = !!formData.isFeatured;
    payload.isVisible = formData.isVisible !== undefined ? formData.isVisible : true;
    onSubmit(payload);
  };

  return (
    <div style={modalOverlay} onClick={onClose}>
      <form style={modalContent} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2 style={{ color: '#1e293b', marginTop: 0, marginBottom: '24px' }}>{movie ? 'Sửa Phim' : 'Thêm Phim Mới'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Input label="Tiêu đề" name="title" value={formData.title} onChange={handleChange} required />
          <Input label="Năm phát hành" name="releaseYear" type="number" value={formData.releaseYear} onChange={handleChange} />
          <Input label="Poster URL" name="posterUrl" value={formData.posterUrl} onChange={handleChange} />
          <Input label="Banner URL" name="bannerUrl" value={formData.bannerUrl} onChange={handleChange} />
          <Select label="Loại phim" name="type" value={formData.type} onChange={handleChange}>
            <option value="phim_le">Phim Lẻ</option><option value="phim_bo">Phim Bộ</option><option value="hoat_hinh">Hoạt Hình</option><option value="anime">Anime</option>
          </Select>
          <Select label="Trạng thái" name="status" value={formData.status} onChange={handleChange}>
            <option value="ongoing">Đang chiếu</option><option value="completed">Hoàn tất</option><option value="upcoming">Sắp chiếu</option>
          </Select>
          <Input label="Tổng số tập" name="totalEpisodes" type="number" value={formData.totalEpisodes} onChange={handleChange} />
          <Input label="Đánh giá (0-10)" name="avgRating" type="number" step="0.1" value={formData.avgRating} onChange={handleChange} />
        </div>
        <div style={{ marginTop: '16px' }}>
          <label style={labelStyle}>Mô tả</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" style={{...inputStyle, resize: 'vertical'}} />
        </div>
        <div style={{ marginTop: '16px', display: 'flex', gap: '20px' }}>
          <Checkbox label="Phim Nổi Bật" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
          <Checkbox label="Hiển Thị" name="isVisible" checked={formData.isVisible} onChange={handleChange} />
        </div>
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={onClose} style={btnCancel}>Hủy</button>
          <button type="submit" style={btnSave}>Lưu lại</button>
        </div>
      </form>
    </div>
  );
}

// --- UI Components & Styles ---
function Input({ label, ...props }) {
  return (<div><label style={labelStyle}>{label}</label><input {...props} style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#3c50e0'} onBlur={(e) => e.target.style.borderColor = '#e2e8f0'} /></div>);
}
function Select({ label, children, ...props }) {
  return (<div><label style={labelStyle}>{label}</label><select {...props} style={inputStyle}>{children}</select></div>);
}
function Checkbox({ label, ...props }) {
  return (<label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px', cursor: 'pointer' }}><input type="checkbox" {...props} style={{ width: '16px', height: '16px', accentColor: '#3c50e0' }} />{label}</label>);
}

const thStyle = { textAlign: 'left', padding: '12px 16px', color: '#64748b', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '12px 16px', color: '#475569', fontSize: '14px' };
const tableContainerStyle = { background: '#fff', borderRadius: '12px', border: '1px solid #f1f5f9', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' };
const btnAdd = { background: '#3c50e0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '14px', height: '40px' };
const btnEdit = { background: '#eef2ff', color: '#3c50e0', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontWeight: 600, fontSize: '13px' };
const btnDelete = { background: '#fef2f2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' };
const btnEpisode = { background: '#ecfdf5', color: '#059669', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontWeight: 600, fontSize: '13px' };

const modalOverlay = { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 };
const modalContent = { background: '#fff', padding: '32px', borderRadius: '12px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' };
const labelStyle = { display: 'block', fontSize: '14px', color: '#475569', marginBottom: '6px', fontWeight: 500 };
const inputStyle = { width: '100%', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px', color: '#1e293b', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' };
const btnCancel = { background: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' };
const btnSave = { background: '#3c50e0', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' };

function badgeType(type) {
  const colors = { phim_le: { bg: '#e0f2fe', color: '#0284c7' }, phim_bo: { bg: '#f3e8ff', color: '#7e22ce' }, anime: { bg: '#fef3c7', color: '#b45309' }, hoat_hinh: { bg: '#dcfce7', color: '#15803d' } };
  const c = colors[type] || colors.phim_le;
  return { display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: c.bg, color: c.color };
}