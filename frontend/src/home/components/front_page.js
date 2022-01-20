import {useState, useEffect} from 'react'
import {Container, Col, Row, Button} from 'react-bootstrap';

import {get_posts, get_hot_posts, PostCard} from '../../post';

import HeadPost from './head_post';

export const FrontPage = (props) => {
  const [frontPosts, setFrontPost] = useState(props.front_posts);
  const [posts, setPosts] = useState(props.posts);
  const [page, setPage] = useState(1);
  const [displayMore, setDisplayMore] = useState(props.more);

  useEffect(() => {
    setPosts(props.posts)
    setFrontPost(props.front_posts)
  }, [props])

  const onClickMore = () => {
    get_posts(page + 1, '', props.gerne).then(res => {
      setPosts(old => [...old, ...res.data.results])
      setDisplayMore(more => {return res.data.next ? true : false})
    })
    setPage(page + 1)
  }


  const row_posts = frontPosts.slice(3, 7).map(post =>
    <Col key={post.id} md={3}>
      <HeadPost post={post} title_font="fs-6" height_equals/>
    </Col>)

  const list_posts = posts.map(post => <PostCard key={post.id} post={post} title_font="fs-5" />)

  return (
    <div>
      <Container>
        <Row className="m-4">
          <Col md={8}>
            <HeadPost post={frontPosts[0]} title_font="fs-3" description/>
          </Col>
          <Col className="border-start">
            <div>
              <HeadPost post={frontPosts[1]} title_font="fs-6"/>
            </div>
            <div className="mt-4">
              <HeadPost post={frontPosts[2]} title_font="fs-6"/>
            </div>
          </Col>
        </Row>
        <hr />
        <Row className="m-4">
          {row_posts}
        </Row>
        <Row className="m-4">
          <Col md={8}>
            {list_posts}
            <div className={`text-center ${displayMore ? null : 'd-none'}`}>
              <a className="text-decoration-none" onClick={onClickMore}>Hiển thị thêm</a>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default FrontPage;
