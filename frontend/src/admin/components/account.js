import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {search_account} from '../services';
import AccountCard from './account_card';


const AdminUserAccount = () => {
  const [keyword, setKeyword] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(1);
  const [displayFilter, setDisplayFilter] = useState(false);
  const [displayMore, setDisplayMore] = useState(true);

  useEffect(() => {
    search_account(page, keyword, startAt, endAt, isAdmin).then(res => {
      setAccounts(res.data.results)
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

  const onChangeIsAdmin = (e) => {
    setIsAdmin(e.target.value)
  }

  const onSubmitSearch = (e) => {
    e.preventDefault()
    search_account(1, keyword, startAt, endAt, isAdmin).then(res => {
      setAccounts(res.data.results)
      setDisplayMore(res.data.next ? true: false)
    })
  }

  const onClickReset = (e) => {
    setKeyword("")
    setStartAt("")
    setEndAt("")
    setIsAdmin("")
  }

  const onClickDisplayFilter = (e) => {
    setDisplayFilter(!displayFilter)
  }

  const onDeleteAccount = (id) => {
    setAccounts(accounts.filter(account => {return account.id !== id}))
  }

  const onFocusDate = (e) => {
    e.target.type = 'date'
  }

  const onBlurText = (e) => {
    e.target.type = 'type'
  }

  const onClickMore = (e) => {
    search_account(page + 1, keyword, startAt, endAt, isAdmin).then(res => {
      setAccounts(old => [...old, ...res.data.results])
      setDisplayMore(res.data.next ? true: false)
      setPage(page + 1)
    })
  }

  const list_account = accounts.map(account => <AccountCard key={account.id} account={account} onDelete={onDeleteAccount}/>);

  return (
    <div>
      <Form onSubmit={onSubmitSearch} className="m-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Form.Group>
              <Form.Label>Tìm kiếm tài khoản</Form.Label>
              <Form.Control value={keyword} onChange={onChangeKeyword}></Form.Control>
            </Form.Group>
          </Col>
          <Col className="d-flex align-items-end justify-content-evenly">
            <Button variant="outline-primary" type="submit">Tìm kiếm</Button>
             <Button variant="outline-primary" onClick={onClickDisplayFilter}>{displayFilter ? "Ẩn bộ lọc": "Hiển thị bộ lọc"}</Button>
          </Col>
        </Row>
      </Form>

      <div className={`${displayFilter ? null : 'd-none'}`}>
        <Form>
          <Row className="m-4 justify-content-center">
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
                <Form.Select value={isAdmin} onChange={onChangeIsAdmin}>
                  <option value="">Kiểu tài khoản</option>
                  <option value="False">Tài khoản thường</option>
                  <option value="True">Tài khoản quản trị</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <Row className="justify-content-center">
          <Col md={3}>
            <Button variant="outline-primary" onClick={onClickReset}>Khôi phục bộ lọc</Button>
          </Col>
        </Row>
      </div>
      <Row className="justify-content-center">
        {list_account}
      </Row>
      <div className={`text-center m-4 ${displayMore ? null: "d-none"}`}>
        <a className="text-decoration-none" onClick={onClickMore}>Hiển thị thêm</a>
      </div>
    </div>
  )
}

export default AdminUserAccount;
