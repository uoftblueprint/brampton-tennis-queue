import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LocationSelection from './pages/LocationSelection/LocationSelection'
import UserInfo from './pages/UserInfo/UserInfoForm';
import SignIn from './pages/SignIn/SignIn';
import ActiveView from './pages/ActiveView/ActiveView';
import JoinCourt from './pages/JoinCourt/JoinCourt';

// Import contexts
import { LocalStorageProvider } from './context/LocalStorageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  return (
    <LocalStorageProvider> 
      <AuthProvider>
        {/* Navigation Links */}
        <nav>
        </nav>

        {/* Define Routes */}
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<LocationSelection />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/join-court" element={<JoinCourt />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route 
            path="/active-view" 
            element={
              <ProtectedRoute>
                <ActiveView />
              </ProtectedRoute>
            } 
          />        </Routes>
      </AuthProvider>
    </LocalStorageProvider>
  );
}

export default App;
