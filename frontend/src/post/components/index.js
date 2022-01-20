import {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';

import CommentSection from '../../comment';
import {get_post, create_click} from '../services';

import UserPost from './user_post';
import WebPost from './web_post';
import PostCard from './post_card';

const Post = () => {
  const [post, setPost] = useState(null);
  let params = useParams();

  useEffect(() => {
    get_post(params.postId).then(res => setPost(res.data))
    create_click(params.postId)
  }, [])

  return(
    <Container>
      {post ? post.markdown ? <UserPost post={post.post} content={post}/> : <WebPost post={post.post} content={post}/> : null}
      <hr />
      <Row className="justify-content-center">
        <Col md={8}>
          <CommentSection />
        </Col>
      </Row>
    </Container>
  )
}

export default Post;

export {PostCard};
