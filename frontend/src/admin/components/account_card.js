import {useState} from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';

import {date_format} from '../../utils';
import {delete_account, active_account} from '../services';

const AccountCard = (props) => {
  const account = props.account;
  const [active, setActive] = useState(account.is_active);

  const onClickDelete = (e) => {
    delete_account(account.id).then(res => {
      props.onDelete(account.id)
    })
  }

  const onClickActive = (e) => {
    active_account(account.id, !active).then(res => {
      setActive(!active)
    })
  }

  return(
    <div>
      <hr />
      <Row className="justify-content-center text-center m-4">
        <Col md={3} className="d-flex flex-column justify-content-center">
          Tên đăng nhập
          <span className="text-primary">{account.username}</span>
        </Col>
        <Col md={2} className="d-flex flex-column justify-content-center">
          Địa chỉ email
          <span className="text-secondary">{account.email}</span>
        </Col>
        <Col md={3} className="d-flex flex-column justify-content-center">
          Tạo vào lúc
          <span className="text-secondary m-0">{date_format(account.join_at)}</span>
        </Col>
        <Col md={2} className="d-flex flex-column justify-content-center">
          Kiểu tài khoản
          <span className={`${account.is_admin ? "text-danger" : "text-muted"}`}>{account.is_admin ? "Tài khoản quản trị" : "Tài khoản thường"}</span>
        </Col>
        <Col md={2} className="d-flex flex-column justify-content-center">
          Trạng thái
          <span className={`${active ? "text-primary" : "text-danger"}`}>{active ? "Bình thường" : "Bị Khoá"}</span>
        </Col>
      </Row>
      <Row className="justify-content-center text-center">
        <Col md={3}>
          <Button variant="outline-primary" onClick={onClickActive}>{active ? "Khoá tài khoản" : "Kíck hoạt tài khoản"}</Button>
        </Col>
        <Col md={3}>
          <Button variant="outline-danger" onClick={onClickDelete}>Xoá tài khoản</Button>
        </Col>
      </Row>
    </div>
  )
}

export default AccountCard;
