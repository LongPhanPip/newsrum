import {Container, Row, Col, Image, Button, Form} from 'react-bootstrap';
import {Link, useParams} from 'react-router-dom';
import logo from '../../assets/images/newspaper.png';

import {dateFormat, get_post_image} from '../services';


export const PostHeader = (props) => {
  const post = props.post;
  const content = props.content;

  return(
    <div>
      <Row className="justify-content-center mt-4">
        <Col md={8}>
          <Row>
            <Col className="d-flex align-items-center">
              {post.publisher ?
              <div className="d-flex align-items-center">
                <Image src={post.publisher.logo} className="crop-img-xs"/>
                <a href={`${post.publisher.url}`} className="text-decoration-none text-secondary" target="_blank" rel="noopener noreferrer">
                  <span className="m-2 fs-4">{post.publisher.name}</span>
                </a>
              </div>:
              <div className="d-flex align-items-center">
                <Image src={logo} className="crop-img-xs"/>
                <Link to='/' className="text-decoration-none text-secondary">
                  <span className="m-2 fs-4">Newsrum</span>
                </Link>
              </div>
              }
              <Link className="text-decoration-none fs-4" to={`/gernes/${post.gerne.id}`}><span>. {post.gerne.name}</span></Link>
              <Row className="ms-auto text-secondary flex-column">
                <span>Tạo vào: {dateFormat(post.created_at)}</span>
                {content.updated_at ? <span>Lần cuối cập nhật: {dateFormat(content.updated_at)}</span> : null}
              </Row>
            </Col>
          </Row>
          <Row className="my-4">
            <h1 className="text-secondary fs-2 text-break">{post.title}</h1>
          </Row>
          <Row className="my-4">
            <Image src={post.image}/>
          </Row>
          <Row className="my-4">
            <h4 className="text-break">{post.description}</h4>
          </Row>
        </Col>
      </Row>
    </div>
  )
}
