// תלם שלי: שומר את קבצי האפליקציה כדי שתיפתח מהר.
// הנתונים והדפים עצמם תמיד מגיעים מהשרת (לא נשמרים כאן).
const CACHE = "telem-portal-1.6";   // לשנות יחד עם הגרסה ב-index.html
const SHELL = ["./", "index.html", "manifest.webmanifest", "logo.png", "favicon.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;   // Supabase ושאר האתרים – ישירות
  // קודם מהרשת (כדי לקבל תמיד את הגרסה החדשה), ואם אין אינטרנט – מהשמור
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
