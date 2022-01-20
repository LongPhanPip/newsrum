import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {get_gernes} from '../../gerne';
import {get_publishers, search_web_post} from '../services';
import WebPostForm from './web_post_form';

const AdminSearchWebPost = () => {
  const [keyword, setKeyword] = useState("");
  const [displayFilter, setDisplayFilter] = useState(false);
  const [displayMore, setDisplayMore] = useState(true);
  const [isDisplayMore, setIsDisplayMore] = useState(false);

  const [publishers, setPublishers] = useState([]);
  const [publisher, setPublisher] = useState("");
  const [gernes, setGernes] = useState([]);
  const [gerne, setGerne] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    get_gernes().then(res => setGernes(res.data))
    get_publishers().then(res => setPublishers(res.data))
    search_web_post(page).then(res => {
      setPosts(res.data.results)
      setIsDisplayMore(res.data.next ? true : false)
    })
  }, [])

  const onChangeKeyword = (e) => {
    setKeyword(e.target.value)
  }

  const onClickDisplayFilter = (e) => {
    setDisplayFilter(!displayFilter)
  }

  const onChangeGerne = (e) => {
    setGerne(e.target.value)
  }

  const onChangePublisher = (e) => {
    setPublisher(e.target.value)
  }

  const onChangeStartDate = (e) => {
    setStartDate(e.target.value)
  }

  const onChangeEndDate = (e) => {
    setEndDate(e.target.value)
  }

  const onClickReset = (e) => {
    setKeyword("")
    setGerne("")
    setPublisher("")
    setStartDate("")
    setEndDate("")
  }

  const onClickSearchPost = (e) => {
    setPage(1)
    search_web_post(page, keyword, gerne, publisher, startDate, endDate)
    .then(res => {
      setPosts(res.data.results)
      setIsDisplayMore(res.data.next ? true : false)
    })
  }

  const onClickMorePost = (e) => {
    search_web_post(page + 1, keyword, gerne, publisher, startDate, endDate)
    .then(res => {
      setPosts(old => [...old, ...res.data.results])
      setIsDisplayMore(res.data.next ? true : false)
    })
    setPage(page + 1)
  }

  const onClickDeletePost = (id) => {
    setPosts(posts.filter(post => {return post.post.id != id}))
  }

  const onFocusDate = (e) => {
    e.target.type = 'date'
  }

  const onBlurText = (e) => {
    e.target.type = 'type'
  }

  const list_gernes = gernes.map(gerne => <option key={gerne.id} value={gerne.id}>{gerne.name}</option>)
  const list_publishers = publishers.map(publisher => <option key={publisher.id} value={publisher.id}>{publisher.name}</option>)
  const list_posts = posts.map(post => <WebPostForm key={post.post.id} post={post.post} data={post} gernes={gernes} onDelete={onClickDeletePost}/>)

  return (
    <Container>
      <Form className="m-4" onKeyPress={(e) => e.key === 'Enter' && onClickSearchPost() }>

        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Group>
              <Form.Label>Nhập từ khoá tìm kiếm</Form.Label>
              <Form.Control value={keyword} onChange={onChangeKeyword}></Form.Control>
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end justify-content-center justify-content-evenly">
            <Button variant="outline-primary" onClick={onClickSearchPost}>Tìm kiếm</Button>
            <Button variant="outline-primary" onClick={onClickDisplayFilter}>{displayFilter ? "Ẩn bộ lọc": "Hiển thị bộ lọc"}</Button>
          </Col>
        </Row>
        <div className={`${displayFilter ? null : 'd-none'}`}>
          <Row className="justify-content-center m-4">
            <Col md={6}>
              <Form.Group>
                <Form.Select value={gerne} onChange={onChangeGerne}>
                  <option value="">Lọc theo thể loại</option>
                  {list_gernes}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Select value={publisher} onChange={onChangePublisher}>
                  <option value="">Lọc theo nhà phát hành</option>
                  {list_publishers}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="justify-content-center m-4">
             <Col md={6}>
              <Form.Group>
                <Form.Control value={startDate} onChange={onChangeStartDate} type="text" placeholder="Ngày bắt đầu" type="text" onFocus={onFocusDate} onBlur={onBlurText}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Control value={endDate} onChange={onChangeEndDate} type="text" placeholder="Ngày kết thúc" onFocus={onFocusDate} onBlur={onBlurText}></Form.Control>
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={3} className="text-center">
              <Button variant="outline-primary" onClick={onClickReset}>Khôi phục bộ lọc</Button>
            </Col>
          </Row>
        </div>
      </Form>
      {list_posts}
      <Row className="justify-content-center m-4 text-center">
          {isDisplayMore ? <a className="text-decoration-none" onClick={onClickMorePost}>Hiển thị thêm</a> : null}
      </Row>
    </Container>
  )
}

export default AdminSearchWebPost
