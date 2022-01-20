import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import Navigation from '../../navigation';
import Footer from '../../footer';
import {Home, Gerne} from '../../home';
import Login from '../../login';
import Register from '../../register';
import NotFound from '../../error';
import Post from '../../post';
import Search from '../../search';
import {UserLayout, UserAccount, UserProfile, UserPosts, UserCreatePost, UserEditPost} from '../../user';
import {AdminWebPost, AdminPublisherFeed, AdminAddPost, AdminWebSearchPost, AdminSystem, AdminGerne, AdminPublisher,
AdminUser, AdminUserAccount, AdminUserPost} from '../../admin';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/gernes/:gerne_id" element={<Gerne />} />
        <Route path="login" element={<Login />}/>
        <Route path="register" element={<Register />}/>

        <Route path="user">
          <Route path="account" element={<UserAccount />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="posts" element={<UserPosts />} />
          <Route path="posts/:postId/edit" element={<UserEditPost />} />
          <Route path="create" element={<UserCreatePost />}/>
        </Route>

        <Route path="admin">
          <Route path="system" element={<AdminSystem />}>
            <Route path="publishers" element={<AdminPublisher />}/>
            <Route path="gernes" element={<AdminGerne />}/>
          </Route>
          <Route path="users" element={<AdminUser />}>
            <Route path="accounts" element={<AdminUserAccount />}/>
            <Route path="posts" element={<AdminUserPost />}/>
          </Route>
          <Route path="posts" element={<AdminWebPost />}>
            <Route path="feeds" element={<AdminPublisherFeed />} />
            <Route path="add" element={<AdminAddPost />} />
            <Route path="search" element={<AdminWebSearchPost />} />
          </Route>
          <Route path="recommender"/>
        </Route>

        <Route path="posts/:postId" element={<Post />} />

        <Route path="/search" element={<Search />}/>
        <Route path="error/:error_type" />
        <Route path="*" element={<NotFound />} />

      </Routes>
      {/*<Footer />*/}
    </Router>
  );
}

export default App;
