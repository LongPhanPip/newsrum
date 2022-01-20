import {Container, Row, Col,Form, Button} from 'react-bootstrap';
import {useState} from 'react';
import {update_feed, delete_feed} from '../services';

const FeedCard = (props) => {
  const feed = props.feed;

  const [url, setUrl] = useState(feed.url);

  const onChangeUrl = (e) => {
    setUrl(e.target.value)
  }

  const updateUrl = (e) => {
    update_feed(feed.id, url).then(res => setUrl(res.data.url))
  }

  const deleteUrl = (e) => {
    props.onDelete(feed.id)
    delete_feed(feed.id)
  }

  return (
    <Container className="m-2">
      <Form>
        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Group>
              <Form.Control value={url} onChange={onChangeUrl} className="border-0 border-bottom text-primary"></Form.Control>
            </Form.Group>
          </Col>
          <Col md={2} className="text-center">
            <Button variant="outline-primary" onClick={updateUrl}>Chỉnh sửa</Button>
          </Col>
          <Col md={1} className="text-center">
            <Button variant="outline-danger" onClick={deleteUrl}>Xoá</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  )

}

export default FeedCard;
