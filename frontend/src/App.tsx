import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';
import LocationSelection from './pages/LocationSelection/LocationSelection'
import UserInfo from './pages/UserInfo/UserInfoForm';
import SignIn from './pages/SignIn/SignIn';
import CurrentState from './pages/CurrentState/CurrentState';

function App() {

  return (
    <> 
      {/* Navigation Links */}
      <nav>
        <Link to="/">Home</Link>
      </nav>

      {/* Define Routes */}
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<LocationSelection />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/current-state" element={<CurrentState />} />
      </Routes>
    </>
  );
}

export default App;
