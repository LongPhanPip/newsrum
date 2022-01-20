import {useState, useEffect} from 'react'
import {Container, Row, Col, Form, Button, Image} from 'react-bootstrap'

import {search_publisher, create_publisher, delete_publisher} from '../services';
import PublisherCard from './publisher_card';

const AdminPublisher = () => {
  const [keyword, setKeyword] = useState('');
  const [publishers, setPublishers] = useState([]);
  const [displayAdd, setDisplayAdd] = useState(false);

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [logo, setLogo] = useState('');

  useEffect(() => {
    search_publisher(keyword).then(res => setPublishers(res.data))
  }, [])

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value)
  }

  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const onChangeUrl = (e) => {
    setUrl(e.target.value)
  }

  const onChangeLogo = (e) => {
    setLogo(e.target.value)
  }

  const onSubmitSearch = (e) => {
    e.preventDefault()
    search_publisher(keyword).then(res => setPublishers(res.data))
  }


  const onSubmitAddPublisher = (e) => {
    e.preventDefault()
    create_publisher(name, url, logo).then(res => {
      if(res.status === 201) {
        setPublishers(old => [res.data, ...old,])
        resetAddForm()
      }
    })
  }

  const onDeletePublisher = (id) => {
    delete_publisher(id).then()
    setPublishers(publishers.filter(publisher => {return publisher.id !== id}))
  }

  const onClickDisplayAdd = (e) => {
    setDisplayAdd(!displayAdd)
  }

  const resetAddForm = () => {
    setName('')
    setUrl('')
    setLogo('')
  }

  const list_publishers = publishers.map(publisher => <PublisherCard key={publisher.id} publisher={publisher} onDelete={onDeletePublisher}/>)

  return (
    <Container>
      <Row className="justify-content-center m-4">
        <Form onSubmit={onSubmitSearch}>
          <Row>
            <Col md={10}>
              <Form.Group>
                <Form.Label>Tìm kiếm trang báo</Form.Label>
                <Form.Control value={keyword} onChange={onChangeKeyword}></Form.Control>
              </Form.Group>
            </Col>
            <Col className="d-flex align-items-end">
              <Button variant="outline-primary" type="submit">Tìm kiếm</Button>
            </Col>
          </Row>
        </Form>
      </Row>
      <hr />
      <Form className={`${displayAdd ? null: 'd-none'}`} onSubmit={onSubmitAddPublisher}>
        <Row>
          <Col md={2} className="d-flex justify-content-center align-items-center">
            <Image src={logo} rounded/>
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
          </Col>
          <Col className="d-flex align-items-center">
            <Button variant="outline-primary" type="submit">Thêm trang báo</Button>
          </Col>
        </Row>
      </Form>
      <Row className="m-2 justify-content-center">
        <a className="text-primary text-decoration-none text-center" onClick={onClickDisplayAdd}>{displayAdd ? "Ẩn hiển thị thêm" : "Hiển thị thêm trang báo"}</a>
      </Row>
      <Row className="justify-content-center">
        {list_publishers}
      </Row>
    </Container>
  )
}

export default AdminPublisher
