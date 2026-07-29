"use strict";


// =====================================================
// HAREM ALTIN SOCKET.IO BAĞLANTISI
// =====================================================

const socket = io(
    "https://hrmsocketonly.haremaltin.com",
    {
        transports: ["polling", "websocket"],
        path: "/socket.io/"
    }
);


// =====================================================
// KATSAYILAR
// =====================================================

const katsayilar = {

    ayar24: {
        satis: 1.015,
        bozus: 0.995
    },

    ayar22: {
        satis: 0.970,
        bozus: 0.910
    },

    ceyrekZiynet: {
        satis: 1.66,
        bozus: 1.60
    },

    ceyrekCumhuriyet: {
        satis: 1.71,
        bozus: 1.655
    },

    tamZiynet: {
        satis: 6.63,
        bozus: 6.37
    },

    tamCumhuriyet: {
        satis: 6.80,
        bozus: 6.61
    }

};


// =====================================================
// HTML ELEMANLARI
// =====================================================

const connectionStatus =
    document.getElementById("connectionStatus");

const updateTime =
    document.getElementById("updateTime");


// =====================================================
// HAS ALTIN SATIŞ FİYATI
// =====================================================

const hasAltinPrice =
    document.getElementById("hasAltinPrice");


// =====================================================
// HAS ALTIN ALIŞ / BOZUŞ FİYATI
// =====================================================

const hasAltinBozusPrice =
    document.getElementById("hasAltinBozusPrice");


// =====================================================
// ÜRÜN FİYATLARINI FORMATLAMA
//
// Ürün fiyatları en yakın 10 TL'ye yuvarlanır.
//
// Örnek:
//
// 6.272,75 TL → 6.270 TL
// 6.276,20 TL → 6.280 TL
//
// Yuvarlama sadece ekranda gösterilir.
// Hesaplamaların kendisi tam hassasiyetle yapılır.
// =====================================================

function formatTL(value) {

    const roundedValue =
        Math.round(Number(value) / 10) * 10;

    return roundedValue.toLocaleString(
        "tr-TR"
    ) + " TL";

}


// =====================================================
// HAS ALTIN FİYATINI FORMATLAMA
//
// Has Altın fiyatları yuvarlanmaz.
// Kuruşlarıyla birlikte gösterilir.
//
// Örnek:
//
// 6.180,05 TL
// =====================================================

