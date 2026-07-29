"use strict";

// =====================================================
// KATSAYILAR
// =====================================================

const katsayilar = {
ayar24: {
satis: 1.015,
bozus: 0.995
},

```
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
```

};

// =====================================================
// HTML ELEMANLARI
// =====================================================

const connectionStatus = document.getElementById(
"connectionStatus"
);

const updateTime = document.getElementById(
"updateTime"
);

const hasAltinPrice = document.getElementById(
"hasAltinPrice"
);

const hasAltinBozusPrice = document.getElementById(
"hasAltinBozusPrice"
);

// =====================================================
// BAĞLANTI DURUMU
// =====================================================

function baglantiDurumu(
mesaj,
sinif
) {
if (!connectionStatus) {
return;
}

```
connectionStatus.textContent = mesaj;

connectionStatus.className =
    "status " + sinif;
```

}

// =====================================================
// FİYAT FORMATLAMA
// =====================================================

function formatTL(deger) {

```
const sayi = Number(deger);

if (!Number.isFinite(sayi)) {
    return "-";
}

const yuvarlanmis =
    Math.round(sayi / 10) * 10;

return (
    yuvarlanmis.toLocaleString(
        "tr-TR"
    ) + " TL"
);
```

}

// =====================================================
// HAS ALTIN FORMATLAMA
// =====================================================

function formatHasAltinTL(deger) {

```
const sayi = Number(deger);

if (!Number.isFinite(sayi)) {
    return "-";
}

return (
    sayi.toLocaleString(
        "tr-TR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " TL"
);
```

}

// =====================================================
// FİYATI HTML'E YAZ
// =====================================================

function fiyatYaz(
elementId,
deger
) {

```
const element =
    document.getElementById(
        elementId
    );

if (!element) {

    console.warn(
        "HTML elementi bulunamadı:",
        elementId
    );

    return;
}

element.textContent =
    formatTL(deger);
```

}

// =====================================================
// TÜM FİYATLARI HESAPLA
// =====================================================

function fiyatlariHesapla(
hasAltinSatis,
hasAltinBozus
) {

```
// 24 AYAR

fiyatYaz(
    "ayar24Satis",
    hasAltinSatis *
    katsayilar.ayar24.satis
);

fiyatYaz(
    "ayar24Bozus",
    hasAltinBozus *
    katsayilar.ayar24.bozus
);


// 22 AYAR

fiyatYaz(
    "ayar22Satis",
    hasAltinSatis *
    katsayilar.ayar22.satis
);

fiyatYaz(
    "ayar22Bozus",
    hasAltinBozus *
    katsayilar.ayar22.bozus
);


// ZİYNET ÇEYREK

fiyatYaz(
    "ceyrekZiynetSatis",
    hasAltinSatis *
    katsayilar.ceyrekZiynet.satis
);

fiyatYaz(
    "ceyrekZiynetBozus",
    hasAltinBozus *
    katsayilar.ceyrekZiynet.bozus
);


// ATA ÇEYREK

fiyatYaz(
    "ceyrekCumhuriyetSatis",
    hasAltinSatis *
    katsayilar.ceyrekCumhuriyet.satis
);

fiyatYaz(
    "ceyrekCumhuriyetBozus",
    hasAltinBozus *
    katsayilar.ceyrekCumhuriyet.bozus
);


// TAM ZİYNET

fiyatYaz(
    "tamZiynetSatis",
    hasAltinSatis *
    katsayilar.tamZiynet.satis
);

fiyatYaz(
    "tamZiynetBozus",
    hasAltinBozus *
    katsayilar.tamZiynet.bozus
);


// ATA TAM

fiyatYaz(
    "tamCumhuriyetSatis",
    hasAltinSatis *
    katsayilar.tamCumhuriyet.satis
);

fiyatYaz(
    "tamCumhuriyetBozus",
    hasAltinBozus *
    katsayilar.tamCumhuriyet.bozus
);
```

}

// =====================================================
// UYGULAMA BAŞLAT
// =====================================================

function uygulamayiBaslat() {

```
console.log(
    "Pazar Kuyumcular uygulaması başlatılıyor..."
);


// Socket.IO yüklenmiş mi?

if (
    typeof window.io !== "function"
) {

    console.error(
        "Socket.IO bulunamadı."
    );

    baglantiDurumu(
        "Socket.IO yüklenemedi",
        "error"
    );

    return;
}


console.log(
    "Socket.IO hazır."
);


// =================================================
// SOCKET.IO BAĞLANTISI
// =================================================

const socket = window.io(
    "https://hrmsocketonly.haremaltin.com",
    {
        path: "/socket.io/",
        transports: [
            "polling",
            "websocket"
        ],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
        timeout: 10000
    }
);


baglantiDurumu(
    "Bağlanıyor...",
    "waiting"
);


// =================================================
// BAĞLANDI
// =================================================

socket.on(
    "connect",
    function () {

        console.log(
            "================================="
        );

        console.log(
            "HAREM ALTIN BAĞLANTISI BAŞARILI"
        );

        console.log(
            "Socket ID:",
            socket.id
        );

        console.log(
            "================================="
        );

        baglantiDurumu(
            "Bağlandı",
            "connected"
        );
    }
);


// =================================================
// FİYAT DEĞİŞTİ
// =================================================

socket.on(
    "price_changed",
    function (response) {

        console.log(
            "Fiyat verisi geldi:",
            response
        );


        if (
            !response ||
            !response.data ||
            !response.data.ALTIN
        ) {

            console.warn(
                "ALTIN verisi bulunamadı."
            );

            return;
        }


        const altin =
            response.data.ALTIN;


        const satis =
            Number(
                altin.satis
            );


        const alis =
            Number(
                altin.alis
            );


        if (
            !Number.isFinite(satis) ||
            !Number.isFinite(alis)
        ) {

            console.error(
                "Geçersiz fiyat verisi:",
                altin
            );

            return;
        }


        // HAS ALTIN SATIŞ

        if (hasAltinPrice) {

            hasAltinPrice.textContent =
                formatHasAltinTL(
                    satis
                );
        }


        // HAS ALTIN ALIŞ

        if (hasAltinBozusPrice) {

            hasAltinBozusPrice.textContent =
                formatHasAltinTL(
                    alis
                );
        }


        // SON GÜNCELLEME

        if (updateTime) {

            updateTime.textContent =
                altin.tarih || "-";
        }


        // ÜRÜN FİYATLARI

        fiyatlariHesapla(
            satis,
            alis
        );
    }
);


// =================================================
// BAĞLANTI KESİLDİ
// =================================================

socket.on(
    "disconnect",
    function (reason) {

        console.warn(
            "Bağlantı kesildi:",
            reason
        );

        baglantiDurumu(
            "Bağlantı kesildi",
            "error"
        );
    }
);


// =================================================
// BAĞLANTI HATASI
// =================================================

socket.on(
    "connect_error",
    function (error) {

        console.error(
            "SOCKET.IO BAĞLANTI HATASI:",
            error
        );

        console.error(
            "Hata mesajı:",
            error.message
        );

        baglantiDurumu(
            "Bağlantı hatası",
            "error"
        );
    }
);
```

}

// =====================================================
// SAYFA YÜKLENDİKTEN SONRA BAŞLAT
// =====================================================

if (
document.readyState === "loading"
) {

```
document.addEventListener(
    "DOMContentLoaded",
    uygulamayiBaslat
);
```

} else {

```
uygulamayiBaslat();
```

}
