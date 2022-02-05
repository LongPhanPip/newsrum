import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';

import {get_posts, get_recommend_posts, PostCard} from '../../post';
import {get_gerne} from '../../gerne';

import GerneTab from './gerne_tab';
import FrontPage from './front_page';

const Gerne = (props) => {
  let params = useParams();
  const [frontPosts, setFrontPost] = useState([]);
  const [posts, setPosts] = useState([]);
  const [gerne, setGerne] = useState("");

  useEffect(() => {
    get_recommend_posts(params.gerne_id).then(res => setFrontPost(res.data));
    get_posts(1, '', params.gerne_id).then(res => setPosts(res.data.results));
    get_gerne(params.gerne_id).then(res => setGerne(res.data))
  }, [params])

  return (
    <Container>
      <GerneTab />
      <Row className="justify-content-center my-4">
        <Col md={10} className="">
          <h1 className="text-secondary fs-2">{gerne.name}</h1>
        </Col>
      </Row>
      {(posts.length !== 0 & frontPosts.length !== 0) ?
        <FrontPage posts={posts} front_posts={frontPosts} gerne={params.gerne_id}/> : null}
    </Container>
  )
}

export default Gerne;