function formatHasAltinTL(value) {

    return Number(value).toLocaleString(
        "tr-TR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " TL";

}


// =====================================================
// FİYAT GÖSTERME
// =====================================================

function setPrice(
    id,
    value
) {

    const element =
        document.getElementById(id);

    if (!element) {

        console.warn(
            "HTML elemanı bulunamadı:",
            id
        );

        return;

    }

    element.textContent =
        formatTL(value);

}


// =====================================================
// HAS ALTIN ÜZERİNDEN FİYAT HESAPLAMA
//
// SATIŞ FİYATLARI:
// Has Altın SATIŞ fiyatı üzerinden hesaplanır.
//
// ALIŞ / BOZUŞ FİYATLARI:
// Has Altın ALIŞ fiyatı üzerinden hesaplanır.
//
// Ürün fiyatları ekranda en yakın 10 TL'ye
// yuvarlanarak gösterilir.
// =====================================================

function hesapla(
    hasAltinSatis,
    hasAltinBozus
) {


    // =================================================
    // 24 AYAR
    // =================================================

    setPrice(
        "ayar24Satis",
        hasAltinSatis *
        katsayilar.ayar24.satis
    );

    setPrice(
        "ayar24Bozus",
        hasAltinBozus *
        katsayilar.ayar24.bozus
    );


    // =================================================
    // 22 AYAR
    // =================================================

    setPrice(
        "ayar22Satis",
        hasAltinSatis *
        katsayilar.ayar22.satis
    );

    setPrice(
        "ayar22Bozus",
        hasAltinBozus *
        katsayilar.ayar22.bozus
    );


    // =================================================
    // ZİYNET ÇEYREK
    // =================================================

    setPrice(
        "ceyrekZiynetSatis",
        hasAltinSatis *
        katsayilar.ceyrekZiynet.satis
    );

    setPrice(
        "ceyrekZiynetBozus",
        hasAltinBozus *
        katsayilar.ceyrekZiynet.bozus
    );


    // =================================================
    // ATA ÇEYREK
    // =================================================

    setPrice(
        "ceyrekCumhuriyetSatis",
        hasAltinSatis *
        katsayilar.ceyrekCumhuriyet.satis
    );

    setPrice(
        "ceyrekCumhuriyetBozus",
        hasAltinBozus *
        katsayilar.ceyrekCumhuriyet.bozus
    );


    // =================================================
    // TAM ZİYNET
    // =================================================

    setPrice(
        "tamZiynetSatis",
        hasAltinSatis *
        katsayilar.tamZiynet.satis
    );

    setPrice(
        "tamZiynetBozus",
        hasAltinBozus *
        katsayilar.tamZiynet.bozus
    );


    // =================================================
    // ATA TAM
    // =================================================

    setPrice(
        "tamCumhuriyetSatis",
        hasAltinSatis *
        katsayilar.tamCumhuriyet.satis
    );

    setPrice(
        "tamCumhuriyetBozus",
        hasAltinBozus *
        katsayilar.tamCumhuriyet.bozus
    );

}


// =====================================================
// SOCKET.IO BAĞLANTISI
// =====================================================

socket.on(
    "connect",
    () => {

        console.log(
            "HAREM ALTIN WEBSOCKET BAĞLANTISI BAŞARILI"
        );

        connectionStatus.textContent =
            "Bağlandı";

        connectionStatus.className =
            "status connected";

    }
);


// =====================================================
// FİYAT DEĞİŞİKLİĞİ
// =====================================================

socket.on(
    "price_changed",
    (response) => {

        console.log(
            "YENİ FİYAT VERİSİ GELDİ:",
            response
        );


        // =================================================
        // VERİ KONTROLÜ
        // =================================================

        if (
            !response ||
            !response.data ||
            !response.data.ALTIN
        ) {

            console.warn(
                "ALTIN verisi bulunamadı"
            );

            return;

        }


        // =================================================
        // ALTIN VERİSİNİ AL
        // =================================================

        const altin =
            response.data.ALTIN;


        // =================================================
        // HAS ALTIN SATIŞ FİYATI
        //
        // Harem Altın:
        // altin.satis
        // =================================================

        const hasAltinSatis =
            Number(
                altin.satis
            );


        // =================================================
        // HAS ALTIN ALIŞ / BOZUŞ FİYATI
        //
        // Harem Altın:
        // altin.alis
        // =================================================

        const hasAltinBozus =
            Number(
                altin.alis
            );


        // =================================================
        // FİYAT KONTROLÜ
        // =================================================

        if (
            !Number.isFinite(
                hasAltinSatis
            ) ||
            !Number.isFinite(
                hasAltinBozus
            )
        ) {

            console.error(
                "Geçersiz Has Altın fiyatı:",
                {
                    satis: altin.satis,
                    alis: altin.alis
                }
            );

            return;

        }


        // =================================================
        // HAS ALTIN SATIŞ FİYATINI GÖSTER
        //
        // Yuvarlama yapılmaz.
        // Kuruşlarıyla gösterilir.
        // =================================================

        if (hasAltinPrice) {

            hasAltinPrice.textContent =
                formatHasAltinTL(
                    hasAltinSatis
                );

        }


        // =================================================
        // HAS ALTIN ALIŞ FİYATINI GÖSTER
        //
        // Yuvarlama yapılmaz.
        // Kuruşlarıyla gösterilir.
        // =================================================

        if (hasAltinBozusPrice) {

            hasAltinBozusPrice.textContent =
                formatHasAltinTL(
                    hasAltinBozus
                );

        }


        // =================================================
        // SON GÜNCELLEME
        // =================================================

        if (updateTime) {

            updateTime.textContent =
                altin.tarih || "-";

        }


        // =================================================
        // 12 FİYATI HESAPLA
        // =================================================

        hesapla(
            hasAltinSatis,
            hasAltinBozus
        );

    }
);


// =====================================================
// BAĞLANTI KESİLİRSE
// =====================================================

socket.on(
    "disconnect",
    () => {

        console.warn(
            "WebSocket bağlantısı kesildi"
        );

        connectionStatus.textContent =
            "Bağlantı kesildi";

        connectionStatus.className =
            "status error";

    }
);


// =====================================================
// BAĞLANTI HATASI
// =====================================================

socket.on(
    "connect_error",
    (error) => {

        console.error(
            "WebSocket bağlantı hatası:",
            error
        );

        connectionStatus.textContent =
            "Bağlantı hatası";

        connectionStatus.className =
            "status error";

    }
);


// =====================================================
// SERVICE WORKER
// =====================================================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "sw.js"
                )
                .then(
                    registration => {

                        console.log(
                            "Service Worker aktif:",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "Service Worker hatası:",
                            error
                        );

                    }
                );

        }
    );

}"use strict";


