import {useState} from 'react';
import {Container, Row, Col, Form, Button, Image} from 'react-bootstrap';

import {delete_post, update_web_post} from '../services';

const WebPostForm = (props) => {
  const post = props.post;
  const data = props.data;
  const gernes = props.gernes;

  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [gerne, setGerne] = useState(post.gerne.id);
  const [createdAt, setCreatedAt] = useState(post.created_at);
  const [status, setStatus] = useState(post.status);

  const [publisher, setPublisher] = useState(data.publisher.id);
  const [url, setUrl] = useState(data.url);
  const [imageUrl, setImageUrl] = useState(data.image_url);
  const [author, setAuthor] = useState(data.author);

  const [displayForm, setDisplayForm] = useState(false);
  const [messages, setMessages] = useState(null);


  const onChangeTitle = (e) => {
    setTitle(e.target.value)
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const onChangeGerne = (e) => {
    setGerne(e.target.value)
  }

  const onChangeAuthor = (e) => {
    setAuthor(e.target.value)
  }

  const onChangeImageUrl = (e) => {
    setImageUrl(e.target.value)
  }

  const onChangeCreatedAt = (e) => {
    setCreatedAt(e.target.value)
  }

  const onChangeDisplayForm = (e) => {
    setDisplayForm(!displayForm)
  }

  const onClickSavePost = (e) => {
    update_web_post(post.id, title, description, createdAt, gerne, url, author, publisher, imageUrl)
    .then(res => {
      if(res.status === 200) {
        setMessages('Lưu thành công')
      }
    })
  }

  const onClickDeletePost = (e) => {
    delete_post(post.id)
    props.onDelete(post.id)

  }

  const list_gernes = gernes.map(gerne => <option key={gerne.id} value={gerne.id}>{gerne.name}</option>)

  return (
    <Container className="border-top p-4">
      <Row >
        <Col md={7}>
        <a target="_blank" rel="noopener noreferrer" href={url} className="primary text-decoration-none d-block text-truncate">{url}</a>
        </Col>
        <Col className="text-center">
            <Button variant="outline-primary" onClick={onClickSavePost}>Lưu bài viết</Button>
          </Col>
         <Col className="text-center">
          <Button variant="outline-danger" onClick={onClickDeletePost}>Xoá bài viết</Button>
        </Col>
      </Row>

      <Form>
        <Row className="align-items-center">
          <Col md={4}>
            <Image src={imageUrl}/>
          </Col>
          <Col md={8}>
            <Form.Group className="m-2">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control value={title} onChange={onChangeTitle}></Form.Control>
            </Form.Group>
            <Form.Group className="m-2">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control value={description} onChange={onChangeDescription} as="textarea"></Form.Control>
            </Form.Group>
            <Row className="m-2">
              <Col className="p-0 me-2">
                <Form.Group>
                  <Form.Label>Thể loại</Form.Label>
                  <Form.Select value={gerne} onChange={onChangeGerne}>
                    <option>Chọn thể loại</option>
                    {list_gernes}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="p-0">
                <Form.Group >
                  <Form.Label>Tên tác giả</Form.Label>
                  <Form.Control value={author} onChange={onChangeAuthor}></Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="m-2">
              <Form.Label>Ảnh bìa</Form.Label>
              <Form.Control value={imageUrl} onChange={onChangeImageUrl}></Form.Control>
            </Form.Group>
             <Form.Group className="m-2">
              <Form.Label>Tạo vào lúc</Form.Label>
              <Form.Control value={createdAt} onChange={onChangeCreatedAt}></Form.Control>
            </Form.Group>
            <div className="m-2 d-flex align-items-center">
              <Image src={post.publisher.logo}  className="crop-img-xs"/>
              <span className="text-secondary m-2">{post.publisher.name}</span>
            </div>
          </Col>
        </Row>
      </Form>
      <Row className="justify-content-center">
        <span className="text-primary text-center">{messages}</span>
      </Row>
    </Container>
  )

}

export default WebPostForm;
