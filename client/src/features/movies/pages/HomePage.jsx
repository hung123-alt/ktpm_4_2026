import { useState } from 'react';
import {
  Navbar, Nav, Container, Carousel,
  Table, Spinner, Alert, NavDropdown
} from 'react-bootstrap';
import { useQuery } from '@tanstack/react-query';
import axiosClient from '../../../lib/axiosClient';

// ============================================================
// Hàm fetch dữ liệu 
// ============================================================
const fetchMovies = () => axiosClient.get('/movies');

export default function HomePage() {
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Thêm biến 'error' để lấy chi tiết lỗi ra màn hình
  const { data: movies, isLoading, isError, error } = useQuery({
    queryKey: ['movies', 'homepage'],
    queryFn: fetchMovies,
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ===== HEADER (Tràn viền với bg-dark kiểu web phim) ===== */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3">
        <Container fluid className="px-4">
          <Navbar.Brand href="#home" className="fw-bold fs-4 text-primary">
            PHIMPLAY24
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto fs-5">
              <Nav.Link href="#home" className="active">
                <i className="bi bi-house-fill me-1"></i>Trang chủ
              </Nav.Link>
              <Nav.Link href="#movies">
                <i className="bi bi-film me-1"></i>Phim lẻ
              </Nav.Link>
              <NavDropdown title={<><i className="bi bi-grid me-1"></i>Thể loại</>} id="genre-dropdown">
                <NavDropdown.Item href="#action">Hành động</NavDropdown.Item>
                <NavDropdown.Item href="#romance">Tình cảm</NavDropdown.Item>
                <NavDropdown.Item href="#horror">Kinh dị</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav className="fs-5">
              <Nav.Link href="/login" className="btn btn-outline-primary text-white border-0">
                <i className="bi bi-person-circle me-1"></i>Đăng nhập
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ===== BANNER (Tràn viền 100%) ===== */}
      <div style={{ width: '100%' }}>
        <Carousel
          activeIndex={carouselIndex}
          onSelect={(idx) => setCarouselIndex(idx)}
          style={{ maxHeight: '500px', overflow: 'hidden' }}
        >
          <Carousel.Item>
            <div
              style={{
                height: '500px',
                width: '200%',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Carousel.Caption className="pb-5">
                <h2 className="display-4 fw-bold">Chào buổi sáng</h2>
                <p className="lead fs-4">Khám phá phim hay mỗi ngày tại PHIMPLAY24</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div
              style={{
                height: '500px',
                width: '100%',
                background: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Carousel.Caption className="pb-5">
                <h2 className="display-4 fw-bold">Phim Mới Nhất</h2>
                <p className="lead fs-4">Cập nhật hàng ngày, chất lượng cao</p>
              </Carousel.Caption>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>

      {/* ===== CONTENT (Sử dụng Container fluid để rộng ra) ===== */}
      <Container fluid className="my-5 px-4 flex-grow-1">
        <h3 className="mb-4 fw-bold text-uppercase border-bottom pb-2">
          <i className="bi bi-collection-play me-2 text-primary"></i>
          Danh sách phim mới cập nhật
        </h3>

        {/* Đang tải */}
        {isLoading && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
            <p className="mt-3 fs-5 text-muted">Đang lấy dữ liệu phim...</p>
          </div>
        )}

        {/* Lỗi (Sẽ in ra chính xác tên lỗi) */}
        {isError && (
          <Alert variant="danger" className="p-4 fs-5">
            <h4 className="alert-heading"><i className="bi bi-exclamation-triangle-fill me-2"></i> Lỗi tải dữ liệu!</h4>
            <hr />
            <p className="mb-0">
              <strong>Chi tiết lỗi:</strong> {error?.message || JSON.stringify(error)}
            </p>
          </Alert>
        )}

        {/* Bảng dữ liệu */}
        {!isLoading && !isError && (
          <Table striped bordered hover responsive className="shadow-sm align-middle fs-5">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '10%' }} className="text-center"><i className="bi bi-hash"></i> ID</th>
                <th style={{ width: '70%' }}><i className="bi bi-card-text me-1"></i>Tên phim</th>
                <th style={{ width: '20%' }} className="text-center"><i className="bi bi-activity me-1"></i>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {movies && movies.length > 0 ? (
                movies.map((movie) => (
                  <tr key={movie.id}>
                    <td className="text-center fw-bold">{movie.id}</td>
                    <td className="fw-medium">{movie.title}</td>
                    <td className="text-center">
                      <span className={`badge px-3 py-2 ${movie.status === 'ongoing' ? 'bg-success' : 'bg-secondary'}`}>
                        {movie.status === 'ongoing' ? 'Đang chiếu' : movie.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center text-muted py-5">
                    <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                    Chưa có phim nào trong cơ sở dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* ===== FOOTER ===== */}
      <footer className="bg-dark text-white border-top border-secondary py-4 text-center mt-auto">
        <Container fluid>
          <p className="mb-0 fs-6">
            <i className="bi bi-geo-alt-fill me-1 text-danger"></i>
            Hà Nội, {new Date().getFullYear()} &nbsp;|&nbsp; <strong>PHIMPLAY24</strong> — Dự án Nhóm 4
          </p>
        </Container>
      </footer>

    </div>
  );
}