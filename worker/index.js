export default {
    async fetch(request, env) {

        const url =
            new URL(request.url);

        const path =
            url.pathname;


        // =====================================================
        // COOKIE OKUMA
        // =====================================================

        const cookieHeader =
            request.headers.get("Cookie") || "";


        // =====================================================
        // OTURUM TOKEN KONTROLÜ
        // =====================================================

        function getAuthToken() {

            const cookies =
                cookieHeader
                    .split(";")
                    .map(
                        cookie =>
                            cookie.trim()
                    );


            const authCookie =
                cookies.find(
                    cookie =>
                        cookie.startsWith(
                            "pazar_auth="
                        )
                );


            if (!authCookie) {

                return null;

            }


            return decodeURIComponent(
                authCookie.substring(
                    "pazar_auth=".length
                )
            );

        }


        const authToken =
            getAuthToken();


        // =====================================================
        // GİRİŞ YAPILMIŞ MI?
        // =====================================================

        const isAuthenticated =
            authToken ===
            env.AUTH_SECRET;


        // =====================================================
        // LOGIN SAYFASI
        // =====================================================

        if (
            path === "/login.html"
        ) {

            return env.ASSETS.fetch(
                request
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


                // =================================================
                // CLOUDFLARE SECRET DEĞERLERİ
                // =================================================

                const correctUsername =
                    env.LOGIN_USERNAME;


                const correctPassword =
                    env.LOGIN_PASSWORD;


                const authSecret =
                    env.AUTH_SECRET;


                // =================================================
                // SECRET KONTROLÜ
                // =================================================

                if (
                    !correctUsername ||
                    !correctPassword ||
                    !authSecret
                ) {

                    console.error(
                        "LOGIN_USERNAME, LOGIN_PASSWORD veya AUTH_SECRET eksik."
                    );


                    return new Response(
                        "Sunucu giriş ayarları eksik.",
                        {
                            status: 500,

                            headers: {
                                "Content-Type":
                                    "text/plain; charset=UTF-8"
                            }
                        }
                    );

                }


                // =================================================
                // KULLANICI ADI VE ŞİFRE KONTROLÜ
                // =================================================

                if (
                    username === correctUsername &&
                    password === correctPassword
                ) {


                    // =================================================
                    // GÜVENLİ OTURUM COOKIE'Sİ
                    // =================================================

                    return new Response(
                        null,
                        {

                            status: 302,


                            headers: {

                                "Location":
                                    "/",


                                "Set-Cookie":
                                    "pazar_auth=" +
                                    encodeURIComponent(
                                        authSecret
                                    ) +
                                    "; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400"

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

    <style>

        * {
            box-sizing: border-box;
        }

        body {

            margin: 0;

            min-height: 100vh;

            display: flex;

            align-items: center;

            justify-content: center;

            font-family:
                -apple-system,
                BlinkMacSystemFont,
                "Segoe UI",
                Roboto,
                Arial,
                sans-serif;

            background:
                #f7f3f0;

        }

        .box {

            width: 90%;

            max-width: 420px;

            padding: 32px;

            text-align: center;

            background:
                #ffffff;

            border-radius:
                18px;

            box-shadow:
                0 8px 30px
                rgba(
                    0,
                    0,
                    0,
                    0.12
                );

        }

        h2 {

            margin:
                0 0 12px;

            color:
                #d95720;

        }

        p {

            color:
                #666666;

        }

        a {

            display:
                inline-block;

            margin-top:
                15px;

            padding:
                12px 24px;

            border-radius:
                10px;

            background:
                #ef6c2f;

            color:
                #ffffff;

            font-weight:
                700;

            text-decoration:
                none;

        }

    </style>

</head>


<body>

    <div class="box">

        <h2>
            Giriş başarısız
        </h2>

        <p>
            Kullanıcı adı veya şifre hatalı.
        </p>

        <a href="/login.html">
            Tekrar Giriş Yap
        </a>

    </div>

</body>

</html>
                    `,
                    {

                        status: 401,

                        headers: {

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

                        headers: {

                            "Content-Type":
                                "text/plain; charset=UTF-8"

                        }

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

                        "Location":
                            "/login.html",


                        "Set-Cookie":
                            "pazar_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"

                    }

                }
            );

        }


        // =====================================================
        // ANA SAYFA KORUMASI
        // =====================================================

        if (
            path === "/" ||
            path === "/index.html"
        ) {


            // Giriş yapılmamışsa
            // login sayfasına gönder

            if (
                !isAuthenticated
            ) {

                return new Response(
                    null,
                    {

                        status: 302,


                        headers: {

                            "Location":
                                "/login.html"

                        }

                    }
                );

            }


            // Giriş yapılmışsa
            // index.html'i göster

            return env.ASSETS.fetch(
                request
            );

        }


        // =====================================================
        // STATİK DOSYALAR
        // =====================================================
        //
        // Login sayfasının çalışabilmesi için gerekli dosyalar
        // herkese açık bırakılıyor.
        //
        // Örnek:
        // /login.css
        // /style.css
        // /app.js
        // /manifest.json
        // /icons/...
        //
        // =====================================================

        const publicFiles = [

            "/style.css",

            "/login.css",

            "/app.js",

            "/manifest.json",

            "/favicon.ico",

            "/icon-192.png",

            "/icon-512.png"

        ];


        if (
            publicFiles.includes(
                path
            ) ||
            path.startsWith(
                "/icons/"
            )
        ) {

            return env.ASSETS.fetch(
                request
            );

        }


        // =====================================================
        // DİĞER TÜM İSTEKLER
        // =====================================================
        //
        // Giriş yapılmamış kullanıcıların
        // bilinmeyen dosyalara erişimini engelle.
        //
        // =====================================================

        if (
            !isAuthenticated
        ) {

            return new Response(
                null,
                {

                    status: 302,

                    headers: {

                        "Location":
                            "/login.html"

                    }

                }
            );

        }


        // =====================================================
        // GİRİŞ YAPMIŞ KULLANICI
        // =====================================================

        return env.ASSETS.fetch(
            request
        );

    }
};
