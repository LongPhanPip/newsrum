import {Container, Row, Col, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';

import logo from '../../assets/images/newspaper.png';
import {timeToNow} from '../../utils';

const HeadPost = (props) => {
  const post = props.post

  return(
    <div className="h-100">
      <Row className="h-100">
        <Col className="d-flex flex-column">
          <Link to={`/posts/${post.id}`}>
            <Image src={post.image} className={`rounded-top ${props.height_equals ? "h-192" : null}`}/>
          </Link>
          <Row className="my-2">
            <Link to={`/posts/${post.id}`} className="text-decoration-none text-black">
              <h1 className={props.title_font}>{post.title}</h1>
            </Link>
            {props.description ?
              <h2 className="fs-6 text-normal">{post.description}</h2>
            : null}
          </Row>
          <Row className="mt-auto text-truncate">
            <Col className="d-flex align-items-center">
              {post.publisher ?
              <div className="d-flex align-items-center">
                <Image src={post.publisher.logo} className="crop-img-xxs"/>
                <a href={`${post.publisher.url}`} className="text-decoration-none" target="_blank" rel="noopener noreferrer">
                  <span className="m-2">{post.publisher.name}</span>
                </a>
              </div>:
              <div className="d-flex align-items-center">
                <Image src={logo} className="crop-img-xxs"/>
                <Link to='/' className="text-decoration-none">
                  <span className="m-2">Newsrum</span>
                </Link>
              </div>
              }
              <Link to={`gernes/${post.gerne.id}`} className="text-decoration-none text-primary">. {post.gerne.name}</Link>
            </Col>
            <Row>
              <span className="text-secondary m-2">{timeToNow(post.created_at)}</span>
            </Row>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default HeadPost;
