# GalleriFruB — UX og Indhold

> Sidst opdateret: april 2026

---

## Design-principer

- **Æstetik:** Minimalistisk og elegant — kunsten er i centrum
- **Farver:** Off-white baggrund (`#f9f8f6`), mørk tekst (`#1a1a1a`), dæmpede accenter
- **Typografi:** Cormorant Garamond (serif, overskrifter/logo) + Inter (sans-serif, brødtekst, 300 vægt)
- **Spacing:** Generøs whitespace. Intet er trængt.
- **Touch-targets:** Min. 44×44px på interaktive elementer (mobile)

---

## Navigation

### Desktop
- Logo til venstre (serif, store bogstaver med spacing)
- Links til højre: Malerier / Mixed Media / Om / Nyheder / Kontakt
- Sprogskifte yderst til højre: DA | EN (toggle-knap med border)
- Sticky top — forbliver synlig ved scroll
- Bundlinje: `1px solid #ede9e3`

### Mobil
- Hamburger-menu (3 linjer → X ved åbning)
- Fuld-skærms menu centreret med store links
- Sprogskifte med i mobilmenu

---

## Sider

### Forside (`/`)

**Hero-sektion:**
- Fuldskalabillede (90vh), `object-position: center 30%`
- Gradient-overlay (mørk bund) med kunstnerens navn som H1
- Serif, stor, med bogstavmellemrum

**Udvalgte malerier:**
- Overskrift: "Udvalgte malerier" / "Selected Paintings"
- Grid med et udvalg af malerier (de første ~6)
- Knap: "Se alle malerier" → /malerier

**Mixed Media:**
- Tilsvarende grid
- Knap: "Se alle mixed media" → /mixed-media

**Nyheder:**
- Op til 3 seneste nyheder med tag, dato, titel og kort tekst
- Knap: "Se alle nyheder" → /nyheder

**Instagram-feed:**
- Fouita-widget (`ftxw51yj3`) der trækker @cblauenfeldt's feed
- Sektion med overskrift "Instagram"

---

### Malerier (`/malerier`)

- Responsivt grid: alle malerier
- Hvert kort: billede, titel, materiale, størrelse, år
- "Solgt"-badge hvis `status === 'sold'`
- Klikbart → /vaerk/:slug

---

### Mixed Media (`/mixed-media`)

- Samme grid-layout som malerier
- Tilsvarende badge-logik

---

### Enkelt værk (`/vaerk/:slug`)

**Billeder:**
- Stort primærbillede
- Knapper til at skifte billede:
  - "Værk" (altid til stede)
  - "Visualisering" — hvis kun rum-billede (AI-genereret)
  - "I sit nye hjem" — hvis kundebillede (rigtig ejer)
- Under "Visualisering": tekst *"AI-genereret visualisering"*
- Under "I sit nye hjem": tekst *"Billede venligst udlånt af den heldige ejer"*

**Info:**
- Titel, materiale, størrelse, år
- Pris (hvis sat) eller "Kontakt for pris"
- `Solgt`-badge hvis solgt

**Beskrivelse:**
- Vises på valgt sprog (da/en)

**Forespørgsel:**
- Formular: navn, email, besked
- Sendes via Brevo til anders@blauenfeldt.dk

**SEO:**
- Open Graph: titel, beskrivelse, billede

---

### Om (`/om`)

- Tekst om Camilla Blauenfeldt (dansk/engelsk)
- Video: `passion_video.mp4` (indlejret HTML5-video)
- Billedmosaik: 55 procesbilleder (extra-01 til extra-62, tilfældig fast rækkefølge)
  - Billeder fra atelier + udstillinger
  - Shuffles én gang ved opstart, forbliver fast pr. session

---

### Nyheder (`/nyheder`)

- Oversigt over alle nyheder (nyeste øverst)
- Hvert indlæg: tag-label, dato, billede (hvis sat), titel, intro-tekst
- Klikbart → /nyhed/:id
- Under nyhedslisten: Instagram-feed (Fouita-widget, samme som forsiden)

---

### Enkelt nyhed (`/nyhed/:id`)

- Fuld tekst (inkl. linjeskift)
- Billede hvis tilgængeligt
- Tag og dato

---

### Kontakt (`/kontakt`)

- Kontaktoplysninger: email, Instagram-link
- Billedmosaik: 55 kontakt/profil-billeder (contact/extra-01 til extra-62, tilfældig fast rækkefølge)
  - Separat shuffle fra /om-siden

---

### Admin (`/admin`)

Kun tilgængeligt efter login. Ikke synligt i den offentlige navigation.

#### Login
- Simpel formular: password
- Case-insensitiv

#### Oversigt
- To tabs/sektioner: Malerier og Mixed Media (fælles interface)
- Nyheder i separat sektion

