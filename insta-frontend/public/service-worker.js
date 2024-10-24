// self.addEventListener('install', (event) => {
//     event.waitUntil(
//       caches.open('static-cache-v1').then((cache) => {
//         return cache.addAll([
//           '/',
//           '/insta-logo.png',
//           '/styles/main.css',
//           '/scripts/main.js',
//           '/images/logo.png',
//         ]);
//       })
//     );
//   });
  
//   self.addEventListener('fetch', (event) => {
//     event.respondWith(
//       caches.match(event.request).then((response) => {
//         return response || fetch(event.request);
//       })
//     );
//   });
  