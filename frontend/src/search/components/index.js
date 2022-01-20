import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import {get_posts, PostCard} from '../../post';
import {get_gernes} from '../../gerne';
import {get_publishers} from '../../publisher';

const Search = (props) => {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [displayMore, setDisplayMore] = useState(true);
  const [displayFilter, setDisplayFilter] = useState(false);
  const [publisher, setPublisher] = useState('');
  const [publishers, setPublishers] = useState([]);
  const [gerne, setGerne] = useState('');
  const [gernes, setGernes] = useState([]);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  useEffect(() => {
    get_gernes().then(res => setGernes(res.data))
    get_publishers().then(res => setPublishers(res.data))
    get_posts(page, keyword).then(res => {
      setPosts(res.data.results)
      setDisplayMore(res.data.next ? true: false)
    })
  }, [keyword])

  const onClickMore = (e) => {
    get_posts(page + 1, keyword, gerne, publisher, startAt, endAt).then(res => {
      setPosts(old => [...old, ...res.data.results])
      setDisplayMore(res.data.next ? true: false)
      setPage(page + 1)
    })
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

  const onChangeStartAt = (e) => {
    setStartAt(e.target.value)
  }

  const onChangeEndAt = (e) => {
    setEndAt(e.target.value)
  }

  const onClickReset = (e) => {
    setGerne("")
    setPublisher("")
    setStartAt("")
    setEndAt("")
  }

  const onClickSearch = (e) => {
    get_posts(1, keyword, gerne, publisher, startAt, endAt)
    .then(res => {
      setPosts(res.data.results)
      setDisplayMore(res.data.next ? true: false)
    })
  }

  const onFocusDate = (e) => {
    e.target.type = 'date'
  }

  const onBlurText = (e) => {
    e.target.type = 'type'
  }

  const list_posts = posts.map(post => <PostCard key={post.id} post={post} title_font="fs-5"/>)
  const list_gernes = gernes.map(gerne => <option key={gerne.id} value={gerne.id}>{gerne.name}</option>)
  const list_publishers = publishers.map(publisher => <option key={publisher.id} value={publisher.id}>{publisher.name}</option>)

  return (
    <Container>
      <Row className="justify-content-center">
        <Form className={`${displayFilter ? null: 'd-none'}`}>
            <Row className="justify-content-center m-4">
              <Col md={3}>
                <Form.Group>
                  <Form.Select value={gerne} onChange={onChangeGerne}>
                    <option value="">Chọn thể loại</option>
                    {list_gernes}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Select value={publisher} onChange={onChangePublisher}>
                    <option value="">Chọn nhà phát hành</option>
                    {list_publishers}
                    <option value="0">Newsrum</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Control type="text" placeholder="Ngày tạo từ" onFocus={onFocusDate} onBlur={onBlurText} value={startAt} onChange={onChangeStartAt}/>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                   <Form.Control type="text" placeholder="Ngày tạo đến" onFocus={onFocusDate} onBlur={onBlurText} value={endAt} onChange={onChangeEndAt}/>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        <Col md={8}>
          <Row >
            <Col className="d-flex justify-content-between">
              <a className="text-decoration-none" onClick={onClickDisplayFilter}>{displayFilter ? 'Ẩn tìm kiếm nâng cao': 'Tìm kiếm nâng cao'}</a>
              {displayFilter ? <a className="text-decoration-none" onClick={onClickReset}>Khôi phục bộ lọc</a> : null}
              {displayFilter ?  <a className="text-decoration-none" onClick={onClickSearch}>Tìm kiếm</a>: null}
            </Col>
          </Row>
          {list_posts}
        </Col>
      </Row>
      <Row className={`text-center m-4 ${displayMore ? null : 'd-none'}`}>
        <a className="text-decoration-none" onClick={onClickMore}>Hiển thị thêm</a>
      </Row>
    </Container>
  )
}

export default Search
