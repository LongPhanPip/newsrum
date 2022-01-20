import {useState, useEffect} from 'react';
import {Container, Col, Row, Tabs, Tab} from 'react-bootstrap';
import {Link} from 'react-router-dom';

const AdminNavigation = (props) => {
  return(
  <Container>
    <Row className="justify-content-evenly my-4">
      <Col md={2} className="text-center">
      <Link className={`text-decoration-none text-secondary ${props.system ? "active" : null}`} to="/admin/system">Hệ thống</Link>
      </Col>
      <Col md={2} className="text-center">
      <Link className={`text-decoration-none text-secondary ${props.users ? "active" : null}`} to="/admin/users">Người dùng</Link>
      </Col>
      <Col md={2} className="text-center">
      <Link className={`text-decoration-none text-secondary ${props.posts ? "active" : null}`} to="/admin/posts">Bài viết bên ngoài</Link>
      </Col>
      <Col md={2} className="text-center">
      <Link className={`text-decoration-none text-secondary ${props.recommender ? "active" : null}`} to="/admin/recommender">Hệ thống gợi ý</Link>
      </Col>
    </Row>
    <hr className="m-0"/>
  </Container>
  )
}

export default AdminNavigation;
