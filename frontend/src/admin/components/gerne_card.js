import {useState} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {update_gerne} from '../services';

const GerneCard = (props) => {
  const gerne = props.gerne;
  const [name, setName] = useState(gerne.name);
  const [description, setDescription] = useState(gerne.description);
  const [message, setMessage] = useState("");

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const onClickSave = (e) => {
    e.preventDefault()
    update_gerne(gerne.id, name, description).then(res => {
      if(res.status === 200) {
        setMessage("Lưu thành công")
      }
    })
  }

  const onClickDelete = (e) => {
    props.onDelete(gerne.id)
  }

  return (
    <Form className="m-2" onSubmit={onClickSave}>
      <hr />
      <Row>
        <Col md={8}>
          <Form.Group className="m-2">
            <Form.Label>Tên thể loại</Form.Label>
            <Form.Control value={name} onChange={onChangeName}></Form.Control>
          </Form.Group>
          <Form.Group className="m-2">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control value={description} as="textarea" onChange={onChangeDescription}></Form.Control>
          </Form.Group>
          <Form.Text className="text-primary m-2">{message}</Form.Text>
        </Col>
        <Col md={4} className="d-flex align-items-center justify-content-evenly">
          <Button variant="outline-primary" onClick={onClickSave}>Lưu thay đổi</Button>
          <Button variant="outline-danger" onClick={onClickDelete}>Xoá</Button>
        </Col>
      </Row>
    </Form>
  )
}

export default GerneCard;
