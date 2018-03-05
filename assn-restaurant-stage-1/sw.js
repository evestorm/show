var staticCacheName = 'restaurant-stage1-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'css/styles.css',
        '/restaurant.html',
        'data/restaurants.json'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// asdsdp

self.addEventListener('fetch', function(event) {
  // get restaurant.html from cache too
  var requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin &&
    requestUrl.pathname === '/restaurant.html') {
    event.respondWith(caches.match('/restaurant.html'));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

