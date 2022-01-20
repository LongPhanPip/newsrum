import {useState, useEffect} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import {Link} from 'react-router-dom';

function UserNavigation(props) {

  const [active, setActive] = useState(() => {
    const url = window.location.href.split("/");
    return url[url.length - 1];
  });

  return(
  <Container>
    <Row className="justify-content-evenly my-4">
      <Col md={2} className="text-center">
        <Link to="/user/account" className={`text-decoration-none text-secondary ${active == "account" ? "active" : null}`} >Thông tin tài khoản</Link>
      </Col>
      <Col md={2} className="text-center">
        <Link to="/user/profile" className={`text-decoration-none text-secondary ${active == "profile" ? "active" : null}`} >Thông tin cá nhân</Link>
      </Col>
      <Col md={2} className="text-center">
        <Link to="/user/posts" className={`text-decoration-none text-secondary ${active == "posts" ? "active" : null}`}>Bài viết của bạn</Link>
      </Col>
    </Row>
    <hr className="m-0"/>
  </Container>
  )
}

export default UserNavigation;
