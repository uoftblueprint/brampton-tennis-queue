const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://brampton-tennis-queue.firebaseio.com'
});

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const resetCourtsRoute = require('./routes/resetCourtsRoute');
const expectedWaitTimeRoute = require('./routes/expectedWaitTimeRoute');
const addUnknownsRoute = require('./routes/addUnknownsRoute');
const leaveQueueRoute = require('./routes/leaveQueueRoute');
const endSessionRoute = require('./routes/endSessionRoute');
const joinQueueRoute = require('./routes/joinQueue');

// Use imported routes
app.use('/api', resetCourtsRoute);  // resetCourts endpoint
app.use('/api', expectedWaitTimeRoute);  // expectedWaitTime endpoint
app.use('/api', addUnknownsRoute);  // addUnknowns endpoint
app.use('/api', leaveQueueRoute);  // leaveQueue endpoint
app.use('/api', endSessionRoute);  // endSession endpoint
app.use('/api', joinQueueRoute);  // joinQueue endpoint

// Default route
app.get('/', (req, res) => {
    res.send('Brampton Tennis Queue API');
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
