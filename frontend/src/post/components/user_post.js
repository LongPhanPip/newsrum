import {Container, Row, Col, Image, Button, Form} from 'react-bootstrap';
import {Link, useParams} from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'

import {emojiSupport} from '../services';
import {PostHeader} from './header';

const UserPost = (props) => {
  const content = props.content;
  const post = props.post;

  return (
    <Container>
      <PostHeader post={post} content={content}/>
      <Row className="justify-content-center">
        <Col md={8} className="text-break">
          <Markdown children={emojiSupport(content.markdown)} remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}/>
        </Col>
      </Row>
    </Container>
  )
}

export default UserPost;
