import {Container, Row, Col} from 'react-bootstrap';

const NotFound = (props) => {
  return (
    <Container fluid="md">
      <Row className="justify-content-md-center">
        <Col lg={4} className="text-center">
          <p className="text-danger fw-normal fs-1">Error 404</p>
          <p className="text-secondary fs-3">Page not found</p>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound;
