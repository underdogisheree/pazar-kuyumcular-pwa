"use strict";

const express =
    require("express");

const session =
    require("express-session");

const bcrypt =
    require("bcrypt");

const path =
    require("path");


/* =====================================================
   UYGULAMA
===================================================== */

const app =
    express();


/* =====================================================
   AYARLAR
===================================================== */

const PORT =
    process.env.PORT || 3000;


/*
 * Production ortamında bu değeri
 * mutlaka güçlü ve gizli bir değerle
 * değiştirmelisin.
 */

const SESSION_SECRET =
    process.env.SESSION_SECRET ||
    "PAZAR_KUYUMCULAR_GUVENLI_SESSION_2026";


/* =====================================================
   MIDDLEWARE
===================================================== */

app.use(
    express.json()
);


app.use(
    express.urlencoded(
        {
            extended:
                true
        }
    )
);


/* =====================================================
   SESSION
===================================================== */

app.use(
    session(
        {
            secret:
                SESSION_SECRET,

            resave:
                false,

            saveUninitialized:
                false,

            cookie:
                {
                    httpOnly:
                        true,

                    secure:
                        false,

                    sameSite:
                        "lax",

                    maxAge:
                        1000 *
                        60 *
                        60 *
                        24
                }
        }
    )
);


/* =====================================================
   GİRİŞ KONTROLÜ
===================================================== */

function girisKontrolu(
    req,
    res,
    next
) {

    if (
        req.session &&
        req.session.user
    ) {

        next();

        return;
    }


    /*
     * Kullanıcı giriş yapmamışsa
     * login.html sayfasına gönder.
     */

    res.redirect(
        "/login.html"
    );

}


/* =====================================================
   STATİK DOSYALAR
===================================================== */

/*
 * login.html ve login.css gibi
 * giriş dosyalarının herkes tarafından
 * erişilebilir olması gerekiyor.
 */

app.get(
    "/login.html",
    function(
        req,
        res
    ) {

        res.sendFile(
            path.join(
                __dirname,
                "login.html"
            )
        );

    }
);


app.get(
    "/login.css",
    function(
        req,
        res
    ) {

        res.sendFile(
            path.join(
                __dirname,
                "login.css"
            )
        );

    }
);


app.get(
    "/login.js",
    function(
        req,
        res
    ) {

        res.sendFile(
            path.join(
                __dirname,
                "login.js"
            )
        );

    }
);


/* =====================================================
   GİRİŞ API
===================================================== */

app.post(
    "/api/login",
    async function(
        req,
        res
    ) {

        try {

            const username =
                String(
                    req.body.username ||
                    ""
                ).trim();


            const password =
                String(
                    req.body.password ||
                    ""
                );


            /*
             * Boş bilgi kontrolü
             */

            if (
                !username ||
                !password
            ) {

                res.status(
                    400
                ).json(
                    {
                        message:
                            "Kullanıcı adı ve şifre gereklidir."
                    }
                );

                return;
            }


            /*
             * Kullanıcıyı
             * geçici kullanıcı listesinden bul.
             *
             * Bir sonraki adımda bu bölüm
             * güvenli kullanıcı veritabanına
             * taşınabilir.
             */

            const kullanici =
                kullanicilar.find(
                    function(
                        kullanici
                    ) {

                        return (
                            kullanici.username ===
                            username
                        );

                    }
                );


            /*
             * Kullanıcı yoksa
             */

            if (
                !kullanici
            ) {

                res.status(
                    401
                ).json(
                    {
                        message:
                            "Kullanıcı adı veya şifre hatalı."
                    }
                );

                return;
            }


            /*
             * Şifre kontrolü
             */

            const sifreDogru =
                await bcrypt.compare(
                    password,
                    kullanici.passwordHash
                );


            if (
                !sifreDogru
            ) {

                res.status(
                    401
                ).json(
                    {
                        message:
                            "Kullanıcı adı veya şifre hatalı."
                    }
                );

                return;
            }


            /*
             * Eski session ID'sini yenile.
             *
             * Bu işlem session fixation
             * saldırılarına karşı koruma sağlar.
             */

            req.session.regenerate(
                function(
                    error
                ) {

                    if (
                        error
                    ) {

                        console.error(
                            "Session oluşturma hatası:",
                            error
                        );

                        res.status(
                            500
                        ).json(
                            {
                                message:
                                    "Giriş sırasında bir hata oluştu."
                            }
                        );

                        return;
                    }


                    /*
                     * Kullanıcı bilgilerini
                     * session içine kaydet.
                     */

                    req.session.user =
                        {
                            id:
                                kullanici.id,

                            username:
                                kullanici.username
                        };


                    /*
                     * Session'ı kaydet.
                     */

                    req.session.save(
                        function(
                            saveError
                        ) {

                            if (
                                saveError
                            ) {

                                console.error(
                                    "Session kaydetme hatası:",
                                    saveError
                                );

                                res.status(
                                    500
                                ).json(
                                    {
                                        message:
                                            "Giriş sırasında bir hata oluştu."
                                    }
                                );

                                return;
                            }


                            res.status(
                                200
                            ).json(
                                {
                                    success:
                                        true,

                                    message:
                                        "Giriş başarılı."
                                }
                            );

                        }
                    );

                }
            );

        } catch (
            error
        ) {

            console.error(
                "Login API hatası:",
                error
            );


            res.status(
                500
            ).json(
                {
                    message:
                        "Sunucu hatası oluştu."
                }
            );

        }

    }
);


