// キャッシュのバージョン名（アップデートの際はこの名前を変更します）
const CACHE_NAME = 'app-cache-v4.3.6';

// キャッシュするファイルのリスト
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
  // 必要に応じて style.css や app.js などを追加してください
];

// インストール時の処理：ファイルをキャッシュに保存
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// index.htmlから「skipWaiting」のメッセージを受け取ったら強制的にアクティブにする
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// アクティベート時の処理：古いバージョンのキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('古いキャッシュを削除します:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ネットワークリクエストの処理：キャッシュがあればそれを返し、無ければネットワークへ
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});



