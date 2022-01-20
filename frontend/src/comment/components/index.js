import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Container, Row, Col, Button} from 'react-bootstrap';

import {get_comments, create_comment} from '../services';

import CommentCard from './card';
import CommentForm from './form';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [total, setTotal] = useState(0);
  const [isDisplayMore, setIsDisplayMore] = useState(false);
  const [page, setPage] = useState(1);
  let params = useParams();

  useEffect(() => {
    get_comments(params.postId, 1).then(res => {
      const results = res.data.results;
      setIsDisplayMore(res.data.next ? true : false);
      setComments(results)
      setTotal(res.data.total)
    })
  }, [])



  const list_comment = comments.map(comment => {
    return <CommentCard key={comment.id} comment={comment}/>;
  });


  const onClickMoreButton = () => {
    get_comments(params.postId, page + 1).then(res => {
      setComments(old => [...old, ...res.data.results])
      setIsDisplayMore(res.data.next ? true : false)
      setPage(page + 1)
    })
  }

  const handleSubmit = (commentText) => {
    create_comment(params.postId, commentText).then(res => setComments(old => [res.data, ...old]))
    setTotal(total + 1)
  }

  return (
    <Container>
        <h1 className="text-secondary fs-4" >Bình luận: <span className="fs-5">{total}</span></h1>
        <Row>
          <CommentForm onSubmit={handleSubmit} displayBox={true}/>
        </Row>
        <Row>
          {list_comment}
        </Row>
        <Row>
          <Button variant="outline-secondary my-2" onClick={onClickMoreButton} className={isDisplayMore ? null: "d-none"}>Hiển thị thêm</Button>
        </Row>
    </Container>
  )
}

export default CommentSection;
