import React, { useState } from 'react';
import './PhoneSignIn.css';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Box, Button, TextField } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDJd2dKovgdgS29dqUKG3a0RKZwL_M7C1g",
  authDomain: "brampton-tennis-queue.firebaseapp.com",
  projectId: "brampton-tennis-queue",
  storageBucket: "brampton-tennis-queue.appspot.com",
  messagingSenderId: "578763495949",
  appId: "1:578763495949:web:5c83ba102bcf0e719a9344",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const PhoneSignIn: React.FC = () => {
    const [phone, setPhone] = useState('');
    
    const sendOTP = async () => {
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
        });
        const phoneNumber = phone;
        const appVerifier = recaptchaVerifier;
        await signInWithPhoneNumber(auth, phoneNumber)
            .then((confirmationResult) => {
                const code = prompt('Enter the OTP: ');
                if (code) {
                    confirmationResult.confirm(code)
                        .then((result) => {
                            // User signed in successfully.
                            const user = result.user;
                            console.log(user);
                        })
                        .catch((error) => {
                            // User couldn't sign in (bad verification code?)
                            console.error(error);
                        });
                }
            })
            .catch((error) => {
                // Error; SMS not sent
                console.error(error);
            });
    }

  return (
    <Box className="sign-in-container">
      <PhoneInput
        country="ca"
        containerStyle={{ marginBottom: '1rem' }}
        value={phone}
        onChange={(phone) => setPhone("+" + phone) }
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '1rem', width: '100%' }}
        onClick={sendOTP}
      >
        Send OTP
      </Button>
      <div id="recaptcha-container"></div>
      <TextField
        variant="outlined"
        placeholder="Enter OTP"
        className="otp-input"
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
      >
        Verify OTP
      </Button>
    </Box>
  );
};

export default PhoneSignIn;





// import React, { useState } from 'react';
// import './PhoneSignIn.css';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';
// import { Box, Button, TextField } from '@mui/material';
// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyDJd2dKovgdgS29dqUKG3a0RKZwL_M7C1g",
//   authDomain: "brampton-tennis-queue.firebaseapp.com",
//   projectId: "brampton-tennis-queue",
//   storageBucket: "brampton-tennis-queue.appspot.com",
//   messagingSenderId: "578763495949",
//   appId: "1:578763495949:web:5c83ba102bcf0e719a9344",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// const PhoneSignIn: React.FC = () => {
//     const [phone, setPhone] = useState('');
    
//     const sendOTP = async () => {
//         const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//             size: 'invisible',
//         });
//         const phoneNumber = phone;
//         const appVerifier = recaptchaVerifier;
//         await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//             .then((confirmationResult) => {
//                 const code = prompt('Enter the OTP: ');
//                 if (code) {
//                     confirmationResult.confirm(code)
//                         .then((result) => {
//                             // User signed in successfully.
//                             const user = result.user;
//                             console.log(user);
//                         })
//                         .catch((error) => {
//                             // User couldn't sign in (bad verification code?)
//                             console.error(error);
//                         });
//                 }
//             })
//             .catch((error) => {
//                 // Error; SMS not sent
//                 console.error(error);
//             });
//     }

//   return (
//     <Box className="sign-in-container">
//       <PhoneInput
//         country="ca"
//         containerStyle={{ marginBottom: '1rem' }}
//         value={phone}
//         onChange={(phone) => setPhone("+" + phone) }
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         style={{ marginBottom: '1rem', width: '100%' }}
//         onClick={sendOTP}
//       >
//         Send OTP
//       </Button>
//       <div id="recaptcha-container"></div>
//       <TextField
//         variant="outlined"
//         placeholder="Enter OTP"
//         className="otp-input"
//         fullWidth
//         margin="normal"
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         fullWidth
//       >
//         Verify OTP
//       </Button>
//     </Box>
//   );
// };

// export default PhoneSignIn;