/* =====================================================
   OTURUM KONTROLÜ
===================================================== */

app.get(
    "/api/me",
    function(
        req,
        res
    ) {

        if (
            req.session &&
            req.session.user
        ) {

            res.json(
                {
                    authenticated:
                        true,

                    user:
                        req.session.user
                }
            );

            return;
        }


        res.status(
            401
        ).json(
            {
                authenticated:
                    false
            }
        );

    }
);


/* =====================================================
   ÇIKIŞ
===================================================== */

app.post(
    "/api/logout",
    function(
        req,
        res
    ) {

        req.session.destroy(
            function(
                error
            ) {

                if (
                    error
                ) {

                    console.error(
                        "Çıkış hatası:",
                        error
                    );

                    res.status(
                        500
                    ).json(
                        {
                            message:
                                "Çıkış yapılamadı."
                        }
                    );

                    return;
                }


                res.clearCookie(
                    "connect.sid"
                );


                res.json(
                    {
                        success:
                            true
                    }
                );

            }
        );

    }
);


/* =====================================================
   ANA UYGULAMA
===================================================== */

/*
 * Kullanıcı index.html istediğinde
 * önce session kontrolü yapılır.
 */

app.get(
    "/",
    girisKontrolu,
    function(
        req,
        res
    ) {

        res.sendFile(
            path.join(
                __dirname,
                "index.html"
            )
        );

    }
);


/* =====================================================
   UYGULAMA DOSYALARINI KORU
===================================================== */

/*
 * app.js ve style.css gibi dosyalar
 * de sadece giriş yapmış kullanıcıya
 * gönderilecek.
 */

app.get(
    "/app.js",
    girisKontrolu,
    function(
        req,
        res
    ) {

        res.sendFile(
            path.join(
                __dirname,
                "app.js"
            )
        );

    }
);


app.get(
    "/style.css",
    girisKontrolu,
    function(
        req,
        res
    ) {

        res.sendFile(
            path.join(
                __dirname,
                "style.css"
            )
        );

    }
);


/* =====================================================
   MANIFEST
===================================================== */

app.get(
    "/manifest.json",
    girisKontrolu,
    function(
        req,
        res
    ) {

        res.sendFile(
            path.join(
                __dirname,
                "manifest.json"
            )
        );

    }
);


/* =====================================================
   KULLANICI LİSTESİ
===================================================== */

/*
 * DİKKAT:
 *
 * Buradaki passwordHash örnek amaçlıdır.
 *
 * Bir sonraki adımda kullanıcı adı ve
 * şifre oluşturma sistemini kuracağız.
 *
 * Şifreyi burada düz metin olarak
 * kesinlikle tutmayacağız.
 */

const kullanicilar = [

    {
        id:
            1,

        username:
            "admin",

        passwordHash:
            "BURAYA_BCRYPT_HASH_GELECEK"

    }

];


/* =====================================================
   SUNUCUYU BAŞLAT
===================================================== */

app.listen(
    PORT,
    function() {

        console.log(
            "===================================="
        );

        console.log(
            "PAZAR KUYUMCULAR SUNUCUSU"
        );

        console.log(
            "===================================="
        );

        console.log(
            "Sunucu çalışıyor:"
        );

        console.log(
            "http://localhost:" +
            PORT
        );

        console.log(
            "===================================="
        );

    }
);
