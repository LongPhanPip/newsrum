import {useState} from 'react';
import {Container, Row, Col, Form, Button, Image} from 'react-bootstrap'
import {Link} from 'react-router-dom';

import {date_format} from '../../utils';
import {update_post, delete_post} from '../services';


const UserPostCard = (props) => {
  const post = props.post.post;
  const data = props.post;
  const [status, setStatus] = useState(post.status);

  const onClickConfirm = (e) => {
    const new_status = status == "P" ? "A" : "P";
    update_post(post.id, new_status).then(res => setStatus(new_status))
  }

  const onClickDelete = (e) => {
    delete_post(post.id).then(res => props.onDelete(post.id))
  }

  return (
    <div>
      <hr />
      <Row>
        <Col md={3} className="d-flex align-items-center">
          <Link to={`/posts/${post.id}`}>
            <Image src={post.image} />
          </Link>
        </Col>
        <Col md={6} className="d-flex flex-column">
          <Row className="text-truncate">
            <Link to={`/posts/${post.id}`} className="text-decoration-none">
              <span className="fs-4">{post.title}</span>
            </Link>
          </Row>
          <Row  className="text-truncate">
            <span className="text-break text-secondary">{post.description}</span>
          </Row>
          <Row>
            <Col md={6} className="text-truncate">
              <span>{data.markdown}</span>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col>
              <Link to={`/gernes/${post.gerne.id}`} className="text-decoration-none">{post.gerne.name}</Link>
            </Col>
            <Col>
              <p>Trạng thái: {status === "P" ? <span className="text-danger">Chờ xác nhận</span>: <span className="text-secondary">Đã xác nhận</span> }</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <span>Tạo vào lúc: {date_format(post.created_at)}</span>
            </Col>
            <Col md={4}>
              <span>Tạo bởi : {data.account.username}</span>
            </Col>
          </Row>
        </Col>
        <Col className="d-flex align-items-center justify-content-evenly">
          {status == "P" ? <Button variant="outline-primary" onClick={onClickConfirm}>Xác nhận bài viết</Button>:
          <Button variant="outline-danger" onClick={onClickConfirm}>Huỷ xác nhận</Button>}
          <Button variant="outline-danger" onClick={onClickDelete}>Xoá</Button>
        </Col>
      </Row>
    </div>
  )
}

export default UserPostCard;
