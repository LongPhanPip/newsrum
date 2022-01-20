import {LoginForm} from './form';
import {Container, Row, Col} from 'react-bootstrap';

function Login() {
  return(
    <Container fuild="md" className="my-4">
      <Row className="justify-content-center m-4">
        <h1 className="text-center fs-2 fw-normal text-secondary">Đăng nhập</h1>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <LoginForm />
        </Col>
      </Row>
    </Container>
  )
}

export default Login;
