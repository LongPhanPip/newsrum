import {Container, Row, Col} from 'react-bootstrap';

const Footer = () => {
  return (
    <div className="mt-auto">
      <hr />
      <Row className="m-5 h-96 align-items-center">
        <Col md={3}>
          <p className="text-primary">Project 3 - Trang web tổng hợp và chia sẻ tin tức</p>
        </Col>
        <Col md={3} className="text-center">
          Người thực hiện: Phan Đình Hải Long
        </Col>
        <Col md={3} className="text-center">
          Người giảng viên hướng đẫn: Trần Thân Khoát
        </Col>
        <Col>
           Đại học Bách Khoa Hà Nội 2021 - 2022
        </Col>
      </Row>
    </div>
  )
}

export default Footer;
