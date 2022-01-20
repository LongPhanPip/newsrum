import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {search_gerne, delete_gerne, create_gerne} from '../services';
import GerneCard from './gerne_card';

const AdminGerne = () => {
  const [gernes, setGernes] = useState([])
  const [displayAdd, setDisplayAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    search_gerne("").then(res => setGernes(res.data))
  }, [])


  const onChangeName = (e) => {
    setName(e.target.value)
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value)
  }

  const onDeleteGerne = (id) => {
    delete_gerne(id).then()
    setGernes(gernes.filter(gerne => {return gerne.id !== id}))
  }


  const onClickAddGerne = (e) => {
    e.preventDefault()
    create_gerne(name, description).then(res =>
      setGernes(old => [res.data, ...old])
    )
  }

  const onClickDisplayAdd = (e) => {
    setDisplayAdd(!displayAdd)
  }

  const onSubmitSearch = (e) => {
    e.preventDefault()
    search_gerne(keyword).then(res => setGernes(res.data))
  }


  const list_gernes = gernes.map(gerne => <GerneCard key={gerne.id} gerne={gerne} onDelete={onDeleteGerne}/>)

  return (
    <Container>
      <Row className="justify-content-center m-4">
        <Col md={10}>
          <Form onSubmit={onSubmitSearch}>
            <Form.Group>
              <Form.Label>Tìm kiếm thể loại</Form.Label>
              <Form.Control value={keyword} onChange={onChangeKeyword}></Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col className="d-flex align-items-end">
          <Button variant="outline-primary" type="submit" onClick={onSubmitSearch}>Tìm kiếm</Button>
        </Col>
      </Row>
      <hr />
      <Row className={`justify-content-center m-4 ${displayAdd ? null: 'd-none'}`}>
        <Col md={8}>
          <Form>
            <Form.Group className="m-2">
              <Form.Label>Tên thể loại</Form.Label>
              <Form.Control value={name} onChange={onChangeName}></Form.Control>
            </Form.Group>
            <Form.Group className="m-2">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" value={description} onChange={onChangeDescription}></Form.Control>
            </Form.Group>
          </Form>
        </Col>
        <Col className="d-flex align-items-center justify-content-center">
          <Button variant="outline-primary" onClick={onClickAddGerne}>Thêm thể loại</Button>
        </Col>
      </Row>
      <Row className="m-2 justify-content-center">
        <a className="text-primary text-decoration-none text-center" onClick={onClickDisplayAdd}>{displayAdd ? "Ẩn hiển thị thêm" : "Hiển thị thêm thể loại"}</a>
      </Row>
      <Row className="justify-content-center">
        <Col>
          {list_gernes}
        </Col>
      </Row>
    </Container>
  )
}

export default AdminGerne
