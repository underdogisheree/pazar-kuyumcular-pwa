"use strict";

const CACHE_NAME = "pazar-kuyumcular-pwa-v3";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/manifest.json"
];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(
                    cache => {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

        );

        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(
                    keys => {

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

                    }
                )

        );

        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;

        const url =
            new URL(request.url);


        if (
            request.method !== "GET"
        ) {

            return;

        }


        if (
            url.origin !== self.location.origin
        ) {

            return;

        }


        event.respondWith(

            fetch(request)
                .then(
                    response => {

                        if (
                            response &&
                            response.ok
                        ) {

                            const responseClone =
                                response.clone();

                            caches.open(
                                CACHE_NAME
                            )
                            .then(
                                cache => {

                                    cache.put(
                                        request,
                                        responseClone
                                    );

                                }
                            );

                        }

                        return response;

                    }
                )
                .catch(
                    () => {

                        return caches.match(
                            request
                        )
                        .then(
                            cachedResponse => {

                                if (
                                    cachedResponse
                                ) {

                                    return cachedResponse;

                                }


                                return new Response(
                                    "Offline",
                                    {
                                        status: 503,
                                        statusText:
                                            "Service Unavailable"
                                    }
                                );

                            }
                        );

                    }
                )

        );

    }
);
