"use strict";

const CACHE_NAME = "pazar-kuyumcular-pwa-v2";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/manifest.json"
];


// =====================================================
// INSTALL
// =====================================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(
                    FILES_TO_CACHE
                );

            })

    );

    // Yeni Service Worker'ı bekletmeden aktif et
    self.skipWaiting();

});


// =====================================================
// ACTIVATE
// =====================================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(keys => {

                return Promise.all(

                    keys
                        .filter(
                            key =>
                                key !== CACHE_NAME
                        )
                        .map(
                            key =>
                                caches.delete(key)
                        )

                );

            })

    );

    // Açık sekmelerde yeni Service Worker'ı hemen kullan
    self.clients.claim();

});


// =====================================================
// FETCH
// =====================================================

self.addEventListener("fetch", event => {

    // Sadece GET isteklerini cache işle
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        fetch(event.request)
            .then(response => {

                // Başarılı ağ yanıtını cache'e kaydet
                if (
                    response &&
                    response.status === 200 &&
                    response.type === "basic"
                ) {

                    const responseClone =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                event.request,
                                responseClone
                            );

                        });

                }

                return response;

            })
            .catch(() => {

                // İnternet yoksa cache'deki sürümü kullan
                return caches.match(
                    event.request
                );

            })

    );

});
