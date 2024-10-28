const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-admin.json');

app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://brampton-tennis-queue.firebaseio.com'
});

app.get('/', (req, res) => {
  res.send('Brampton Tennis Queue API');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
