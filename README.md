# GalleriFruB

Hjemmeside for kunstneren Camilla Blauenfeldt (FruB).

**Live:** https://gallerifrub.dk  
**Admin:** https://gallerifrub.dk/admin  
**Alias:** https://camillablauenfeldt.dk → redirecter til gallerifrub.dk

---

## Stack

- **Runtime:** Node.js + Express
- **Proces:** PM2 (`pm2 start server.js --name frub`)
- **Webserver:** Nginx (reverse proxy, SSL)
- **SSL:** Let's Encrypt via Certbot
- **Hosting:** Hostinger VPS — 187.124.187.149 (Ubuntu 24.04)
- **Kode:** GitHub → github.com/andersblauenfeldt/gallerifrub
- **Port:** 3001 (intern)

---

## Struktur

```
/var/www/frub-app/
├── server.js           # Al serverlogik (routes, admin, rendering)
├── i18n.js             # Oversættelser (dansk/engelsk)
├── package.json
├── data/
│   ├── paintings.json  # Malerier
│   ├── mixed.json      # Mixed media
│   └── news.json       # Nyheder
└── public/
    ├── images/         # Alle uploadede billeder
    │   ├── news/       # Nyhedsbilleder
    │   ├── process/    # Procesbilleder (om-siden)
    │   └── contact/    # Kontaktsidebilleder
    └── videos/
        └── passion_video.mp4
```

> **Note:** `data/`, `public/images/`, `public/videos/` og `node_modules/` er ekskluderet fra Git. Disse lever kun på serveren.

---

## Admin

**URL:** https://gallerifrub.dk/admin  
**Password:** frub203024 (case-insensitiv)

### Funktioner
- Tilføj, rediger og slet malerier og mixed media-værker
- Upload op til 3 billeder per værk:
  - **Maleri-billede** — primært produktfoto
  - **Billede i rum** — AI-genereret visualisering (uploades manuelt)
  - **I sit nye hjem** — rigtigt foto hos den nye ejer
- Træk-og-slip sortering af værker
- Tilføj og rediger nyheder med billede
- Auto-oversættelse af beskrivelser (dansk → engelsk) via MyMemory API

### Billedvisning på værkside
Knapper skifter mellem "Værk" og "Visualisering"/"I sit nye hjem":
- Har værket et *I sit nye hjem*-billede, vises knappen "I sit nye hjem" med teksten *"Billede venligst udlånt af den heldige ejer"*
- Har værket kun et rum-billede, vises "Visualisering" med teksten *"AI-genereret visualisering"*

---

## Sider

| URL | Indhold |
|-----|---------|
| `/` | Forside — hero, udvalgte malerier, mixed media, nyheder, Instagram |
| `/malerier` | Alle malerier |
| `/mixed-media` | Alle mixed media-værker |
| `/vaerk/:slug` | Enkelt værk med billeder, beskrivelse, forespørgsel |
| `/om` | Om Camilla — tekst, procesbilleder, video |
| `/nyheder` | Nyhedsoversigt + Instagram-feed |
| `/nyhed/:id` | Enkelt nyhed |
| `/kontakt` | Kontaktoplysninger + fotogrid |
| `/admin` | Admin-interface (kræver login) |

---

## Sprog

Sitet er tosprogligt (dansk/engelsk). Sprog vælges via URL-prefix:
- `/` → dansk
- `/en/` → engelsk

Alle tekster styres via `i18n.js`.

---

## Email

Transaktionsmails sendes via **Brevo API**.  
Afsender: anders@blauenfeldt.dk  
API-nøgle: gemt hos Anders (ikke i kode/repo).

---

## Nginx

Konfiguration: `/etc/nginx/sites-available/gallerifrub`

- HTTP → HTTPS redirect
- `www.gallerifrub.dk` → `gallerifrub.dk`
- `camillablauenfeldt.dk` → `gallerifrub.dk`
- Proxy til localhost:3001

SSL-certifikat: `/etc/letsencrypt/live/gallerifrub.dk/`  
Udløber: 2026-07-10 (auto-fornyes via Certbot)

---

## Deployment

```bash
# Upload ændringer
scp server.js root@187.124.187.149:/var/www/frub-app/

# Syntakstjek
node --check /var/www/frub-app/server.js

# Genstart
pm2 restart frub

# Nginx reload
/usr/sbin/nginx -s reload
```

---

## Data-format

### paintings.json / mixed.json
```json
{
  "id": "p1",
  "title": "Titel på værk",
  "image": "filnavn.jpg",
  "imageRoom": "filnavn-room.jpg",
  "imageCustomer": "filnavn-customer.jpg",
  "medium": "Olie på lærred",
  "width_cm": 80,
  "height_cm": 100,
  "size": "100×80 cm",
  "year": 2024,
  "price": 8500,
  "status": "for-sale",
  "description": "Dansk beskrivelse",
  "descriptionEn": "English description"
}
```

**Status-værdier:** `for-sale` · `sold` · `not-for-sale`

### news.json
```json
{
  "id": "n1",
  "title": "Titel",
  "titleEn": "Title",
  "date": "2024-03-15",
  "tag": "udstilling",
  "image": "filnavn.jpg",
  "text": "Dansk tekst",
  "textEn": "English text"
}
```

**Tag-værdier:** `atelier` · `udstilling` · `inspiration` · `presse` · `andet`

---

## Kontakt

- **Camilla Blauenfeldt** — camilla@blauenfeldt.dk
- **Anders Blauenfeldt** — anders@blauenfeldt.dk (teknisk ansvarlig)
