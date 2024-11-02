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
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');    
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null); // State to hold confirmation result

    useEffect(() => {
        // Initialize reCAPTCHA verifier when the component mounts
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
        });
        return () => {
            recaptchaVerifier.clear(); // Clear reCAPTCHA verifier on unmount
        };
    }, []);

    const sendOTP = async () => {
        const phoneNumber = phone;
        const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
        });
        await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
            .then((confirmationResult) => {
                setConfirmationResult(confirmationResult); // Store confirmation result
                setOtpSent(true);
            })
            .catch((error) => {
                console.error("Error during signInWithPhoneNumber: ", error);
            });
    };

    const verifyOTP = async () => {
        if (confirmationResult) {
            try {
                const result = await confirmationResult.confirm(otp);
                console.log("User verified: ", result.user);
                alert("User verified successfully!");
                // Clear the form after successful verification
                setOtp(''); // Clear the OTP input
                setOtpSent(false); // Reset to initial state (not sent OTP)
                setPhone(''); // Clear the phone number input if necessary
                
                // Reload the page after successful verification
            } catch (error) {
                console.error("Error verifying OTP: ", error);
                alert("Error verifying OTP: ");
            }
        }
    };

    return (
        <Box className="sign-in-container">
            <h2>Phone Sign-In</h2>
            {!otpSent ? (
                <>
                    <PhoneInput
                        country="ca"
                        containerStyle={{ marginBottom: '1rem', width: '100%' }}
                        value={phone}
                        onChange={(phone) => setPhone("+" + phone)}
                        inputClass="phone-input"
                    />
                    <Button
                        variant="contained"
                        className="send-otp-button"
                        onClick={sendOTP}
                        style={{ marginBottom: '1rem', width: '100%' }}
                    >
                        Send OTP
                    </Button>
                    <div id="recaptcha-container" className="recaptcha-container"></div>
                </>
            ) : (
                <>
                    <TextField
                        variant="outlined"
                        placeholder="Enter OTP"
                        className="otp-input"
                        margin="normal"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)} // Handle OTP input change
                    />
                    <br></br>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={verifyOTP} // Call verifyOTP function on button click
                    >
                        Verify OTP
                    </Button>
                </>
            )}
        </Box>
    );
};

export default PhoneSignIn;