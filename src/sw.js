var staticCacheNames = [
  'flashcards_v11'
];

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      cacheNames.filter(function (cacheName) {
        return cacheName.startsWith('pt_') &&
          cacheName !== staticCacheNames[0];
      }).map(function (cacheName) {
        return caches.delete(cacheName);
      });
    })
  );
});

self.addEventListener('fetch', function (event) {
  // Serve from cache if possible
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('install', function (event) {
  var UrlsToCache = {
    'flashcards': [
      '/',
      'manifest.json',
      'index.html',
      '/js/app.bundle.js',
      '/css/main.css',
      '/fonts/FontAwesome.otf',
      '/fonts/fontawesome-webfont.eot',
      '/fonts/fontawesome-webfont.svg',
      '/fonts/fontawesome-webfont.ttf',
      '/fonts/fontawesome-webfont.woff',
      '/fonts/fontawesome-webfont.woff2',
      '/fonts/Scope_One/ScopeOne-Regular.ttf',
      '/fonts/Open_Sans/OpenSans-Regular.ttf'
      //'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
    ]
  };

  event.waitUntil(
    staticCacheNames.map(function (cacheName) {
      caches.open(cacheName).then(function (cache) {
        var key = cacheName.replace(/_v[0-9]*/, '');
        UrlsToCache[key].map(function (url) {
          fetch(url, {
            headers: new Headers({
              'api_key': 'c23f17feef984123872cc1894d236fa1'
            })
          }).then(function (response) {
            return cache.put(url, response);
          })
        });
        return cache.addAll(UrlsToCache[key]);
      });
    })
  );
});

self.addEventListener('message', function (event) {
  if (event.data.refresh) {
    self.skipWaiting();
  }
});