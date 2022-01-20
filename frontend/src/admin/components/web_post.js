import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import {Link, Outlet, useNavigate} from 'react-router-dom';
import AdminNavigation from './navigation';

const AdminWebPost = () => {
  const [activeTarget, setActiveTarget] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const target = document.getElementsByClassName("default")[0]
    target.click()

  }, [])

  const setActive = (url) => (e) => {
    e.preventDefault()
    if (activeTarget != null) {
      activeTarget.classList.remove("active")
    }
    setActiveTarget(e.target)
    e.target.classList.add("active")
    navigate(url)
  }

  return(
    <Container className="h-100">
        <AdminNavigation posts/>
        <Row className="h-100 flex-row">
          <Col md={3} className="d-flex border-end">
            <Row className="align-content-start m-2">
              <a id="add_post" className="m-2 text-decoration-none text-secondary default" onClick={setActive("add")}>Thêm bài viết</a>
              <a id="add_feed" className="m-2 text-decoration-none text-secondary" onClick={setActive("feeds")}>Danh sách feed các trang báo</a>
              <a id="search_post" className="m-2 text-decoration-none text-secondary" onClick={setActive("search")}>Lọc bài viết</a>
            </Row>
          </Col>
          <Col md={9}>
            <Outlet />
          </Col>
        </Row>
    </Container>
  )
}

export default AdminWebPost;