// =====================================================
// HAREM ALTIN SOCKET.IO BAĞLANTISI
// =====================================================

const socket = io(
    "https://hrmsocketonly.haremaltin.com",
    {
        transports: ["websocket"],
        path: "/socket.io/"
    }
);


// =====================================================
// KATSAYILAR
// =====================================================

const katsayilar = {

    ayar24: {
        satis: 1.015,
        bozus: 0.995
    },

    ayar22: {
        satis: 0.970,
        bozus: 0.910
    },

    ceyrekZiynet: {
        satis: 1.66,
        bozus: 1.60
    },

    ceyrekCumhuriyet: {
        satis: 1.71,
        bozus: 1.655
    },

    tamZiynet: {
        satis: 6.63,
        bozus: 6.37
    },

    tamCumhuriyet: {
        satis: 6.80,
        bozus: 6.61
    }

};


// =====================================================
// HTML ELEMANLARI
// =====================================================

const connectionStatus =
    document.getElementById("connectionStatus");

const updateTime =
    document.getElementById("updateTime");

const hasAltinPrice =
    document.getElementById("hasAltinPrice");


// =====================================================
// ÜRÜN FİYATLARINI FORMATLAMA
// En yakın 10 TL'ye yuvarlar
// Örnek: 6.272,75 TL → 6.270 TL
// =====================================================

function formatTL(value) {

    const roundedValue =
        Math.round(Number(value) / 10) * 10;

    return roundedValue.toLocaleString(
        "tr-TR"
    ) + " TL";

}


// =====================================================
// HAS ALTIN FİYATINI FORMATLAMA
// Has Altın olduğu gibi gösterilir
// Örnek: 6.180,05 TL → 6.180,05 TL
// =====================================================

function formatHasAltinTL(value) {

    return Number(value).toLocaleString(
        "tr-TR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " TL";

}


// =====================================================
// FİYAT GÖSTERME
// =====================================================

function setPrice(id, value) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    element.textContent =
        formatTL(value);

}


// =====================================================
// HAS ALTIN ÜZERİNDEN FİYAT HESAPLAMA
//
// SATIŞ:
// Has Altın SATIŞ fiyatı üzerinden
//
// BOZUŞ:
// Has Altın ALIŞ fiyatı üzerinden
//
// Hesaplama tam hassasiyetle yapılır.
// Yuvarlama sadece ekranda gösterilir.
// =====================================================

function hesapla(
    hasAltinSatis,
    hasAltinBozus
) {


    // =================================================
    // 24 AYAR
    // =================================================

    setPrice(
        "ayar24Satis",
        hasAltinSatis *
        katsayilar.ayar24.satis
    );

    setPrice(
        "ayar24Bozus",
        hasAltinBozus *
        katsayilar.ayar24.bozus
    );


    // =================================================
    // 22 AYAR
    // =================================================

    setPrice(
        "ayar22Satis",
        hasAltinSatis *
        katsayilar.ayar22.satis
    );

    setPrice(
        "ayar22Bozus",
        hasAltinBozus *
        katsayilar.ayar22.bozus
    );


    // =================================================
    // ÇEYREK ZİYNET
    // =================================================

    setPrice(
        "ceyrekZiynetSatis",
        hasAltinSatis *
        katsayilar.ceyrekZiynet.satis
    );

    setPrice(
        "ceyrekZiynetBozus",
        hasAltinBozus *
        katsayilar.ceyrekZiynet.bozus
    );


    // =================================================
    // ÇEYREK CUMHURİYET
    // =================================================

    setPrice(
        "ceyrekCumhuriyetSatis",
        hasAltinSatis *
        katsayilar.ceyrekCumhuriyet.satis
    );

    setPrice(
        "ceyrekCumhuriyetBozus",
        hasAltinBozus *
        katsayilar.ceyrekCumhuriyet.bozus
    );


    // =================================================
    // TAM ZİYNET
    // =================================================

    setPrice(
        "tamZiynetSatis",
        hasAltinSatis *
        katsayilar.tamZiynet.satis
    );

    setPrice(
        "tamZiynetBozus",
        hasAltinBozus *
        katsayilar.tamZiynet.bozus
    );


    // =================================================
    // TAM CUMHURİYET
    // =================================================

    setPrice(
        "tamCumhuriyetSatis",
        hasAltinSatis *
        katsayilar.tamCumhuriyet.satis
    );

    setPrice(
        "tamCumhuriyetBozus",
        hasAltinBozus *
        katsayilar.tamCumhuriyet.bozus
    );

}


