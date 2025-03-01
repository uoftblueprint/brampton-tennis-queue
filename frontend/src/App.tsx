import { Routes, Route } from 'react-router-dom';
import NotFound from './pages/NotFound';
import LocationSelection from './pages/LocationSelection/LocationSelection'
import UserInfo from './pages/UserInfo/UserInfoForm';
import SignIn from './pages/SignIn/SignIn';
import MessagingPermission from './pages/MessagingPermission/MessagingPermission';
import ActiveView from './pages/ActiveView/ActiveView';
import JoinCourt from './pages/JoinCourt/JoinCourt';

// Import contexts
import { LocalStorageProvider } from './context/LocalStorageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute.tsx';

// src/main.ts or App.tsx or wherever your root is:
if ('serviceWorker' in navigator) {
  // 1) Register the Service Worker
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js') // Adjust the path if necessary
    .then((registration) => {
      console.log('Service Worker registered:', registration.scope);
    })
    .catch((err) => {
      console.error('SW registration failed:', err);
    });
  
  // 2) Listen for messages from the Service Worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'SHOW_ALERT') {
      const { title, body } = event.data.data;
      // Show a blocking alert (or a custom UI)
      alert(`[${title}] ${body}`);
      console.log(`[${title}] ${body}`);
    }
  });
}

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
          <Route path="/messaging-permission" element={<MessagingPermission />} />
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
