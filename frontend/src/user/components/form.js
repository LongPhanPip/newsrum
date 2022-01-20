import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Col, Row, Form, Button, Image} from 'react-bootstrap';

import {get_post_image} from '../../post';
import {get_gernes} from '../../gerne';
import {create_post} from '../services';


export const PostForm = (props) => {
  const post = props.post;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [gerne, setGerne] = useState('');
  const [markdown, setMarkdown]  = useState('');
  const [gernes, setGernes]  = useState([]);

  useEffect(() => {
    if(post) {
      setTitle(post.post.title)
      setDescription(post.post.description)
      setGerne(post.post.gerne.id)
      setMarkdown(post.markdown)
      const post_img = document.getElementById('post-image')
      post_img.src = get_post_image(post.post.id)

    }
    get_gernes().then(res => setGernes(res.data));

  }, [])

  const onChangeTitle = (e) => {
    setTitle(e.target.value)
  }

  const onChangeDescription = (e) => {
    setDescription(e.target.value)
  }

  const onChangeGerne = (e) => {
    setGerne(e.target.value)
  }

  const onChangeMarkdown = (e) => {
    setMarkdown(e.target.value)
  }

  const onChangeImage = (e) => {
    const post_img = document.getElementById('post-image')
    post_img.src = URL.createObjectURL(e.target.files[0])
    setImage(e.target.files[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(title, description, image, gerne, markdown)
  }

  const list_gerne = gernes.map(gerne => <option key={gerne.id} value={gerne.id}>{gerne.name}</option>)

  return(
    <Container>
      <Row className="justify-content-center">
        <h1 className="fs-2 text-secondary text-center m-4 fw-normal">{props.header}</h1>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="position-relative mb-3">
              <Form.Label className="fs-4 text-secondary">Tiêu đề</Form.Label>
              <Form.Control className="border-secondary p-3 fs-5" type="text" name="title" value={title} onChange={onChangeTitle}/>
            </Form.Group>

            <Form.Group className="position-relative mb-3">
              <Form.Label className="fs-4 text-secondary">Mô tả</Form.Label>
              <Form.Control className="border-secondary p-3 fs-5" as="textarea" name="title" value={description} style={{ height: '150px' }} placeholder="Viết mô tả bài viết ở đây" onChange={onChangeDescription}/>
            </Form.Group>

            <Image id="post-image" className="w-100"/>
            <Form.Group as={Col} className="position-relative mb-3">
                <Form.Label className="fs-4 text-secondary">Ảnh bìa báo</Form.Label>
                <Form.Control type="file" name="file" onChange={onChangeImage}/>
            </Form.Group>

            <Form.Group className="position-relative mb-3">
              <Form.Label className="fs-4 text-secondary">Thể loại</Form.Label>
              <Form.Select onChange={onChangeGerne} value={gerne}>
                <option>Chọn thể loại cho bài viết</option>
                {list_gerne}
              </Form.Select>
            </Form.Group>
            <Form.Group className="position-relative mb-3">
              <Form.Label className="fs-4 text-secondary">Nội dung</Form.Label>
              <Form.Control className="border-secondary p-3 fs-5" as="textarea" name="title" value={markdown} style={{ height: '600px' }} placeholder="Viết markdown ở đây" onChange={onChangeMarkdown}/>
            </Form.Group>
            <Button variant="outline-primary d-block mx-auto btn-width fs-5" type="submit">
              {props.button_text}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
