import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LocationSelection from './pages/LocationSelection/LocationSelection'
import UserInfo from './pages/UserInfo/UserInfoForm';
import SignIn from './pages/SignIn/SignIn';
import ActiveView from './pages/ActiveView/ActiveView';

// Import contexts
import { LocalStorageProvider } from './context/LocalStorageContext';

function App() {

  return (
    <LocalStorageProvider> 
      {/* Navigation Links */}
      <nav>
      </nav>

      {/* Define Routes */}
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<LocationSelection />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/active-view" element={<ActiveView />} />
      </Routes>
    </LocalStorageProvider>
  );
}

export default App;
