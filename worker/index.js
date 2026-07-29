export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        const path = url.pathname;

        const headers = {
            "X-Worker-Active": "pazar-kuyumcular-worker"
        };


        // =====================================================
        // COOKIE KONTROLÜ
        // =====================================================

        const cookie =
            request.headers.get("Cookie") || "";

        const isAuthenticated =
            cookie.includes(
                "pazar_auth=authenticated"
            );


        // =====================================================
        // LOGIN SAYFASI
        // =====================================================

        if (
            path === "/login.html"
        ) {

            const response =
                await env.ASSETS.fetch(
                    request
                );

            const newHeaders =
                new Headers(
                    response.headers
                );

            newHeaders.set(
                "X-Worker-Active",
                "pazar-kuyumcular-worker"
            );

            return new Response(
                response.body,
                {
                    status:
                        response.status,

                    statusText:
                        response.statusText,

                    headers:
                        newHeaders
                }
            );

        }


        // =====================================================
        // LOGIN İŞLEMİ
        // =====================================================

        if (
            path === "/login" &&
            request.method === "POST"
        ) {

            try {

                const formData =
                    await request.formData();


                const username =
                    formData.get(
                        "username"
                    );


                const password =
                    formData.get(
                        "password"
                    );


                const correctUsername =
                    env.LOGIN_USERNAME;


                const correctPassword =
                    env.LOGIN_PASSWORD;


                if (
                    !correctUsername ||
                    !correctPassword
                ) {

                    return new Response(
                        "Sunucu giriş ayarları eksik.",
                        {
                            status: 500,
                            headers
                        }
                    );

                }


                // =================================================
                // GİRİŞ BAŞARILI
                // =================================================

                if (
                    username === correctUsername &&
                    password === correctPassword
                ) {

                    return new Response(
                        null,
                        {
                            status: 302,

                            headers: {
                                ...headers,

                                "Location":
                                    "/"
                                ,

                                "Set-Cookie":
                                    "pazar_auth=authenticated; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400"
                            }
                        }
                    );

                }


                // =================================================
                // HATALI GİRİŞ
                // =================================================

                return new Response(
                    `
                    <!DOCTYPE html>

                    <html lang="tr">

                    <head>

                        <meta charset="UTF-8">

                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        >

                        <title>Giriş Hatası</title>

                    </head>

                    <body>

                        <h2>
                            Kullanıcı adı veya şifre hatalı.
                        </h2>

                        <a href="/login.html">
                            Tekrar giriş yap
                        </a>

                    </body>

                    </html>
                    `,
                    {
                        status: 401,

                        headers: {
                            ...headers,

                            "Content-Type":
                                "text/html; charset=UTF-8"
                        }
                    }
                );

            } catch (error) {

                console.error(
                    "Login hatası:",
                    error
                );

                return new Response(
                    "Giriş işlemi sırasında hata oluştu.",
                    {
                        status: 500,
                        headers
                    }
                );

            }

        }


        // =====================================================
        // LOGOUT
        // =====================================================

        if (
            path === "/logout"
        ) {

            return new Response(
                null,
                {
                    status: 302,

                    headers: {

                        ...headers,

                        "Location":
                            "/login.html",

                        "Set-Cookie":
                            "pazar_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
                    }

                }
            );

        }


        // =====================================================
        // ANA SAYFA
        // =====================================================

        if (
            path === "/" ||
            path === "/index.html"
        ) {

            // GİRİŞ YAPILMADIYSA LOGIN'E GÖNDER

            if (
                !isAuthenticated
            ) {

                return new Response(
                    null,
                    {
                        status: 302,

                        headers: {

                            ...headers,

                            "Location":
                                "/login.html"
                        }

                    }
                );

            }


            // GİRİŞ YAPILDIYSA ANA SAYFAYI GÖSTER

            const response =
                await env.ASSETS.fetch(
                    request
                );


            const newHeaders =
                new Headers(
                    response.headers
                );

            newHeaders.set(
                "X-Worker-Active",
                "pazar-kuyumcular-worker"
            );

            return new Response(
                response.body,
                {
                    status:
                        response.status,

                    statusText:
                        response.statusText,

                    headers:
                        newHeaders
                }
            );

        }


        // =====================================================
        // GİRİŞ YAPILMADIYSA DİĞER DOSYALARI ENGELLE
        // =====================================================

        if (
            !isAuthenticated
        ) {

            return new Response(
                null,
                {
                    status: 302,

                    headers: {

                        ...headers,

                        "Location":
                            "/login.html"
                    }

                }
            );

        }


        // =====================================================
        // GİRİŞ YAPILDIYSA DOSYALARA İZİN VER
        // =====================================================

        return env.ASSETS.fetch(
            request
        );

    }
};
