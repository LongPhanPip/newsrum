import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {get_publishers, get_feeds_by_publisher, create_feed} from '../services';
import {get_gernes} from '../../gerne';

import FeedCard from './feed_card';

const AdminPublisherFeed = () => {
  const [publisher, setPublisher] = useState("");
  const [publishers, setPublishers] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [url, setUrl] = useState("");
  const [gerne, setGerne] = useState('');
  const [gernes, setGernes] = useState([]);

  useEffect(() => {
    get_publishers().then(res => setPublishers(res.data));
    get_gernes().then(res => setGernes(res.data));
  }, [])

  const onChangePublisher = (e) => {
    setPublisher(e.target.value);
    get_feeds_by_publisher(e.target.value).then(res => setFeeds(res.data));
  }

  const onChangeUrl = (e) => {
    setUrl(e.target.value);
  }

  const onChangeGerne = (e) => {
    setGerne(e.target.value)
  }

  const onSubmitUrl = (e) => {
    e.preventDefault()
    create_feed(publisher, url, gerne).then(res => {setFeeds(old => [...old, res.data])})
  }

  const onDeleteFeed = (id) => {
    console.log("helllo")
    setFeeds(feeds.filter((feed) => {return feed.id != id;}));
  }

  const list_publishers = publishers.map(publisher => <option key={publisher.id} value={publisher.id}>{publisher.name}</option>)
  const list_gernes = gernes.map(gerne => <option key={gerne.id} value={gerne.id}>{gerne.name}</option>)
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
                <Form.Group className="my-4">
                  <Form.Select value={gerne} onChange={onChangeGerne}>
                    <option value="">Chọn thể loại</option>
                    {list_gernes}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col className="align-self-center text-end">
                <Button variant="outline-primary" type="submit">Thêm url</Button>
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

