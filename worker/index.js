export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        /*
        ============================================
        LOGIN API
        ============================================
        */

        if (
            url.pathname === "/api/login" &&
            request.method === "POST"
        ) {

            try {

                const body =
                    await request.json();

                const username =
                    body.username;

                const password =
                    body.password;


                /*
                Cloudflare Secret değişkenleri
                */

                if (
                    username === env.LOGIN_USERNAME &&
                    password === env.LOGIN_PASSWORD
                ) {

                    return new Response(
                        JSON.stringify({
                            success: true
                        }),
                        {
                            status: 200,

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Set-Cookie":
                                    "session=authenticated; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400"
                            }
                        }
                    );

                }


                return new Response(
                    JSON.stringify({
                        success: false,
                        message:
                            "Kullanıcı adı veya şifre hatalı."
                    }),
                    {
                        status: 401,

                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            } catch (error) {

                return new Response(
                    JSON.stringify({
                        success: false,
                        message:
                            "Geçersiz istek."
                    }),
                    {
                        status: 400,

                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            }

        }


        /*
        ============================================
        LOGOUT API
        ============================================
        */

        if (
            url.pathname === "/api/logout"
        ) {

            return new Response(
                JSON.stringify({
                    success: true
                }),
                {
                    status: 200,

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Set-Cookie":
                            "session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
                    }
                }
            );

        }


        /*
        ============================================
        ANA SAYFA KONTROLÜ
        ============================================
        */

        if (
            url.pathname === "/" ||
            url.pathname === "/index.html"
        ) {

            const cookie =
                request.headers.get(
                    "Cookie"
                ) || "";


            if (
                cookie.includes(
                    "session=authenticated"
                )
            ) {

                return new Response(
                    "Giriş başarılı. Siteye erişim açık.",
                    {
                        status: 200
                    }
                );

            }


            return Response.redirect(
                url.origin +
                "/login.html",
                302
            );

        }


        /*
        ============================================
        DİĞER İSTEKLER
        ============================================
        */

        return fetch(request);

    }
};
