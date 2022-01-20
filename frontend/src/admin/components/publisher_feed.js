import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {get_publishers, get_feeds_by_publisher, create_feed} from '../services';

import FeedCard from './feed_card';

const AdminPublisherFeed = () => {
  const [publisher, setPublisher] = useState("");
  const [publishers, setPublishers] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    get_publishers().then(res => setPublishers(res.data));
  }, [])

  const onChangePublisher = (e) => {
    setPublisher(e.target.value);
    get_feeds_by_publisher(e.target.value).then(res => setFeeds(res.data));
  }

  const onChangeUrl = (e) => {
    setUrl(e.target.value);

  }

  const onSubmitUrl = (e) => {
    e.preventDefault()
    create_feed(publisher, url).then(res => {setFeeds(old => [...old, res.data])})
  }

  const onDeleteFeed = (id) => {
    console.log("helllo")
    setFeeds(feeds.filter((feed) => {return feed.id != id;}));
  }

  const list_publishers = publishers.map(publisher => <option key={publisher.id} value={publisher.id}>{publisher.name}</option>)
  const list_feeds = feeds.map(feed => <FeedCard key={feed.id} feed={feed} onDelete={onDeleteFeed}/>)

  return (
    <Container>
      <Row className="justify-content-center m-4">
        <Col md={8}>
          <Form>
            <Form.Group>
              <Form.Label>Chọn trang báo</Form.Label>
              <Form.Select value={publisher} onChange={onChangePublisher}>
                <option>Chọn trang mà bạn muốn lấy danh sách</option>
                {list_publishers}
              </Form.Select>
            </Form.Group>
          </Form>
          <hr />
          <Form onSubmit={onSubmitUrl}>
            <Row>
              <Col md={9}>
                <Form.Group>
                  <Form.Label>Thêm trang feed</Form.Label>
                  <Form.Control value={url} onChange={onChangeUrl}>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col className="align-self-end text-end">
                <Button type="submit">Thêm url</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <hr />
      <Row>
        {list_feeds}
      </Row>
    </Container>
  )
}

export default AdminPublisherFeed;

