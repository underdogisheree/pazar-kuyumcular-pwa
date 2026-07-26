"use strict";


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
        bozus: 1.01
    },

    ayar22: {
        satis: 0.965,
        bozus: 0.910
    },

    ceyrekZiynet: {
        satis: 1.66,
        bozus: 1.60
    },

    ceyrekCumhuriyet: {
        satis: 1.71,
        bozus: 1.61
    },

    tamZiynet: {
        satis: 6.59,
        bozus: 6.36
    },

    tamCumhuriyet: {
        satis: 6.78,
        bozus: 6.60
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
// PARA FORMATLAMA
// =====================================================

function formatTL(value) {

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
// =====================================================

function hesapla(hasAltinSatis) {


    // 24 AYAR

    setPrice(
        "ayar24Satis",
        hasAltinSatis *
        katsayilar.ayar24.satis
    );

    setPrice(
        "ayar24Bozus",
        hasAltinSatis *
        katsayilar.ayar24.bozus
    );


    // 22 AYAR

    setPrice(
        "ayar22Satis",
        hasAltinSatis *
        katsayilar.ayar22.satis
    );

    setPrice(
        "ayar22Bozus",
        hasAltinSatis *
        katsayilar.ayar22.bozus
    );


    // ÇEYREK ZİYNET

    setPrice(
        "ceyrekZiynetSatis",
        hasAltinSatis *
        katsayilar.ceyrekZiynet.satis
    );

    setPrice(
        "ceyrekZiynetBozus",
        hasAltinSatis *
        katsayilar.ceyrekZiynet.bozus
    );


    // ÇEYREK CUMHURİYET

    setPrice(
        "ceyrekCumhuriyetSatis",
        hasAltinSatis *
        katsayilar.ceyrekCumhuriyet.satis
    );

    setPrice(
        "ceyrekCumhuriyetBozus",
        hasAltinSatis *
        katsayilar.ceyrekCumhuriyet.bozus
    );


    // TAM ZİYNET

    setPrice(
        "tamZiynetSatis",
        hasAltinSatis *
        katsayilar.tamZiynet.satis
    );

    setPrice(
        "tamZiynetBozus",
        hasAltinSatis *
        katsayilar.tamZiynet.bozus
    );


    // TAM CUMHURİYET

    setPrice(
        "tamCumhuriyetSatis",
        hasAltinSatis *
        katsayilar.tamCumhuriyet.satis
    );

    setPrice(
        "tamCumhuriyetBozus",
        hasAltinSatis *
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


    // ALTIN verisini al

    const altin =
        response.data.ALTIN;


    // Has altın SATIŞ fiyatı

    const hasAltinSatis =
        Number(altin.satis);


    if (
        !Number.isFinite(hasAltinSatis)
    ) {

        console.error(
            "Geçersiz has altın fiyatı:",
            altin.satis
        );

        return;

    }


    // Has altın fiyatını göster

    hasAltinPrice.textContent =
        formatTL(hasAltinSatis);


    // Son güncelleme

    updateTime.textContent =
        altin.tarih || "-";


    // 12 fiyatı hesapla

    hesapla(
        hasAltinSatis
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