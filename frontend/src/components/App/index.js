import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Button} from 'react-bootstrap';

import Welcome from '../Welcome';
import Navigation from '../Navigation';
import LoginForm from '../Login';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route exact path="/" element={<Welcome />}/>
        <Route path="/login" element={<LoginForm />}/>
        <Route path="/register" element={<a>Register</a>}/>
      </Routes>
    </Router>
  );
}

export default App;
