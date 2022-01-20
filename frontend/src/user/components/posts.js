import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Image, Button} from 'react-bootstrap';

import {get_post_image} from '../../post';

import {get_post_status, date_format} from '../services';
import {get_posts, delete_post} from '../services';

import UserNavigation from './navigation';

const PostBox = (props) => {
  const post = props.data.post;
  const data = props.data;

  const handleDelete = (e) => {
    e.preventDefault();
    props.onDeletePost(post.id);
    delete_post(post.id);
  }

  return(
    <Container className='border border-secondary py-4 my-4 rounded'>
      <Row>
        <Col md={4}>
          <Link to={`/posts/${post.id}`}>
            <Image src={post.image} className="w-100"/>
          </Link>
        </Col>
        <Col md={5} className="d-flex flex-column">
          <Row>
            <h1 className="fs-2 text-secondary text-break">
                {post.title}
            </h1>
          </Row>
          <Row>
            <p className="text-break">{post.description}</p>
          </Row>
          <Row className="mt-auto">
            <Row>
              <Col md={6}>
                <Link className="text-decoration-none" to={`/gernes/${post.gerne.id}`}>Thể loại: <span>{post.gerne.name}</span></Link>
              </Col>
              <Col>
                <p className="text-secondary m-0">Trạng thái: <span className={post.status == 'P' ? 'text-danger': 'text-primary'}>{get_post_status(post.status)}</span></p>
              </Col>
            </Row>
            <p className="text-secondary m-0">Tạo vào lúc: <span className="text-secondary">{date_format(post.created_at)}</span></p>
            <p className="text-secondary m-0">Lần cuối cập nhật: <span className="text-primary">{date_format(data.updated_at)}</span></p>
          </Row>
        </Col>
        <Col md={3} className="d-flex justify-content-around align-items-center">
          <a className="btn btn-outline-primary btn-width" href={`posts/${post.id}/edit`}>Chỉnh sửa</a>
          <Button onClick={handleDelete} variant="outline-danger btn-width">Xoá</Button>
        </Col>
      </Row>
    </Container>
  )
}

const UserPosts = (props) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    get_posts().then(res => {
      setPosts(res.data)
    })
  }, [])

  const onDeletePost = (postId) => {
    setPosts(posts.filter((post) => {return post.post.id != postId;}))
  }

  const list_post = posts.map(post => <PostBox key={post.post.id} data={post} onDeletePost={onDeletePost}/>)

  return(
    <Container>
      <UserNavigation />
      <Row className="justify-content-center">
        <h1 className="fs-2 text-secondary text-center m-4 fw-normal">Danh sách bài viết</h1>
      </Row>
      <Row className="justify-content-center">
      {list_post}
      </Row>
    </Container>
  )
}

export default UserPosts;
