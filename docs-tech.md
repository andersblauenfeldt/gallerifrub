# GalleriFruB — Teknisk Setup

> Sidst opdateret: april 2026

---

## Overblik

| Parameter | Værdi |
|-----------|-------|
| Live URL | https://gallerifrub.dk |
| Alias | https://camillablauenfeldt.dk → 301 redirect |
| App-mappe | /var/www/frub-app/ |
| Runtime | Node.js + Express (server.js, 1600+ linjer) |
| Prosesstyring | PM2 (`pm2 start server.js --name frub`) |
| Intern port | 3001 |
| Webserver | Nginx (reverse proxy + SSL) |
| SSL | Let's Encrypt via Certbot, udløber 2026-07-10 (auto-renew) |
| Hosting | Hostinger VPS — 187.124.187.149 (Ubuntu 24.04 LTS, 8GB RAM, 96GB disk) |
| GitHub | github.com/andersblauenfeldt/gallerifrub |

---

## Filstruktur på server

```
/var/www/frub-app/
├── server.js              # Al serverlogik (routes, rendering, admin)
├── i18n.js                # Oversættelsesstrenge (dansk/engelsk)
├── package.json
├── data/                  # IKKE i Git
│   ├── paintings.json     # Malerier
│   ├── mixed.json         # Mixed media
│   └── news.json          # Nyheder
├── public/                # IKKE i Git
│   ├── images/            # Alle billeder
│   │   ├── (rod)          # Værkbilleder + rum-visualiseringer
│   │   ├── news/          # Nyhedsbilleder
│   │   ├── process/       # Procesbilleder (extra-01.jpg til extra-62.jpg)
│   │   └── contact/       # Kontaktside-billeder (extra-01.jpg til extra-62.jpg)
│   └── videos/
│       └── passion_video.mp4
├── make_room.py           # Genererer rum-visualiseringer (malerier)
├── make_room_mixed.py     # Genererer rum-visualiseringer (mixed media)
├── pinterest-pins.md      # Pinterest pin-tekster
├── pr-medier.md           # PR og medie-noter
├── udstillinger.md        # Udstillingsoversigt
└── node_modules/          # IKKE i Git
```

> **Vigtig note:** `data/`, `public/` og `node_modules/` er i `.gitignore` og lever kun på serveren. Backup sker ikke automatisk.

---

## Stack og afhængigheder

| Pakke | Version | Formål |
|-------|---------|--------|
| express | ^5.2.1 | HTTP-server og routing |
| express-session | ^1.19.0 | Admin session/cookie |
| multer | ^2.1.1 | Fil-upload (billeder) |

Ingen build-step. Alt rendering sker server-side som rå HTML-strenge i JavaScript (template literals).

---

## Routing

| Metode | URL | Beskrivelse |
|--------|-----|-------------|
| GET | / | Forside |
| GET | /malerier | Alle malerier |
| GET | /mixed-media | Alle mixed media |
| GET | /vaerk/:slug | Enkelt værk |
| GET | /om | Om Camilla |
| GET | /nyheder | Nyhedsside + Instagram |
| GET | /nyhed/:id | Enkelt nyhed |
| GET | /kontakt | Kontaktside |
| GET | /sitemap.xml | Sitemap til SEO |
| GET | /robots.txt | Robots-fil |
| GET | /admin | Admin (kræver login) |
| POST | /admin/login | Login |
| GET | /admin/logout | Logout |
| POST | /admin/add | Tilføj værk |
| POST | /admin/delete | Slet værk |
| GET | /admin/painting/edit/:id | Rediger værk |
| POST | /admin/painting/update | Gem ændringer |
| POST | /admin/reorder | Gem sorteringsrækkefølge |
| POST | /admin/painting/delete-image | Slet enkelt billede fra værk |
| GET | /admin/news/edit/:id | Rediger nyhed |
| POST | /admin/news/update | Gem nyhedsændringer |
| POST | /admin/news/add | Tilføj nyhed |
| POST | /admin/news/delete | Slet nyhed |
| POST | /admin/news/delete-image | Slet nyhedsbillede |
| POST | /admin/translate | Auto-oversæt beskrivelse (MyMemory API) |

---

## Sprog (i18n)

Tosprogligt: dansk (standard) og engelsk.

