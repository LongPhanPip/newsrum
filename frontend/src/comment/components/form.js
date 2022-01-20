import {useState} from 'react';
import {Form, Button} from 'react-bootstrap';

const CommentForm = (props) => {
  const displayBox = props.displayBox;
  const [text, setText] = useState('');

  const onChangeText = (e) => {
    setText(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(text);
    setText('');
  }

  return(
   <Form onSubmit={handleSubmit} className={displayBox ? "text-end": "d-none"}>
      <Form.Group className="position-relative">
        <Form.Control className=" border-secondary p-3" as="textarea" name="reply" value={text} style={{ height: '100px' }} placeholder="Viết bình luận ở đây" onChange={onChangeText} />
      </Form.Group>
      <Button type="submit" variant="outline-secondary border-0 m-2">Đăng tải</Button>
    </Form>
  )
}

export default CommentForm;
