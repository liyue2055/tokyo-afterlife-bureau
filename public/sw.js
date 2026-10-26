const CACHE='tokyo-afterlife-v1';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
// Cache only public static artwork. Never cache authentication, pages or API responses.
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||!['/spirits.png','/icon.svg','/favicon.svg'].includes(url.pathname))return;event.respondWith(caches.open(CACHE).then(async cache=>{const cached=await cache.match(event.request);if(cached)return cached;const response=await fetch(event.request);if(response.ok)cache.put(event.request,response.clone());return response;}));});
