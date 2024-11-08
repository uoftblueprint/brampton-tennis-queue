import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Queue from './pages/Queue';
import NotFound from './pages/NotFound';
import UserInfo from './pages/UserInfo/UserInfoForm';
import SignIn from './pages/SignIn/SignIn';
import CurrentState from './pages/CurrentState/CurrentState';

function App() {

  return (
    <> 
      {/* Navigation Links */}
      <nav>
        <Link to="/">Home</Link>
        <Link to="/queue">Join Queue</Link>
      </nav>

      {/* Define Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/selected-location" element={<UserInfo />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/current-state" element={<CurrentState />} />
      </Routes>
    </>
  );
}

export default App;
