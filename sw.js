// sw.js - Service Worker Optimizado para SimCert
const CACHE_NAME = 'simcert-cache-v2'; // Incrementa este número al actualizar tu app

// Archivos estáticos indispensables para arrancar offline (App Shell)
const STATIC_ASSETS = [
  '/',
  '/index (1).html',
  // Añade aquí tus rutas locales exactas si tienes archivos CSS/JS separados, por ejemplo:
  // '/css/styles.css',
  // '/js/app.js'
];

// Dominios externos permitidos para almacenamiento en caché estática (Fuentes e imágenes de sprites)
const TRUSTED_STATIC_ORIGINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'static.fandomspot.com',
  'wallpapers.com',
  'www.spriters-resource.com'
];

// 1. EVENTO INSTALL: Pre-cacheo básico y bypass inmediato
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-cacheando el App Shell base...');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Alviso: Algunos recursos estáticos locales fallaron en el precacheo:', err);
      });
    }).then(() => self.skipWaiting()) // Forzar activación inmediata saltando el estado de espera
  );
});

// 2. EVENTO ACTIVATE: Limpieza quirúrgica de cachés antiguas (Evita assets corruptos)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Purgando caché obsoleta detectada:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Tomar control de las pestañas abiertas inmediatamente
  );
});

// 3. EVENTO FETCH: Estrategia Dual Interceptora
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Omitir peticiones no HTTP/HTTPS (extensiones de Chrome, datos Base64, etc.)
  if (!event.request.url.startsWith('http')) return;

  // CASO A: Recursos Estáticos (Locales o de servidores de assets de confianza) -> Cache-First
  const isStaticAsset = STATIC_ASSETS.includes(requestUrl.pathname) || 
                        TRUSTED_STATIC_ORIGINS.some(origin => requestUrl.hostname.includes(origin));

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Stale-While-Revalidate: Sirve el caché rápido, pero actualiza el almacén en segundo plano
          fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          }).catch(() => {/* Silenciar fallos de red silenciosos en segundo plano */});
          
          return cachedResponse;
        }

        // Si no está en caché, ir a la red y guardarlo para el futuro
        return fallbackToNetworkAndCache(event.request);
      })
    );
  } else {
    // CASO B: Datos Dinámicos / APIs externas -> Network-First con caída en Caché si estás offline
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          console.log('[SW] Modo Offline detectado para recurso dinámico. Intentando recuperar del historial...');
          return caches.match(event.request);
        })
    );
  }
});

// Función auxiliar para nutrir la caché de forma dinámica
function fallbackToNetworkAndCache(request) {
  return fetch(request).then((networkResponse) => {
    if (!networkResponse || networkResponse.status !== 200) return networkResponse;
    
    const responseToCache = networkResponse.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
    return networkResponse;
  }).catch((err) => {
    console.error('[SW] Fallo crítico de red y no hay copia en caché para:', request.url, err);
  });
}