import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {get_gernes} from '../../gerne';
import {search_user_post} from '../services';
import UserPostCard from './user_post_card';


const AdminUserPost = () => {
  const [keyword, setKeyword] = useState('');
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [gerne, setGerne] = useState("");
  const [status, setStatus] = useState("");
  const [displayFilter, setDisplayFilter] = useState(false);
  const [posts, setPosts] = useState([]);
  const [gernes, setGernes] = useState([]);
  const [page, setPage] = useState(1);
  const [displayMore, setDisplayMore] = useState(true);

  useEffect(() => {
    get_gernes().then(res => setGernes(res.data))
    search_user_post(page, keyword).then(res => {
      setPosts(res.data.results)
      setDisplayMore(res.data.next ? true: false)
    })
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
    search_user_post(1, keyword, gerne, startAt, endAt, status).then(res => {
      setPosts(res.data.results)
      setDisplayMore(res.data.next ? true: false)
      setPage(2)
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

  const onDeletePost = (id) => {
    setPosts(posts.filter(post => {return post.post.id !== id}))
  }

  const onClickMore = (e) => {
    search_user_post(page + 1, keyword, gerne, startAt, endAt, status).then(res => {
      setPosts(res.data.results)
      setDisplayMore(res.data.next ? true: false)
      setPage(page + 1)
    })
  }


  const list_gernes = gernes.map(gerne => <option key={gerne.id} value={gerne.id}>{gerne.name}</option>)
  const list_posts = posts.map(post => <UserPostCard key={post.post.id} post={post} onDelete={onDeletePost}/>)

  return(
    <div>
      <Form className="m-4" onSubmit={onSubmitSearch}>
        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Group>
              <Form.Label>Tìm kiếm bài viết</Form.Label>
              <Form.Control value={keyword} onChange={onChangeKeyword}></Form.Control>
            </Form.Group>
          </Col>
          <Col className="d-flex align-items-end justify-content-evenly">
            <Button variant="outline-primary" type="submit">Tìm kiếm</Button>
            <Button variant="outline-primary" onClick={onClickDisplayFilter}>{displayFilter ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}</Button>
          </Col>
        </Row>
        <div className={`${displayFilter ? "null" : 'd-none'} m-4`}>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Control type="text" value={startAt} onChange={onChangeStartAt} placeholder="Ngày tạo từ" onFocus={onFocusDate} onBlur={onBlurText}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Control type="text" value={endAt} onChange={onChangeEndAt} placeholder="Ngày tạo đến" onFocus={onFocusDate} onBlur={onBlurText}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Select type="text" value={gerne} onChange={onChangeGerne}>
                  <option value="">Chọn thể loại cần lọc</option>
                  {list_gernes}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Select type="text" value={status} onChange={onChangeStatus}>
                  <option value="">Chọn loại bài viết</option>
                  <option value="P">Chờ duyệt</option>
                  <option value="A">Đã kiểm duyệt</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>
      </Form>
      <Row>
        {list_posts}
      </Row>
      <Row className={`text-center m-4 ${displayMore ? null: 'd-none'}`}>
        <a className="text-decoration-none" onClick={onClickMore}>Hiển thị thêm</a>
      </Row>
    </div>
  )
}

export default AdminUserPost;
