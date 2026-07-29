"use strict";


/* =====================================================
   ELEMENTLER
===================================================== */

const loginForm =
    document.getElementById("loginForm");


const usernameInput =
    document.getElementById("username");


const passwordInput =
    document.getElementById("password");


const loginButton =
    document.getElementById("loginButton");


const loginMessage =
    document.getElementById("loginMessage");



/* =====================================================
   MESAJ GÖSTER
===================================================== */

function mesajYaz(mesaj) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent =
        mesaj;

}



/* =====================================================
   GİRİŞ DURUMU
===================================================== */

function girisDurumuYaziliyor() {

    if (!loginButton) {
        return;
    }

    loginButton.disabled =
        true;

    loginButton.textContent =
        "GİRİŞ YAPILIYOR...";

}



/* =====================================================
   GİRİŞ DURUMU NORMAL
===================================================== */

function girisDurumuNormal() {

    if (!loginButton) {
        return;
    }

    loginButton.disabled =
        false;

    loginButton.textContent =
        "GİRİŞ YAP";

}



/* =====================================================
   FORM GÖNDERİMİ
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            mesajYaz(
                ""
            );


            const username =
                usernameInput.value.trim();


            const password =
                passwordInput.value;


            if (!username) {

                mesajYaz(
                    "Lütfen kullanıcı adınızı girin."
                );

                usernameInput.focus();

                return;
            }


            if (!password) {

                mesajYaz(
                    "Lütfen şifrenizi girin."
                );

                passwordInput.focus();

                return;
            }


            girisDurumuYaziliyor();


            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method:
                                "POST",

                            headers:
                                {
                                    "Content-Type":
                                        "application/json"
                                },

                            credentials:
                                "include",

                            body:
                                JSON.stringify(
                                    {
                                        username:
                                            username,

                                        password:
                                            password
                                    }
                                )
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    mesajYaz(
                        data.message ||
                        "Kullanıcı adı veya şifre hatalı."
                    );

                    girisDurumuNormal();

                    passwordInput.value =
                        "";

                    passwordInput.focus();

                    return;
                }


                /*
                 * GİRİŞ BAŞARILI
                 *
                 * Sunucu başarılı giriş sonrası
                 * session cookie oluşturacak.
                 *
                 * Daha sonra kullanıcı ana
                 * uygulamaya yönlendirilecek.
                 */

                window.location.href =
                    "/";


            } catch (error) {

                console.error(
                    "Giriş hatası:",
                    error
                );


                mesajYaz(
                    "Sunucuya bağlanılamadı. Lütfen tekrar deneyin."
                );


                girisDurumuNormal();

            }

        }
    );

}