#### Tilføj/rediger værk
- Felter: titel, materiale, størrelse (bredde + højde), år, pris, status, beskrivelse (da), beskrivelse (en)
- Upload-felter: værkbillede, rum-visualisering, kundebillede
- "Oversæt automatisk"-knap → kalder `/admin/translate` → MyMemory API → udfylder engelskt felt
- Gem-knap

#### Sortering
- Drag & drop via HTML5 (`draggable`)
- POST til `/admin/reorder` ved slip
- Rækkefølge gemmes direkte i JSON-filen

#### Slet billede
- Separate slet-knapper per billede-slot på redigeringsformular
- Sletter kun billedet, ikke selve værket

#### Tilføj/rediger nyhed
- Felter: titel (da/en), dato, tag, tekst (da/en), billede

---

## Sprog og tekster

Alle UI-strenge er i `i18n.js`. Eksempler:

| Nøgle | Dansk | Engelsk |
|-------|-------|---------|
| nav.paintings | Malerier | Paintings |
| nav.mixed | Mixed Media | Mixed Media |
| nav.about | Om | About |
| nav.news | Nyheder | News |
| nav.contact | Kontakt | Contact |
| artwork.inquiry | Forespørg | Inquire |
| artwork.sold | Solgt | Sold |
| artwork.visualization | Visualisering | Visualization |
| artwork.newHome | I sit nye hjem | In its new home |

---

## Indhold: Malerier

16 malerier pt. (primo 2026):

| ID | Titel | Størrelse | År | Status |
|----|-------|-----------|-----|--------|
| 1 | Stien | 70×50 cm | 2025 | For sale |
| 2 | Tur på Heden | 70×140 cm | 2025 | Solgt |
| 3 | Home | 98×98 cm | 2025 | For sale |
| 4 | Leisure | 98×98 cm | 2025 | For sale |
| 5 | Pleasure | 98×98 cm | 2025 | For sale |
| 6 | Wandering in the Hills | 140×115 cm | 2025 | Solgt |
| 7 | Wandering Once More | 140×115 cm | 2025 | Solgt |
| 8 | Tidsfordriv | 140×115 cm | 2025 | For sale |
| 9 | Hilma | 120×120 cm | 2023 | Solgt |
| 10 | Uden titel | 30×30 cm | 2026 | For sale |
| 11 | Fortællinger | 70×50 cm | 2025 | For sale |
| 12 | My Magritte | 100×100 cm | 2023 | For sale |
| 13 | In the Mood | 98×98 cm | 2024 | For sale |
| 14 | Lollipop | 70×50 cm | 2025 | Solgt |
| 15 | Stilleben | 100×80 cm | 2024 | For sale |
| 16 | Skoven blomstrer | 70×50 cm | 2025 | For sale |

---

## Indhold: Mixed Media

15 værker pt. (primo 2026):

| ID | Titel | Størrelse | År | Status |
|----|-------|-----------|-----|--------|
| m1 | Das Kurhaus | 30×40 cm | 2025 | For sale |
| m2 | Der Wald | 30×40 cm | 2025 | For sale |
| m3 | The Gathering | 30×40 cm | 2023 | For sale |
| m4 | The View | A3 (42×30 cm) | 2023 | For sale |
| m5 | Autumn | 24×18 cm | 2025 | For sale |
| m6 | September Feeling 01 | 30×21 cm | 2025 | For sale |
| m7 | September Feeling 02 | 30×21 cm | 2025 | For sale |
| m8 | My Barcelona | A3 (42×30 cm) | 2023 | For sale |
| m9 | Favourite Colour | 13×18 cm | 2025 | For sale |
| m10 | No Title (05) | 40×30 cm | 2025 | Solgt |
| m11 | No Title (08) | 40×30 cm | 2025 | For sale |
| m12 | No Title (10) | 40×30 cm | 2025 | For sale |
| m13 | No Title (12) | 40×30 cm | 2025 | For sale |
| m14 | Spring | 30×40 cm | 2024 | For sale |
| m15 | The Bird flew from Sweden | A3 (42×30 cm) | 2023 | For sale |

---

## SEO og sociale medier

- **Sitemap:** /sitemap.xml (dynamisk, inkl. alle /vaerk/-sider)
- **Robots:** /robots.txt (tillader alt)
- **Open Graph:** Implementeret på alle sider. Værkside: OG-billede = værkbillede
- **Pinterest:** 3 boards oprettet. Pin-tekster i `pinterest-pins.md`. Tags UDEN `#`.
- **Instagram:** @cblauenfeldt — feed embeddet på forside og nyhedsside
- **Umami:** Website ID 85a87f4b-ab67-4760-894d-ef1218061f7c — aktivt

---

## Tilgængelighed og responsivitet

- Mobilmenu med burger-ikon
- Touch-targets min. 44×44px
- Sprog-toggle synlig på alle enheder
- Billeder bruger `object-fit: cover`
- Ingen JavaScript-afhængige kritiske flows (undtagen drag & drop i admin)
