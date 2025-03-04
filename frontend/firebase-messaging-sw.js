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

// 3) Background message handler: This fires in the service worker
//    when a push message arrives and the page is not in focus or closed.
messaging.onBackgroundMessage(async (payload) => {
  // 1) Log the incoming payload for debugging/inspection
  console.log('[SW] Background message:', payload);

  // 2) Retrieve all open client pages/tabs for this origin.
  //    "includeUncontrolled: true" means it will match pages
  //    not yet fully controlled by the service worker as well.
  const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

  // 3) For each open page, send a postMessage event containing the payload data.
  //    The page can then listen for this event and show a custom alert or UI.
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
