import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Container, Row, Col, Image, Button, Form} from 'react-bootstrap';

import {get_post_image} from '../../post';
import {get_gernes} from '../../gerne';

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
  const [keyword, setKeyword] = useState('');
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [gerne, setGerne] = useState("");
  const [status, setStatus] = useState("");
  const [displayFilter, setDisplayFilter] = useState(true);
  const [gernes, setGernes] = useState([]);
  const [page, setPage] = useState(1);
  const [displayMore, setDisplayMore] = useState(false);

  useEffect(() => {
    get_posts(page).then(res => {
      setPosts(res.data.results)
    })

    get_gernes().then(res => setGernes(res.data))
  }, [])

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value)
  }

  const onChangeStartAt = (e) => {
    setStartAt(e.target.value)
  }

  const onChangeEndAt = (e) => {
    setEndAt(e.target.value)
  }

  const onChangeGerne = (e) => {
    setGerne(e.target.value)
  }

  const onChangeStatus = (e) => {
    setStatus(e.target.value)
  }

  const onSubmitSearch = (e) => {
    e.preventDefault()
    get_posts(1, keyword, gerne, status, startAt, endAt).then(res => {
      setPosts(res.data.results)
      setPage(2)
      setDisplayMore(res.data.next ? true : false)
    })
  }

  const onClickDisplayFilter = (e) => {
    setDisplayFilter(!displayFilter)
  }

  const onFocusDate = (e) => {
    e.target.type = 'date'
  }

  const onBlurText = (e) => {
    e.target.type = 'type'
  }


  const onClickMore = (e) => {
    e.preventDefault()
    get_posts(page + 1, keyword, gerne, status, startAt, endAt).then(res => {
      setPosts(old => [...old, ...res.data.results])
      setPage(page + 1)
      setDisplayMore(res.data.next ? true : false)
    })
  }

  const onDeletePost = (postId) => {
    setPosts(posts.filter((post) => {return post.post.id != postId;}))
  }

  const list_post = posts.map(post => <PostBox key={post.post.id} data={post} onDeletePost={onDeletePost}/>)
  const list_gernes = gernes.map(gerne => <option key={gerne.id} value={gerne.id}>{gerne.name}</option>)

  return(
    <Container>
      <UserNavigation />
      <Row className="justify-content-center">
        <h1 className="fs-2 text-secondary text-center m-4 fw-normal">Danh sách bài viết</h1>
      </Row>
      <div className={`${displayFilter ? null: 'd-none'}`}>
        <Form onSubmit={onSubmitSearch}>
          <Row className="justify-content-center m-4">
            <Col md={6}>
              <Form.Group>
                <Form.Control value={keyword} onChange={onChangeKeyword}/>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button variant="outline-primary" type="submit">Tìm kiếm bài viết</Button>
            </Col>
          </Row>
          <Row className="justify-content-center m-4">
            <Col md={4}>
              <Form.Select value={gerne} onChange={onChangeGerne}>
                <option value="">Chọn thể loại</option>
                {list_gernes}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Select value={status} onChange={onChangeStatus}>
                <option value="">Chọn trạng thái</option>
                <option value="A">Đã kiểm duyệt</option>
                <option value="P">Chờ kiểm duyệt</option>
              </Form.Select>
            </Col>
          </Row>
          <Row className="justify-content-center m-4">
            <Col md={4}>
              <Form.Control type="text" placeholder="Ngày đăng từ" value={startAt} onChange={onChangeStartAt} onFocus={onFocusDate} onBlur={onBlurText}></Form.Control>
            </Col>
            <Col md={4}>
              <Form.Control type="text" placeholder="Ngày đăng đến" value={endAt} onChange={onChangeEndAt} onFocus={onFocusDate} onBlur={onBlurText}></Form.Control>
            </Col>
          </Row>
        </Form>
      </div>
      <Row className="justify-content-center m-2">
        <a className="text-decoration-none text-center" onClick={onClickDisplayFilter}>{displayFilter ? 'Ẩn bộ lọc' : 'Hiển thị bộ lọc'}</a>
      </Row>
      <Row className="justify-content-center">
      {list_post}
      </Row>
      <div className={`${displayMore ? null: 'd-none'}`}>
        <a className="text-decoration-none" onClick={onClickMore}>Hiển thị thêm</a>
      </div>
    </Container>
  )
}

export default UserPosts;