// =====================================================
// SOCKET.IO BAĞLANTISI
// =====================================================

socket.on("connect", () => {

    console.log(
        "HAREM ALTIN WEBSOCKET BAĞLANTISI BAŞARILI"
    );

    connectionStatus.textContent =
        "Bağlandı";

    connectionStatus.className =
        "status connected";

});


// =====================================================
// FİYAT DEĞİŞİKLİĞİ
// =====================================================

socket.on("price_changed", (response) => {

    console.log(
        "YENİ FİYAT VERİSİ GELDİ:",
        response
    );


    // =================================================
    // VERİ KONTROLÜ
    // =================================================

    if (
        !response ||
        !response.data ||
        !response.data.ALTIN
    ) {

        console.warn(
            "ALTIN verisi bulunamadı"
        );

        return;

    }


    // =================================================
    // ALTIN VERİSİNİ AL
    // =================================================

    const altin =
        response.data.ALTIN;


    // =================================================
    // HAS ALTIN SATIŞ FİYATI
    // Harem Altın "satis" alanı
    // =================================================

    const hasAltinSatis =
        Number(altin.satis);


    // =================================================
    // HAS ALTIN BOZUŞ FİYATI
    // Harem Altın "alis" alanı
    // =================================================

    const hasAltinBozus =
        Number(altin.alis);


    // =================================================
    // FİYAT KONTROLÜ
    // =================================================

    if (
        !Number.isFinite(hasAltinSatis) ||
        !Number.isFinite(hasAltinBozus)
    ) {

        console.error(
            "Geçersiz has altın fiyatı:",
            {
                satis: altin.satis,
                alis: altin.alis
            }
        );

        return;

    }


    // =================================================
    // HAS ALTIN SATIŞ FİYATINI GÖSTER
    //
    // ÖNEMLİ:
    // Burada yuvarlama yapılmaz.
    // Gelen fiyat olduğu gibi gösterilir.
    // =================================================

    hasAltinPrice.textContent =
        formatHasAltinTL(
            hasAltinSatis
        );


    // =================================================
    // SON GÜNCELLEME
    // =================================================

    updateTime.textContent =
        altin.tarih || "-";


    // =================================================
    // 12 FİYATI HESAPLA
    // =================================================

    hesapla(
        hasAltinSatis,
        hasAltinBozus
    );

});


// =====================================================
// BAĞLANTI KESİLİRSE
// =====================================================

socket.on("disconnect", () => {

    console.warn(
        "WebSocket bağlantısı kesildi"
    );

    connectionStatus.textContent =
        "Bağlantı kesildi";

    connectionStatus.className =
        "status error";

});


// =====================================================
// BAĞLANTI HATASI
// =====================================================

socket.on("connect_error", (error) => {

    console.error(
        "WebSocket bağlantı hatası:",
        error
    );

    connectionStatus.textContent =
        "Bağlantı hatası";

    connectionStatus.className =
        "status error";

});


// =====================================================
// SERVICE WORKER
// =====================================================

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker.register(
                "sw.js"
            )
            .then(
                registration => {

                    console.log(
                        "Service Worker aktif:",
                        registration.scope
                    );

                }
            )
            .catch(
                error => {

                    console.error(
                        "Service Worker hatası:",
                        error
                    );

                }
            );

        }
    );

}
