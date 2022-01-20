import {PostHeader} from './header';
import {Container, Row, Col} from 'react-bootstrap';

const WebPost = (props) => {
  const content = props.content;
  const post = props.post;

  return (
    <Container>
      <PostHeader post={post} content={content} />
      <Row className="justify-content-center">
        <Col md={4} className="text-center">
          <a target="_blank" rel="noopener noreferrer" href={content.url} className="text-decoration-none fs-3">Đường dẫn tới bài viết</a>
        </Col>
      </Row>
    </Container>
  )
}

export default WebPost;
