"use strict";

// =====================================================
// PAZAR KUYUMCULAR
// CANLI ALTIN FİYAT HESAPLAMA
// =====================================================

// =====================================================
// KATSAYILAR
// =====================================================

const katsayilar = {

```
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
```

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

const hasAltinBozusPrice =
document.getElementById("hasAltinBozusPrice");

// =====================================================
// BAĞLANTI DURUMUNU GÜNCELLE
// =====================================================

function setConnectionStatus(
text,
className
) {

```
if (!connectionStatus) {
    return;
}

connectionStatus.textContent =
    text;

connectionStatus.className =
    "status " + className;
```

}

// =====================================================
// ÜRÜN FİYATI FORMATLAMA
// En yakın 10 TL'ye yuvarlanır.
// =====================================================

function formatTL(value) {

```
const number =
    Number(value);

if (!Number.isFinite(number)) {
    return "-";
}

const roundedValue =
    Math.round(number / 10) * 10;

return roundedValue.toLocaleString(
    "tr-TR"
) + " TL";
```

}

// =====================================================
// HAS ALTIN FİYATI FORMATLAMA
// Kuruşlarıyla gösterilir.
// =====================================================

function formatHasAltinTL(value) {

```
const number =
    Number(value);

if (!Number.isFinite(number)) {
    return "-";
}

return number.toLocaleString(
    "tr-TR",
    {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }
) + " TL";
```

}

// =====================================================
// FİYAT GÖSTER
// =====================================================

function setPrice(
id,
value
) {

```
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
```

}

// =====================================================
// FİYATLARI HESAPLA
// =====================================================

function hesapla(
hasAltinSatis,
hasAltinBozus
) {

```
// 24 AYAR

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


// 22 AYAR

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


// ZİYNET ÇEYREK

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


// ATA ÇEYREK

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


// TAM ZİYNET

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


// ATA TAM

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
```

}

// =====================================================
// SOCKET.IO KONTROLÜ
// =====================================================

if (
typeof io !== "function"
) {

```
console.error(
    "Socket.IO yüklenemedi."
);

setConnectionStatus(
    "Socket.IO yüklenemedi",
    "error"
);
```

} else {

```
// =================================================
// SOCKET.IO BAĞLANTISI
// =================================================

const socket = io(
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
        reconnectionDelayMax: 10000,
        timeout: 10000
    }
);


// =================================================
// BAŞLANGIÇ
// =================================================

setConnectionStatus(
    "Bağlanıyor...",
    "waiting"
);


// =================================================
// BAĞLANTI BAŞARILI
// =================================================

socket.on(
    "connect",
    function () {

        console.log(
            "HAREM ALTIN SOCKET.IO BAĞLANTISI BAŞARILI"
        );

        console.log(
            "Socket ID:",
            socket.id
        );

        console.log(
            "Transport:",
            socket.io.engine.transport.name
        );

        setConnectionStatus(
            "Bağlandı",
            "connected"
        );

    }
);


// =================================================
// FİYAT VERİSİ
// =================================================

socket.on(
    "price_changed",
    function (response) {

        console.log(
            "HAREM ALTIN FİYAT VERİSİ:",
            response
        );


        if (
            !response ||
            !response.data ||
            !response.data.ALTIN
        ) {

            console.warn(
                "Gelen veride ALTIN bilgisi bulunamadı:",
                response
            );

            return;
        }


        const altin =
            response.data.ALTIN;


        const hasAltinSatis =
            Number(
                altin.satis
            );


        const hasAltinBozus =
            Number(
                altin.alis
            );


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


        // HAS ALTIN SATIŞ

        if (hasAltinPrice) {

            hasAltinPrice.textContent =
                formatHasAltinTL(
                    hasAltinSatis
                );

        }


        // HAS ALTIN ALIŞ

        if (hasAltinBozusPrice) {

            hasAltinBozusPrice.textContent =
                formatHasAltinTL(
                    hasAltinBozus
                );

        }


        // SON GÜNCELLEME

        if (updateTime) {

            updateTime.textContent =
                altin.tarih || "-";

        }


        // ÜRÜN FİYATLARI

        hesapla(
            hasAltinSatis,
            hasAltinBozus
        );

    }
);


// =================================================
// TÜM SOCKET EVENTLERİNİ GÖSTER
// =================================================

socket.onAny(
    function (
        eventName,
        ...args
    ) {

        console.log(
            "[SOCKET EVENT]",
            eventName,
            args
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
            "Socket.IO bağlantısı kesildi:",
            reason
        );

        setConnectionStatus(
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
            "HAREM ALTIN SOCKET.IO BAĞLANTI HATASI"
        );

        console.error(
            "Mesaj:",
            error.message
        );

        console.error(
            "Açıklama:",
            error.description
        );

        console.error(
            "Context:",
            error.context
        );

        setConnectionStatus(
            "Bağlantı hatası",
            "error"
        );

    }
);


// =================================================
// YENİDEN BAĞLANMA DENEMESİ
// =================================================

socket.io.on(
    "reconnect_attempt",
    function (attempt) {

        console.warn(
            "Yeniden bağlanılıyor. Deneme:",
            attempt
        );

        setConnectionStatus(
            "Yeniden bağlanıyor...",
            "waiting"
        );

    }
);


// =================================================
// YENİDEN BAĞLANDI
// =================================================

socket.io.on(
    "reconnect",
    function (attempt) {

        console.log(
            "Socket.IO yeniden bağlandı.",
            attempt
        );

        setConnectionStatus(
            "Bağlandı",
            "connected"
        );

    }
);
```

}

// =====================================================
// SERVICE WORKER
// =====================================================

if (
"serviceWorker" in navigator
) {

```
window.addEventListener(
    "load",
    function () {

        navigator.serviceWorker
            .register(
                "sw.js"
            )
            .then(
                function (registration) {

                    console.log(
                        "Service Worker aktif:",
                        registration.scope
                    );

                }
            )
            .catch(
                function (error) {

                    console.error(
                        "Service Worker kayıt hatası:",
                        error
                    );

                }
            );

    }
);
```

}
