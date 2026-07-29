"use strict";

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

const connectionStatus =
document.getElementById("connectionStatus");

const updateTime =
document.getElementById("updateTime");

const hasAltinPrice =
document.getElementById("hasAltinPrice");

const hasAltinBozusPrice =
document.getElementById("hasAltinBozusPrice");

function durumYaz(mesaj, sinif) {

```
if (!connectionStatus) {
    return;
}

connectionStatus.textContent =
    mesaj;

connectionStatus.className =
    "status " + sinif;
```

}

function formatTL(deger) {

```
const sayi =
    Number(deger);

if (!Number.isFinite(sayi)) {
    return "-";
}

const yuvarlanmis =
    Math.round(sayi / 10) * 10;

return (
    yuvarlanmis.toLocaleString("tr-TR") +
    " TL"
);
```

}

function formatHasAltin(deger) {

```
const sayi =
    Number(deger);

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
    ) +
    " TL"
);
```

}

function fiyatYaz(id, deger) {

```
const element =
    document.getElementById(id);

if (!element) {
    return;
}

element.textContent =
    formatTL(deger);
```

}

function hesapla(satis, alis) {

```
fiyatYaz(
    "ayar24Satis",
    satis *
    katsayilar.ayar24.satis
);

fiyatYaz(
    "ayar24Bozus",
    alis *
    katsayilar.ayar24.bozus
);


fiyatYaz(
    "ayar22Satis",
    satis *
    katsayilar.ayar22.satis
);

fiyatYaz(
    "ayar22Bozus",
    alis *
    katsayilar.ayar22.bozus
);


fiyatYaz(
    "ceyrekZiynetSatis",
    satis *
    katsayilar.ceyrekZiynet.satis
);

fiyatYaz(
    "ceyrekZiynetBozus",
    alis *
    katsayilar.ceyrekZiynet.bozus
);


fiyatYaz(
    "ceyrekCumhuriyetSatis",
    satis *
    katsayilar.ceyrekCumhuriyet.satis
);

fiyatYaz(
    "ceyrekCumhuriyetBozus",
    alis *
    katsayilar.ceyrekCumhuriyet.bozus
);


fiyatYaz(
    "tamZiynetSatis",
    satis *
    katsayilar.tamZiynet.satis
);

fiyatYaz(
    "tamZiynetBozus",
    alis *
    katsayilar.tamZiynet.bozus
);


fiyatYaz(
    "tamCumhuriyetSatis",
    satis *
    katsayilar.tamCumhuriyet.satis
);

fiyatYaz(
    "tamCumhuriyetBozus",
    alis *
    katsayilar.tamCumhuriyet.bozus
);
```

}

function baslat() {

```
console.log(
    "Pazar Kuyumcular başlatılıyor..."
);


if (
    typeof io !== "function"
) {

    console.error(
        "Socket.IO yüklenmedi!"
    );

    durumYaz(
        "Socket.IO yüklenmedi",
        "error"
    );

    return;
}


console.log(
    "Socket.IO bulundu."
);


const socket =
    io(
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


durumYaz(
    "Bağlanıyor...",
    "waiting"
);


socket.on(
    "connect",
    function() {

        console.log(
            "HAREM ALTIN BAĞLANTISI BAŞARILI"
        );

        console.log(
            "Socket ID:",
            socket.id
        );

        durumYaz(
            "Bağlandı",
            "connected"
        );
    }
);


socket.on(
    "price_changed",
    function(response) {

        console.log(
            "FİYAT VERİSİ GELDİ:",
            response
        );


        if (
            !response ||
            !response.data ||
            !response.data.ALTIN
        ) {

            console.warn(
                "ALTIN verisi bulunamadı.",
                response
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
                "Geçersiz fiyat:",
                altin
            );

            return;
        }


        if (
            hasAltinPrice
        ) {

            hasAltinPrice.textContent =
                formatHasAltin(
                    satis
                );
        }


        if (
            hasAltinBozusPrice
        ) {

            hasAltinBozusPrice.textContent =
                formatHasAltin(
                    alis
                );
        }


        if (
            updateTime
        ) {

            updateTime.textContent =
                altin.tarih ||
                "-";
        }


        hesapla(
            satis,
            alis
        );
    }
);


socket.on(
    "disconnect",
    function(reason) {

        console.warn(
            "Socket bağlantısı kesildi:",
            reason
        );

        durumYaz(
            "Bağlantı kesildi",
            "error"
        );
    }
);


socket.on(
    "connect_error",
    function(error) {

        console.error(
            "SOCKET.IO BAĞLANTI HATASI:",
            error
        );

        console.error(
            "Hata mesajı:",
            error.message
        );

        durumYaz(
            "Bağlantı hatası",
            "error"
        );
    }
);
```

}

if (
document.readyState ===
"loading"
) {

```
document.addEventListener(
    "DOMContentLoaded",
    baslat
);
```

} else {

```
baslat();
```

}
