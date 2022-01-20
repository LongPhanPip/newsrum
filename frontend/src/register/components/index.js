import {Container, Row, Col} from 'react-bootstrap';

import {RegisterForm} from './form';


const Register = () => {
  return(
    <Container fuild="md" className="my-4">
      <Row className="justify-content-center m-4">
        <h1 className="text-center fs-2 fw-normal text-secondary">Đăng ký</h1>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <RegisterForm />
        </Col>
      </Row>
    </Container>
  )
}

export default Register;
