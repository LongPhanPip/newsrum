import {useState, useEffect} from 'react'
import {Container, Col, Row, Button} from 'react-bootstrap';

import {get_posts, get_hot_posts, PostCard} from '../../post';

import GerneTab from './gerne_tab';
import FrontPage from './front_page';

export const Home = (props) => {
  const [frontPosts, setFrontPost] = useState([]);
  const [posts, setPosts] = useState([]);
  const [displayMore, setDisplayMore] = useState(true)

  useEffect(() => {
    get_hot_posts().then(res => setFrontPost(res.data));
    get_posts(1).then(res => {
      setPosts(res.data.results)
      res.data.next ? setDisplayMore(true): setDisplayMore(false)
    })
  }, [])

  return (
    <div>
      <GerneTab />
      {(posts.length !== 0 & frontPosts.length !== 0) ?
        <FrontPage posts={posts} front_posts={frontPosts} gerne={null} more={displayMore}/> : null}
    </div>
  )
}

export default Home;
