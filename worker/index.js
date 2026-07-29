export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        const path = url.pathname;


        // =====================================================
        // ANA SAYFA
        // =====================================================

        if (
            path === "/" ||
            path === "/index.html"
        ) {

            const cookie =
                request.headers.get("Cookie") || "";


            // Kullanıcı giriş yapmış mı?

            if (
                cookie.includes(
                    "pazar_auth=authenticated"
                )
            ) {

                return env.ASSETS.fetch(
                    new Request(
                        new URL(
                            "/index.html",
                            request.url
                        ),
                        request
                    )
                );

            }


            // Giriş yapılmamışsa login sayfası

            return env.ASSETS.fetch(
                new Request(
                    new URL(
                        "/login.html",
                        request.url
                    ),
                    request
                )
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


                // Cloudflare Secrets / Variables

                const correctUsername =
                    env.LOGIN_USERNAME;


                const correctPassword =
                    env.LOGIN_PASSWORD;


                // Kullanıcı adı ve şifre kontrolü

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


                // Hatalı giriş

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

                        "Location": "/",

                        "Set-Cookie":
                            "pazar_auth=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"

                    }

                }
            );

        }


        // =====================================================
        // LOGIN.HTML
        // =====================================================

        if (
            path === "/login.html"
        ) {

            return env.ASSETS.fetch(
                new Request(
                    new URL(
                        "/login.html",
                        request.url
                    ),
                    request
                )
            );

        }


        // =====================================================
        // DİĞER DOSYALAR
        // =====================================================

        return env.ASSETS.fetch(
            request
        );

    }
};
