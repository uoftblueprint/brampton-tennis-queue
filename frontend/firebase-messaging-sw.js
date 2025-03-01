// public/firebase-messaging-sw.js

/* 
  Using the "compat" importScripts approach, which is simplest for 
  a plain service worker file in public/ 
*/
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.17.1/firebase-messaging-compat.js');

// 1) Your same Firebase config here:
firebase.initializeApp({
  apiKey: "AIzaSyDJd2dK...",
  authDomain: "brampton-tennis-queue.firebaseapp.com",
  projectId: "brampton-tennis-queue",
  storageBucket: "brampton-tennis-queue.appspot.com",
  messagingSenderId: "578763495949",
  appId: "1:578763495949:web:5c83ba102bcf0e719a9344",
});

// 2) Get messaging instance for the SW
const messaging = firebase.messaging();

// 3) Background message handler
messaging.onBackgroundMessage(async (payload) => {
  console.log('[SW] Background message:', payload);

  // If you only want to send a message to an *open* page (if any)
  const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  
  // Post a message to each open client
  allClients.forEach((client) => {
    client.postMessage({
      type: 'SHOW_ALERT',
      data: {
        title: payload.notification?.title || 'Default Title',
        body:  payload.notification?.body || 'Default Body'
      }
    });
  });
});