- Sprog gemmes i session (`req.session.lang`)
- Skiftes via `?lang=da` eller `?lang=en` i URL (sætter session, redirecter til ren URL)
- Alle UI-strenge i `i18n.js`
- Engelske URL-prefix: `/en/` vises **ikke** — sproget sættes via session, ikke URL-path

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
  "descriptionEn": "English description",
  "slug": "auto-genereret-fra-titel"
}
```

**Status-værdier:** `for-sale` · `sold` · `not-for-sale`

### news.json

```json
{
  "id": "n1",
  "title": "Titel",
  "titleEn": "Title",
  "date": "2026-03-28",
  "tag": "udstilling",
  "image": "filnavn.jpg",
  "text": "Dansk tekst",
  "textEn": "English text"
}
```

**Tag-værdier:** `atelier` · `udstilling` · `inspiration` · `presse` · `andet`

---

## Billedbehandling

- Upload via admin-interface (multer)
- HEIC/HEIF auto-konverteres til JPEG med `heif-convert` (CLI-tool på serveren)
- Rum-visualiseringer genereres manuelt med Python-scripts:
  - `make_room.py` — stue-baggrund (til malerier)
  - `make_room_mixed.py` — entré-baggrund (til mixed media)
  - Scriptsene placerer værk-billedet oven på en baggrundsskabelon og gemmer som `*-room.jpg`

---

## Admin

- **URL:** https://gallerifrub.dk/admin
- **Password:** frub203024 (case-insensitiv, hardkodet i server.js)
- Session-baseret login med `express-session`
- Ingen brugerdatabase

### Funktioner
- Tilføj/rediger/slet malerier og mixed media-værker
- Upload op til 3 billeder per værk (værkbillede, rum-visualisering, kundebillede)
- Træk-og-slip-sortering (drag & drop via HTML5)
- Tilføj/rediger/slet nyheder med billede
- Auto-oversættelse dansk → engelsk via MyMemory API (gratis, ingen nøgle)

---

## Nginx-konfiguration

Fil: `/etc/nginx/sites-available/gallerifrub`

- HTTP → HTTPS redirect (301)
- `www.gallerifrub.dk` → `gallerifrub.dk` (301)
- `camillablauenfeldt.dk` og `www.camillablauenfeldt.dk` → `gallerifrub.dk` (301)
- Proxy: `localhost:3001`

SSL: `/etc/letsencrypt/live/gallerifrub.dk/` — auto-fornyes med Certbot.

---

## Email (Brevo)

- Udbyder: Brevo (transaktionsmails)
- Afsender: anders@blauenfeldt.dk
- API-nøgle: se MEMORY.md
- Bruges til: forespørgsler fra besøgende via kontaktformular på enkeltværk-sider

---

## Analytics

- **GA4:** Property 521503542, Tag ID: G-5NMKWW600Y
- **Status:** Tag er IKKE pt. implementeret i server.js (mangler gtag-snippet i `<head>`)
- **Service account:** /root/.openclaw/ga-service-account.json
- **TODO:** Indsæt GA4-snippet i den globale `<head>`-funktion i server.js

---

## Tredjeparts-integrationer

| Service | Formål | Detaljer |
|---------|--------|---------|
| Fouita/Instagram | Instagram feed-widget | Widget ID: `ftxw51yj3`, script: `0x41d230.js` |
| MyMemory API | Auto-oversættelse | Gratis, ingen API-nøgle |
| Brevo | Transaktionsmails | Se email-sektion |
| Google Fonts | Typografi | Cormorant Garamond + Inter (CDN) |
| Let's Encrypt | SSL-certifikat | Auto-fornyes med Certbot |

---

## Deployment

```bash
# Upload enkelt fil
scp server.js root@187.124.187.149:/var/www/frub-app/

# Syntakstjek (ALTID før restart)
node --check /var/www/frub-app/server.js

# Genstart app
pm2 restart frub

# Nginx reload
/usr/sbin/nginx -s reload

# PM2 status
pm2 status

# Log
pm2 logs frub --lines 50
```

> **Regel:** Kør altid `node --check` inden `pm2 restart`. Aldrig deploy med syntaksfejl.

---

## SEO

- `/sitemap.xml` genereres dynamisk — inkluderer alle /vaerk/-sider
- `/robots.txt` tillader al crawling
- Open Graph-tags på alle sider (title, description, og — på værkside — billede)

---

## Kendte begrænsninger / TODO

- `server.js` er monolitisk (~1600 linjer). Refaktorering til `routes/`-moduler er planlagt.
- GA4-snippet mangler i HTML-output.
- Ingen automatisk backup af `data/` eller `public/images/`.
- Admin-password er hardkodet — ikke kritisk da sitet ikke håndterer betalinger.
