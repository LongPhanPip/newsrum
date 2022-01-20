import {useState, useEffect} from 'react';
import {Container, Row, Col, Form, Button, Image} from 'react-bootstrap';

import {get_profile_avatar} from '../../profile';
import {get_profile, update_profile} from '../services';

import UserNavigation from './navigation';

function UserProfile(props) {
  const avatarImg = document.getElementById('avatar');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date_of_birth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [interest, setInterest] = useState('');
  const [avatar, setAvatar] = useState('');
  const [file, setFile] = useState('');

  useEffect(() => {
      get_profile().then(res => {
        setFirstName(res.data.first_name)
        setLastName(res.data.last_name)
        setDateOfBirth(res.data.date_of_birth ? res.data.date_of_birth : '')
        setGender(res.data.gender)
        setAddress(res.data.address)
        setInterest(res.data.interest)
        setAvatar(get_profile_avatar(res.data));
      })
  }, [])

  const onChangeFirstName = (e) => {
    setFirstName(e.target.value)
  }

  const onChangeLastName = (e) => {
    setLastName(e.target.value)
  }

  const onChangeDateOfBirth = (e) => {
    setDateOfBirth(e.target.value)
  }

  const onChangeGender = (e) => {
    setGender(e.target.value)
  }

  const onChangeAddress = (e) => {
    setAddress(e.target.value)
  }

  const onChangeInterest = (e) => {
    setInterest(e.target.value)
  }

  const onChangeAvatar = (e) => {
    avatarImg.src = URL.createObjectURL(e.target.files[0]);
    setFile(e.target.files[0]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    update_profile(firstName, lastName, date_of_birth, gender, address, interest, file);
  }

  return(
    <Container>
      <UserNavigation />
      <Row className="justify-content-center">
        <h1 className="fs-2 text-secondary text-center m-4 fw-normal">Thông tin cá nhân</h1>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={2} className="d-flex align-items-center">
                <Image id="avatar" src={avatar} className="crop-img-md" roundedCircle/>
              </Col>
              <Form.Group as={Col} className="position-relative mb-3">
                <Form.Label className="fs-4 text-secondary">Ảnh đại diện</Form.Label>
                <Form.Control type="file" name="file" onChange={onChangeAvatar}/>
              </Form.Group>
            </Row>

          <Row className="mb-3">
          <Form.Group as={Col} className="mb-3" controlId="formFirstName">
            <Form.Label className="fs-4 text-secondary">Tên</Form.Label>
            <Form.Control className="border-secondary p-3 fs-5" name="firstName" autoComplete="firstName" type="text" value={firstName} onChange={onChangeFirstName}/>
          </Form.Group>
          <Form.Group as={Col} className="mb-3" controlId="formLastName">
            <Form.Label className="fs-4 text-secondary">Họ</Form.Label>
            <Form.Control className="border-secondary p-3 fs-5" name="lastName" autoComplete="lastName" type="text" value={lastName} onChange={onChangeLastName}/>
          </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} className="mb-3" controlId="formAge">
              <Form.Label className="fs-4 text-secondary">Ngày sinh</Form.Label>
              <Form.Control className="border-secondary p-3 fs-5"  autoComplete="date_of_birth" name="date_of_birth" type="date" value={date_of_birth} onChange={onChangeDateOfBirth}/>
            </Form.Group>
            <Form.Group as={Col} className="mb-3" controlId="formGender">
              <Form.Label className="fs-4 text-secondary">Giới tính</Form.Label>
              <Form.Select className="border-secondary p-3 fs-5"  autoComplete="gender" name="gender" value={gender} onChange={onChangeGender}>
                <option>Chọn giới tính</option>
                <option value="M">Nam</option>
                <option value="F">Nữ</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label className="fs-4 text-secondary">Địa chỉ</Form.Label>
            <Form.Control className="border-secondary p-3 fs-5"  name="address" type="text" value={address} onChange={onChangeAddress}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formInterest">
            <Form.Label className="fs-4 text-secondary">Sở thích</Form.Label>
            <Form.Control className="border-secondary p-3 fs-5"  autoComplete="interest" name="interest" type="text" value={interest} onChange={onChangeInterest}/>
          </Form.Group>
          {/*<Form.Group className="mb-3 text-center text-danger" controlId="formError">
            <span>{message}</span>
          </Form.Group>*/}
          <Button variant="outline-primary d-block mx-auto btn-width fs-5" type="submit">
            Lưu thay đổi
          </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default UserProfile;
