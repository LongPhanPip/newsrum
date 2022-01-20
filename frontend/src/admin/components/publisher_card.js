import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, Image} from 'react-bootstrap'

import {update_publisher} from '../services';

const PublisherCard = (props) => {
  const publisher = props.publisher;
  const [name, setName] = useState(publisher.name);
  const [url, setUrl] = useState(publisher.url);
  const [logo, setLogo] = useState(publisher.logo);
  const [message, setMessage] = useState('');

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const onChangeUrl = (e) => {
    setUrl(e.target.value)
  }

  const onChangeLogo = (e) => {
    setLogo(e.target.value)
  }

  const onClickSave = (e) => {
    e.preventDefault()
    update_publisher(publisher.id, name, url, logo).then(res => {
      if(res.status === 200) {
        setMessage('Lưu thành công')
      }
    })
  }

  const onClickDelete = (e) => {
    props.onDelete(publisher.id)
  }

  return (
    <div>
      <hr />
      <Form>
        <Row>
          <Col md={2} className="d-flex justify-content-center align-items-center">
            <Image src={logo} rounded className="w-50"/>
          </Col>
          <Col md={7}>
            <Form.Group className="m-2">
              <Form.Label>Tên trang báo</Form.Label>
              <Form.Control value={name} onChange={onChangeName}></Form.Control>
            </Form.Group>
            <Form.Group className="m-2">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control value={url} onChange={onChangeUrl}></Form.Control>
            </Form.Group>
            <Form.Group className="m-2">
              <Form.Label>Ảnh logo</Form.Label>
              <Form.Control value={logo} onChange={onChangeLogo}></Form.Control>
            </Form.Group>
            {message && <span className="text-primary m-2">{message}</span>}
          </Col>
          <Col className="d-flex justify-content-evenly align-items-center">
            <Button variant="outline-primary" onClick={onClickSave}>Lưu thay đổi</Button>
            <Button variant="outline-danger" onClick={onClickDelete}>Xoá</Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default PublisherCard
