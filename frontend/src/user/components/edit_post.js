import {useParams, useNavigate} from 'react-router-dom';
import {useState, useEffect} from 'react';
import {Spinner} from 'react-bootstrap';

import {update_post, get_post} from '../services';
import {PostForm} from './form';


const UserEditPost = (props) => {
  let params = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    get_post(params.postId).then(res => setPost(res.data))
  }, [])

  const onSubmit = (title, description, image, gerne, markdown) => {
    update_post(post.post.id, title, description, image, gerne, markdown);
    navigate(`/posts/${post.post.id}`);
  }

  return (
    <div>
      {post ? <PostForm button_text="Lưu bài viết" header="Chỉnh sửa bài viết" onSubmit={onSubmit} post={post}/>
      : <Spinner animation="border" variant="light" />}
    </div>)
}

export default UserEditPost
