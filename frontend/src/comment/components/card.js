import {useState, useEffect} from 'react';

import {Container, Row, Col, Image} from 'react-bootstrap';

import {get_profile_avatar} from '../../profile';
import {get_replies, create_reply,timeToNow} from '../services';


import CommentForm from './form';

const CommentCard = (props) => {
  const comment = props.comment;
  const [replies, setReplies] = useState([]);
  const [displayReplyBox, setDisplayReplyBox] = useState(false);
  const [avatar, setAvatar] = useState(() => {
    return get_profile_avatar(comment.account);
  });

  useEffect(() => {
    if(comment.replies.length !== 0) {
      get_replies(comment.id).then(res => setReplies(res.data))
    }
  }, [])

  const list_reply = replies.map(reply => {
    return <CommentCard key={reply.id} comment={reply}/>
  });

  const onClickReply = (e) => {
    e.preventDefault();
    setDisplayReplyBox(!displayReplyBox);
  }

  const handleSubmit = (replyText) => {
    create_reply(comment.id, replyText).then(res => setReplies(old => [...old, res.data.reply]));
    setDisplayReplyBox(!displayReplyBox);
  }

  return(
    <Container className="py-2">
      <Row>
        <Col className="d-flex">
          <Image src={avatar} roundedCircle className="crop-img-xs"/>
          <Col className="d-flex align-items-center mx-2">
            <span className="fw-normal">{comment.account.username}</span>
            <span className="mx-2 text-secondary">. {timeToNow(comment.created_at)}</span>
            {Date.parse(comment.created_at) - Date.parse(comment.updated_at) > 5000 ? <span className="ms-auto text-secondary">(đã chỉnh sửa)</span>: null}
          </Col>
        </Col>
      </Row>

      <Row className="border-start  border-gray-200 mx-3 my-2">
        <span>{comment.text}</span>
      </Row>
      <Row className="justify-content-start my-2">
        <Col md={2}>
          <a className="btn-link btn-width p-2 fw-bold" onClick={onClickReply}>Trả lời</a>
        </Col>
        <CommentForm onSubmit={handleSubmit} displayBox={displayReplyBox}/>
      </Row>
      {list_reply}
    </Container>
  );
}

export default CommentCard;
