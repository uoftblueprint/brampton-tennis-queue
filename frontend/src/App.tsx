import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import NotFound from './pages/NotFound';
import { auth } from './firebase'; // Import auth from your Firebase configuration
import { getRedirectResult } from 'firebase/auth'; // Import getRedirectResult from firebase/auth
import LocationSelection from './pages/LocationSelection/LocationSelection'
import UserInfo from './pages/UserInfo/UserInfoForm';
import SignIn from './pages/SignIn/SignIn';
import ActiveView from './pages/ActiveView/ActiveView';
import {useEffect} from "react";

function App() {

  const navigate = useNavigate();

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result && result.user) {
                    const user = result.user;
                    console.log("Signed-in user:", user);

                    // Store user details in localStorage
                    localStorage.setItem("firebaseUID", user.uid);

                    // Navigate to the desired page
                    navigate("/active-view");
                } else {
                    console.log("No redirect result found");
                }
            } catch (error) {
                console.error("Error handling redirect result:", error);
            }
        };

        handleRedirectResult();
    }, [navigate]); // Dependency ensures this runs when `navigate` changes


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
        <Route path="/active-view" element={<ActiveView />} />
      </Routes>
    </>
  );
}

export default App;
