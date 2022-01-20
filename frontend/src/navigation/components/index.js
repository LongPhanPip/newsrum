import {useState, useEffect} from 'react';

import {Dropdown, Container, Row, Col, Image, Button, Form} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';

import {withAuthorization, logout} from '../../auth';
import logo from '../../assets/images/newspaper.png';

import {DropdownForUser, DropdownForAdmin} from './dropdowns';

function NavigationWithoutAuth () {
  const navigate = useNavigate();
  const login = () => {
    navigate('/login');
  }

  const register = () => {
    navigate('/register');
  }

  return (
    <div>
      <Button variant="outline-secondary btn-block btn-width m-2" onClick={login}>Đăng nhập</Button>
      <Button variant="outline-secondary btn-block btn-width" onClick={register}>Đăng ký</Button>
    </div>
  )
}

function NavigationWithAuth (props) {
  const [user, setUser] = useState(props.user);
  return (
    <div>
      {user.is_admin ? <DropdownForAdmin user={user}/> :
      <DropdownForUser user={user} />}
    </div>
  )
}

function Navigation (props) {
  const [user, setUser] = useState(props.user);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const onSubmitSearch = (e) => {
    e.preventDefault()
    navigate(`/search?keyword=${keyword}`)
  }

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value)
  }

  return(
      <Container fluid="md" className="my-3">
        <Row className="justify-content-center">
          <Col md={3} className="d-flex justify-content-center align-items-center">
            <Link className="text-decoration-none" to="/"><Image src={logo} className="crop-img-md"></Image>
              <span className="fs-5 text-secondary m-2">Newsrum</span></Link>
          </Col>
          <Col md={6} className="d-flex justify-content-center align-items-center">
            <Form className="w-100" onSubmit={onSubmitSearch}>
              <Form.Group>
                <Form.Control placeholder="Tìm kiếm" className="px-4" onChange={onChangeKeyword} value={keyword}></Form.Control>
              </Form.Group>
            </Form>
          </Col>
          <Col md={3} className="d-flex justify-content-center align-items-center">
            {props.user ? <NavigationWithAuth user={props.user}/> : <NavigationWithoutAuth />}
          </Col>
        </Row>
      </Container>

  );
}


export default withAuthorization(Navigation);
