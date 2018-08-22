/**
 * service worker file where webpack will import precache-manifest
 * and Workbox runtime libraries
 */

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  ignoreUrlParametersMatching: [/id/]
});

/**
 * workbox bacground sync
 */

const showNotification = () => {
  console.log('Background sync the queue did replay!');
};
const showNotification2 = event => {
  // using BrodcastChannel API for messaging that post request failed
  const channel = new BroadcastChannel('sw-messages');
  channel.postMessage(event);
};

const backgroundSyncPlugin = new workbox.backgroundSync.Plugin('RR-reviews-queue', {
  callbacks: {
    queueDidReplay: showNotification,
    requestWillEnqueue: showNotification2
  }
});

workbox.routing.registerRoute(
  new RegExp('http://localhost:1337/reviews'),
  new workbox.strategies.NetworkOnly({
    plugins: [backgroundSyncPlugin]
  }),
  'POST'
);

workbox.routing.registerRoute(
  new RegExp('http://localhost:1337/restaurants/.*'),
  new workbox.strategies.NetworkOnly({
    plugins: [backgroundSyncPlugin]
  }),
  'PUT'
);
