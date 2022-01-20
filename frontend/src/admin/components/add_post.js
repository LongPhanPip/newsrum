import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {get_publishers, get_feeds_by_publisher, get_posts_by_feed} from '../services';

import PostCard from './post_card';

const AdminAddPost = () => {
  const [publisher, setPublisher] = useState("");
  const [publishers, setPublishers] = useState([]);
  const [feed, setFeed] = useState(0);
  const [feeds, setFeeds] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    get_publishers().then(res => setPublishers(res.data));
  }, [])

  const onChangePublisher = (e) => {
    setPublisher(e.target.value);
    get_feeds_by_publisher(e.target.value).then(res => setFeeds(res.data));
  }

  const onChangeFeed = (e) => {
    setFeed(e.target.value)
  }


  const onSubmitFeed = (e) => {
    e.preventDefault()
    get_posts_by_feed(feed).then(res => setPosts(res.data))
  }

  const onDeletePost = (id) => {
    setPosts(posts.filter((post) => {return post.post.id != id;}))
  }


  const list_publishers = publishers.map(publisher => <option key={publisher.id} value={publisher.id}>{publisher.name}</option>)
  const list_feeds = feeds.map(feed => <option key={feed.id} value={feed.id}>{feed.url}</option>)
  const list_posts = posts.map(post => <PostCard key={post.post.id} post={post.post} data={post} onDelete={onDeletePost}/>)

    return(
      <Container>
        <Row className="justify-content-center m-4">
          <Col md={8}>
            <Form>
              <Form.Group>
                <Form.Label>Chọn trang báo</Form.Label>
                <Form.Select value={publisher} onChange={onChangePublisher}>
                  <option>Chọn trang mà bạn muốn thêm bài viết</option>
                  {list_publishers}
                </Form.Select>
              </Form.Group>
            </Form>
            <hr />
           <Form onSubmit={onSubmitFeed}>
              <Row>
                <Col md={9}>
                  <Form.Group>
                    <Form.Label>Chọn trang feed</Form.Label>
                    <Form.Select value={feed} onChange={onChangeFeed}>
                      <option>Chọn trang feed để thực hiện lấy dữ liệu</option>
                      {list_feeds}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="align-self-end text-end">
                  <Button type="submit" variant="outline-primary">Lấy dữ liệu</Button>
                </Col>
                </Row>
            </Form>
          </Col>
        </Row>
        {list_posts}
      </Container>
    )
}

export default AdminAddPost;
