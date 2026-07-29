export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        const path = url.pathname;


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


                const correctUsername =
                    env.LOGIN_USERNAME;


                const correctPassword =
                    env.LOGIN_PASSWORD;


                if (
                    !correctUsername ||
                    !correctPassword
                ) {

                    console.error(
                        "LOGIN_USERNAME veya LOGIN_PASSWORD tanımlı değil."
                    );

                    return new Response(
                        "Sunucu giriş ayarları eksik.",
                        {
                            status: 500
                        }
                    );

                }


                // =================================================
                // KULLANICI ADI VE ŞİFRE DOĞRU
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

                                "Location": "/",

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

                        <style>

                            body {
                                font-family:
                                    Arial,
                                    sans-serif;

                                background:
                                    #f7f3f0;

                                display:
                                    flex;

                                justify-content:
                                    center;

                                align-items:
                                    center;

                                min-height:
                                    100vh;

                                margin:
                                    0;
                            }

                            .box {
                                background:
                                    #ffffff;

                                padding:
                                    30px;

                                border-radius:
                                    16px;

                                text-align:
                                    center;

                                box-shadow:
                                    0 5px 20px
                                    rgba(
                                        0,
                                        0,
                                        0,
                                        0.1
                                    );
                            }

                            h2 {
                                color:
                                    #d95720;
                            }

                            a {
                                display:
                                    inline-block;

                                margin-top:
                                    15px;

                                color:
                                    #ef6c2f;

                                font-weight:
                                    bold;

                                text-decoration:
                                    none;
                            }

                        </style>

                    </head>

                    <body>

                        <div class="box">

                            <h2>
                                Kullanıcı adı veya şifre hatalı.
                            </h2>

                            <a href="/login.html">
                                Tekrar giriş yap
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
                        status: 500
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

                        "Location": "/login.html",

                        "Set-Cookie":
                            "pazar_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"

                    }

                }
            );

        }


        // =====================================================
        // ANA SAYFA KONTROLÜ
        // =====================================================

        if (
            path === "/" ||
            path === "/index.html"
        ) {

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


            return env.ASSETS.fetch(
                request
            );

        }


        // =====================================================
        // LOGIN YAPILMAMIŞSA
        // UYGULAMA DOSYALARINA ERİŞİMİ ENGELLE
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
        // GİRİŞ YAPILMIŞSA DİĞER DOSYALARA İZİN VER
        // =====================================================

        return env.ASSETS.fetch(
            request
        );

    }
};
