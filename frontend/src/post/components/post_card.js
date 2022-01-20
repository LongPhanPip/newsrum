import {Container, Row, Col, Image} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {timeToNow} from '../../utils';
import logo from '../../assets/images/newspaper.png';

const PostCard = (props) => {
  const post = props.post

  return (
    <div className="my-4">
      <hr />
      <Row>
        <Col md={4}>
          <Link to={`/posts/${post.id}`}>
            <Image src={post.image} className="rounded-start"/>
          </Link>
        </Col>
        <Col className="d-flex flex-column text-break">
          <Link to={`/posts/${post.id}`} className="text-decoration-none text-black">
            <h1 className={props.title_font}>{post.title}</h1>
          </Link>
          <h2 className="text-normal fs-6">{post.description}</h2>
          <div className="mt-auto d-flex align-items-center">
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
            <Link to={`/gernes${post.gerne.id}`} className="text-decoration-none"> . {post.gerne.name}</Link>
            <span className="text-secondary m-2"> . {timeToNow(post.created_at)}</span>
          </div>
        </Col>
      </Row>
    </div>
  )
}


export default PostCard;
