// 룰루랄라 PWA 서비스 워커예요. 앱처럼 설치되게 하고, 연결이 끊겨도 마지막으로 본 화면이 열리게 해요.
var RULULALA_CACHE = "rululala-v1";
var RULULALA_CORE = ["./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(RULULALA_CACHE).then(function (cache) { return cache.addAll(RULULALA_CORE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== RULULALA_CACHE) return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  var url;
  try { url = new URL(req.url); } catch (e) { return; }
  if (url.origin !== location.origin) return;

  // 페이지 이동은 최신 내용을 먼저 보여주고, 실패하면 저장해 둔 화면을 보여줘요.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(RULULALA_CACHE).then(function (cache) { cache.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) { return hit || caches.match("./index.html"); });
      })
    );
    return;
  }

  // 나머지 같은 출처 파일은 저장본을 먼저 쓰고, 없으면 받아서 저장해요.
  event.respondWith(
    caches.match(req).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(RULULALA_CACHE).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      });
    })
  );
});
