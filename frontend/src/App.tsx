import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Queue from './pages/Queue';
import NotFound from './pages/NotFound';

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
      </Routes>
    </>
  );
}

export default App;
