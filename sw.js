// Service worker Nightlex: офлайн-доступ. Сторінка й дані — «спершу мережа» з обходом HTTP-кешу браузера (cache:'no-cache' → звірка з сервером),
// щоб нова версія приходила одразу; картинки — з кешу.
const CACHE='lingvo-0c4ece269e';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','data/sent_A1.json','data/sent_A2.json','data/sent_B1.json','data/sent_B2.json','data/sent_C1.json','data/sent_C2.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE.map(u=>new Request(u,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(u.pathname.includes('/img/')){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res})));return}
  e.respondWith(fetch(u.href,{cache:'no-cache',credentials:'same-origin'}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res}).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
