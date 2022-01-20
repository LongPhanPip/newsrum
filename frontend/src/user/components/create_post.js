import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {PostForm} from './form';
import {create_post} from '../services';


const UserCreatePost = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const onSubmit = (title, description, image, gerne, markdown) => {
    create_post(title, description, image, gerne, markdown).then(res => {
      if(Math.floor(res.status / 100) === 2) {
          navigate(`/posts/${res.data.post.id}`)
      }
      else {
        setMessage('Lỗi tạo bài viết');
      }
    })
  }

  return (<PostForm button_text="Tạo bài viết" header="Tạo bài viết mới" onSubmit={onSubmit}/>)
}

export default UserCreatePost

