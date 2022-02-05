import {Container, Row, Col, Button} from 'react-bootstrap';


import {delete_recommender, use_recommender} from '../services';

const RecCard = (props) => {
  const rec = props.rec

  const onClickDelete = () => {
    delete_recommender(rec.id).then(res =>  props.onDelete(rec.id))
  }

  const onClickUse = () => {
    use_recommender(rec.id).then(res => {
      props.onChange(rec.id)
    })
  }

  return (
    <div>
      <hr />
      <Row>
        <Col md={6} className="d-flex flex-column m-2 justify-content-center">
          ID
          <span className="text-primary">{rec.id}</span>
        </Col>
        <Col md={2} className="d-flex flex-column m-2 justify-content-center">
          Mô hình
          <span className="text-secondary">{rec.location}</span>
        </Col>
        <Col md={8} className="d-flex flex-column m-2 justify-content-center overflow-auto">
          Tham số
          <span className="text-secondary">{rec.params}</span>
        </Col>
        <Col md={4} className="d-flex flex-column m-2 justify-content-center overflow-auto">
          Điểm kiểm thử
          <span className="text-danger">{rec.test_hit_7}</span>
        </Col>
        <Col md={4} className="d-flex flex-column m-2 justify-content-center overflow-auto">
          Trạng thái
          <span className={`${rec.in_used ? 'text-primary': 'text-secondary'}`}>{rec.in_used == 1 ? 'Đang chạy' : 'Bảo trì'}</span>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Button variant="outline-primary" onClick={onClickUse}>Sử dụng</Button>
        </Col>
        <Col md={3}>
          <Button variant="outline-danger" onClick={onClickDelete}>Xoá</Button>
        </Col>
      </Row>
    </div>
  )
}

export default RecCard
