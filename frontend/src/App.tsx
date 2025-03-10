// src/App.tsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import NotFound from './pages/NotFound';
import LocationSelection from './pages/LocationSelection/LocationSelection';
import UserInfo from './pages/UserInfo/UserInfoForm';
import SignIn from './pages/SignIn/SignIn';
import MessagingPermission from './pages/MessagingPermission/MessagingPermission';
import ActiveView from './pages/ActiveView/ActiveView';
import JoinCourt from './pages/JoinCourt/JoinCourt';
import Account from './pages/Account/Account';

import { LocalStorageProvider } from './context/LocalStorageContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MyCustomAlert from './components/Notifications/NotificationAlert';

function App() {
  // State to hold the alert data
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', body: '' });

  useEffect(() => {
    // 1) Register the SW if not done elsewhere
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js') 
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((err) => {
          console.error('SW registration failed:', err);
        });
      
      // 2) Listen for messages from the SW
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SHOW_ALERT') {
          const { title, body } = event.data.data;
          // Instead of alert(`[${title}] ${body}`);
          // We store in state and show a custom modal
          setAlertData({ title, body });
          setAlertVisible(true);

          // Optionally log to console, too
          console.log(`[Background Message] ${title}: ${body}`);
        }
      });
    }
  }, []);

  return (
    <LocalStorageProvider>
      <AuthProvider>
        <nav>
          {/* your nav links or nothing */}
        </nav>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<LocationSelection />} />
          <Route path="/user-info" element={<UserInfo />} />
          <Route path="/join-court" element={<JoinCourt />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/messaging-permission" element={<MessagingPermission />} />
          <Route path="/account" element={<Account />} />
          <Route 
            path="/active-view" 
            element={
              <ProtectedRoute>
                <ActiveView />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Render our custom alert at the very bottom, so it's on top */}
        <MyCustomAlert
          show={alertVisible}
          title={alertData.title}
          body={alertData.body}
          onClose={() => setAlertVisible(false)}
        />
      </AuthProvider>
    </LocalStorageProvider>
  );
}

export default App;
