const express = require('express');
const multer = require('multer');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const translations = require('./i18n');

const app = express();
const PORT = 3001;
const PAINTINGS_FILE = path.join(__dirname, 'data', 'paintings.json');
const MIXED_FILE = path.join(__dirname, 'data', 'mixed.json');
const NEWS_FILE = path.join(__dirname, 'data', 'news.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'images');
const ADMIN_PASSWORD = 'frub203024';

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
if (!fs.existsSync(PAINTINGS_FILE)) fs.writeFileSync(PAINTINGS_FILE, JSON.stringify(paintingsData(), null, 2));
if (!fs.existsSync(MIXED_FILE)) fs.writeFileSync(MIXED_FILE, JSON.stringify(mixedData(), null, 2));
if (!fs.existsSync(NEWS_FILE)) fs.writeFileSync(NEWS_FILE, JSON.stringify(newsData(), null, 2));

function newsData() {
  return [
    {
      id: 'n1',
      title: 'Ny serie på vej',
      titleEn: 'New series in progress',
      date: '2026-03-28',
      tag: 'atelier',
      image: null,
      text: 'Jeg er i øjeblikket i gang med en ny serie malerier, der kredser om det samme tema som "Wandering"-serien — men denne gang handler det mere om det indre landskab end det ydre.\n\nJeg arbejder på fire store formater i akryl. De første to er på lærred, de to næste vil sandsynligvis blive mixed media. Vi er endnu i en tidlig fase, men det går godt.\n\nFølg med her eller på Instagram for opdateringer.',
      textEn: 'I am currently working on a new series of paintings that circles around the same theme as the "Wandering" series — but this time it is more about the inner landscape than the outer one.\n\nI am working on four large formats in acrylic. The first two are on canvas, the next two will likely be mixed media. We are still in an early stage, but things are going well.\n\nFollow along here or on Instagram for updates.',
    },
    {
      id: 'n2',
      title: 'Udstilling hos Galleri Kunstsamlingen i påsken',
      titleEn: 'Exhibition at Galleri Kunstsamlingen over Easter',
      date: '2026-03-15',
      tag: 'udstilling',
      image: null,
      text: 'Jeg er med i Galleri Kunstsamlingens påskeudstilling i år. Galleriet holder åbent på alle påsketraditioners dage, og jeg har sendt seks værker af sted — et udvalg fra den seneste produktion.\n\nGalleriet ligger i København og I er meget velkomne til at kigge forbi.',
      textEn: 'I am participating in Galleri Kunstsamlingen\'s Easter exhibition this year. The gallery is open on all Easter holidays, and I have sent six works — a selection from recent production.\n\nThe gallery is located in Copenhagen and you are very welcome to stop by.',
    },
    {
      id: 'n3',
      title: 'Inspiration fra en tur til Berlin',
      titleEn: 'Inspiration from a trip to Berlin',
      date: '2026-02-20',
      tag: 'inspiration',
      image: null,
      text: 'Jeg var i Berlin i februar og kom hjem med mange nye indtryk. Byens energi, arkitekturen, museerne — det hele sætter sig fast.\n\nJeg besøgte Hamburger Bahnhof og så en stor Joseph Beuys-retrospektiv, som virkelig rystede mig på en god måde. Hans brug af materialer og his sense of ritual — det er noget jeg vil tænke på længe.\n\nAltid rart at komme hjem med ny energi.',
      textEn: 'I was in Berlin in February and came home with many new impressions. The city\'s energy, the architecture, the museums — it all sticks.\n\nI visited Hamburger Bahnhof and saw a large Joseph Beuys retrospective that really shook me in a good way. His use of materials and his sense of ritual — that is something I will be thinking about for a long time.\n\nAlways good to come home with fresh energy.',
    },
  ];
}

function paintingsData() {
  return [
    { id:'1',  title:'Stien',                   image:'stien.jpg',                    medium:'Acrylic on canvas', size:'70×50 cm',   year:2025, price:null, status:'for-sale', description: autoDescriptions['1'] },
    { id:'2',  title:'Tur på Heden',             image:'tur-paa-heden.jpg',             medium:'Acrylic on canvas', size:'70×140 cm',  year:2025, price:null, status:'sold',     description: autoDescriptions['2'] },
    { id:'3',  title:'Home',                     image:'home.jpg',                      medium:'Acrylic on canvas', size:'98×98 cm',   year:2025, price:null, status:'for-sale', description: autoDescriptions['3'] },
    { id:'4',  title:'Leisure',                  image:'leisure.jpg',                   medium:'Acrylic on canvas', size:'98×98 cm',   year:2025, price:null, status:'for-sale', description: autoDescriptions['4'] },
    { id:'5',  title:'Pleasure',                 image:'pleasure.jpg',                  medium:'Acrylic on canvas', size:'98×98 cm',   year:2025, price:null, status:'for-sale', description: autoDescriptions['5'] },
    { id:'6',  title:'Wandering in the Hills',   image:'wandering-in-the-hills.jpg',    medium:'Acrylic (mixed) on canvas', size:'140×115 cm', year:2025, price:null, status:'sold',     description: autoDescriptions['6'] },
    { id:'7',  title:'Wandering Once More',      image:'wandering-once-more.jpg',       medium:'Acrylic (mixed) on canvas', size:'140×115 cm', year:2025, price:null, status:'sold',     description: autoDescriptions['7'] },
    { id:'8',  title:'Tidsfordriv',              image:'tidsfordriv.jpg',               medium:'Acrylic on canvas', size:'140×115 cm', year:2025, price:null, status:'for-sale', description: autoDescriptions['8'] },
    { id:'9',  title:'Hilma',                    image:'hilma.jpeg',                    medium:'Acrylic on canvas', size:'120×120 cm', year:2023, price:null, status:'sold',     description: autoDescriptions['9'] },
    { id:'10', title:'Uden titel',               image:'uden-titel.jpg',                medium:'Acrylic on canvas', size:'30×30 cm',   year:2026, price:null, status:'for-sale', description: autoDescriptions['10'] },
    { id:'11', title:'Fortællinger',             image:'fortaellinger.jpg',             medium:'Acrylic on canvas', size:'70×50 cm',   year:2025, price:null, status:'for-sale', description: autoDescriptions['11'] },
    { id:'12', title:'My Magritte',              image:'my-magritte.jpeg',              medium:'Acrylic on canvas', size:'100×100 cm', year:2023, price:null, status:'for-sale', description: autoDescriptions['12'] },
    { id:'13', title:'In the Mood',              image:'in-the-mood.jpg',               medium:'Acrylic on canvas', size:'98×98 cm',   year:2024, price:null, status:'for-sale', description: autoDescriptions['13'] },
    { id:'14', title:'Lollipop',                 image:'lollipop.jpg',                  medium:'Acrylic on canvas', size:'70×50 cm',   year:2025, price:null, status:'sold',     description: autoDescriptions['14'] },
    { id:'15', title:'Stilleben',                image:'stilleben.jpg',                 medium:'Acrylic on canvas', size:'100×80 cm',  year:2024, price:null, status:'for-sale', description: autoDescriptions['15'] },
    { id:'16', title:'Skoven blomstrer',         image:'skoven-blomstrer.jpg',          medium:'Acrylic on canvas', size:'70×50 cm',   year:2025, price:null, status:'for-sale', description: autoDescriptions['16'] },
  ];
}

function mixedData() {
  return [
    { id:'m1',  title:'Das Kurhaus',              image:'das-kurhaus.jpg',               medium:'Acrylic on newspaper', size:'30×40 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m1'] },
    { id:'m2',  title:'Der Wald',                 image:'der-wald.jpg',                  medium:'Mixed media',          size:'30×40 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m2'] },
    { id:'m3',  title:'The Gathering',            image:'the-gathering.jpeg',            medium:'Mixed media',          size:'30×40 cm',     year:2023, price:null, status:'for-sale', description: autoDescriptions['m3'] },
    { id:'m4',  title:'The View',                 image:'the-view.jpeg',                 medium:'Mixed media',          size:'A3 (42×30 cm)',year:2023, price:null, status:'for-sale', description: autoDescriptions['m4'] },
    { id:'m5',  title:'Autumn',                   image:'autumn.jpg',                    medium:'Mixed media',          size:'24×18 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m5'] },
    { id:'m6',  title:'September Feeling 01',     image:'september-feeling-01.jpg',      medium:'Mixed media',          size:'30×21 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m6'] },
    { id:'m7',  title:'September Feeling 02',     image:'september-feeling-02.jpg',      medium:'Mixed media',          size:'30×21 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m7'] },
    { id:'m8',  title:'My Barcelona',             image:'my-barcelona.jpeg',             medium:'Mixed media',          size:'A3 (42×30 cm)',year:2023, price:null, status:'for-sale', description: autoDescriptions['m8'] },
    { id:'m9',  title:'Favourite Colour',         image:'favorite-colour.jpg',           medium:'Mixed media',          size:'13×18 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m9'] },
    { id:'m10', title:'No Title',                 image:'no-title-05.jpg',               medium:'Mixed media',          size:'40×30 cm',     year:2025, price:null, status:'sold',     description: autoDescriptions['m10'] },
    { id:'m11', title:'No Title',                 image:'no-title-08.jpg',               medium:'Mixed media',          size:'40×30 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m11'] },
    { id:'m12', title:'No Title',                 image:'no-title-10.jpg',               medium:'Mixed media',          size:'40×30 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m12'] },
    { id:'m13', title:'No Title',                 image:'no-title-12.jpg',               medium:'Mixed media',          size:'40×30 cm',     year:2025, price:null, status:'for-sale', description: autoDescriptions['m13'] },
    { id:'m14', title:'Spring',                   image:'spring.jpeg',                   medium:'Mixed media',          size:'30×40 cm',     year:2024, price:null, status:'for-sale', description: autoDescriptions['m14'] },
    { id:'m15', title:'The Bird flew from Sweden',image:'the-bird-flew-from-sweden.jpeg',medium:'Mixed media',          size:'A3 (42×30 cm)',year:2023, price:null, status:'for-sale', description: autoDescriptions['m15'] },
  ];
}

// Process photos on /om
// Alle billeder fra både værksted og udstillinger
// /om - shuffled rækkefølge (55 billeder)
const processPhotos = ['process/extra-25.jpg','process/extra-16.jpg','process/extra-03.jpg','process/extra-02.jpg','process/extra-50.jpg','process/extra-30.jpg','process/extra-51.jpg','process/extra-18.jpg','process/extra-23.jpg','process/extra-59.jpg','process/extra-55.jpg','process/extra-37.jpg','process/extra-39.jpg','process/extra-52.jpg','process/extra-53.jpg','process/extra-61.jpg','process/extra-26.jpg','process/extra-06.jpg','process/extra-40.jpg','process/extra-62.jpg','process/extra-60.jpg','process/extra-41.jpg','process/extra-36.jpg','process/extra-09.jpg','process/extra-13.jpg','process/extra-49.jpg','process/extra-07.jpg','process/extra-19.jpg','process/extra-57.jpg','process/extra-58.jpg','process/extra-33.jpg','process/extra-38.jpg','process/extra-21.jpg','process/extra-28.jpg','process/extra-56.jpg','process/extra-54.jpg','process/extra-27.jpg','process/extra-48.jpg','process/extra-11.jpg','process/extra-29.jpg','process/extra-17.jpg','process/extra-01.jpg','process/extra-05.jpg','process/extra-15.jpg','process/extra-46.jpg','process/extra-20.jpg','process/extra-42.jpg','process/extra-24.jpg','process/extra-44.jpg','process/extra-04.jpg','process/extra-22.jpg','process/extra-32.jpg','process/extra-14.jpg','process/extra-08.jpg','process/extra-47.jpg'];
// /kontakt - fast shuffled rækkefølge
const contactPhotosAll = ['contact/extra-02.jpg','contact/extra-03.jpg','contact/extra-20.jpg','contact/extra-05.jpg','contact/extra-30.jpg','contact/extra-08.jpg','contact/extra-18.jpg','contact/extra-11.jpg','contact/extra-23.jpg','contact/extra-52.jpg','contact/extra-14.jpg','contact/extra-25.jpg','contact/extra-19.jpg','contact/extra-21.jpg','contact/extra-22.jpg','contact/extra-09.jpg','contact/extra-28.jpg','contact/extra-41.jpg','contact/extra-40.jpg','contact/extra-24.jpg','contact/extra-29.jpg','contact/extra-26.jpg','contact/extra-32.jpg','contact/extra-33.jpg','contact/extra-60.jpg','contact/extra-48.jpg','contact/extra-56.jpg','contact/extra-37.jpg','contact/extra-53.jpg','contact/extra-59.jpg','contact/extra-50.jpg','contact/extra-49.jpg','contact/extra-47.jpg','contact/extra-46.jpg','contact/extra-44.jpg','contact/extra-42.jpg','contact/extra-15.jpg','contact/extra-13.jpg','contact/extra-58.jpg','contact/extra-54.jpg','contact/extra-39.jpg','contact/extra-55.jpg','contact/extra-16.jpg','contact/extra-62.jpg','contact/extra-57.jpg','contact/extra-17.jpg','contact/extra-51.jpg','contact/extra-27.jpg','contact/extra-04.jpg','contact/extra-61.jpg','contact/extra-07.jpg','contact/extra-38.jpg','contact/extra-06.jpg','contact/extra-36.jpg','contact/extra-01.jpg'];


// Hjælpefunktioner
function makeSlug(title) {
  return title.toLowerCase()
    .replace(/[æä]/g, 'ae').replace(/[øö]/g, 'oe').replace(/[åü]/g, 'aa')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function nextId(items, prefix) {
  const nums = items.map(p => {
    const m = String(p.id).match(/^(\D*)(\d+)$/);
    return m ? parseInt(m[2]) : 0;
  });
  return prefix + (Math.max(0, ...nums) + 1);
}

const { execSync } = require('child_process');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isNews = file.fieldname === 'newsImage';
    const dir = isNews ? path.join(UPLOAD_DIR, 'news') : UPLOAD_DIR;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const isHeic = /\.(heic|heif)$/i.test(file.originalname);
    const base = file.originalname.replace(/\s+/g, '-').replace(/\.(heic|heif)$/i, '.jpg');
    cb(null, Date.now() + '-' + base);
  }
});

// Konverter HEIC til JPEG efter upload
function convertHeicIfNeeded(filepath, mimetype) {
  const isHeic = /heic|heif/i.test(mimetype || '') || /\.(heic|heif)$/i.test(filepath);
  if (!isHeic) return filepath;
  // Sørg for .jpg extension
  const jpgPath = filepath.replace(/\.[^.]+$/, '.jpg');
  try {
    execSync(`heif-convert "${filepath}" "${jpgPath}"`);
    if (filepath !== jpgPath && fs.existsSync(filepath)) fs.unlinkSync(filepath);
    return jpgPath;
  } catch(e) {
    console.error('HEIC convert fejl:', e.message);
    return filepath;
  }
}
const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/videos', express.static(path.join(__dirname, 'public', 'videos')));
app.use('/images/news', express.static(path.join(__dirname, 'public', 'images', 'news')));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'frub-secret-123', resave: false, saveUninitialized: false }));

app.use((req, res, next) => {
  if (req.query.lang === 'da' || req.query.lang === 'en') {
    req.session.lang = req.query.lang;
    return res.redirect(req.path);
  }
  req.lang = req.session.lang || 'da';
  req.t = translations[req.lang];
  next();
});

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Inter', sans-serif; background: #f9f8f6; color: #1a1a1a; font-weight:300; }

  /* NAV */
  nav { display:flex; justify-content:space-between; align-items:center; padding:1.2rem 2rem; background:#f9f8f6; position:sticky; top:0; z-index:50; border-bottom:1px solid #ede9e3; }
  nav .logo { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:300; letter-spacing:0.2em; text-decoration:none; color:#1a1a1a; }
  nav .nav-right { display:flex; align-items:center; gap:2.5rem; }
  nav ul { list-style:none; display:flex; gap:2rem; }
  nav ul a { text-decoration:none; color:#666; font-size:0.78rem; letter-spacing:0.12em; text-transform:uppercase; transition:color 0.2s; }
  nav ul a:hover { color:#1a1a1a; }
  .lang-toggle { display:flex; border:1px solid #d0ccc6; border-radius:1px; overflow:hidden; }
  .lang-toggle a { padding:0.2rem 0.55rem; font-size:0.7rem; text-decoration:none; color:#999; letter-spacing:0.08em; background:#f9f8f6; transition:all 0.2s; }
  .lang-toggle a.active { background:#888; color:white; }
  /* BURGER */
  .burger { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:10px; min-width:44px; min-height:44px; justify-content:center; align-items:center; }
  .burger span { display:block; width:22px; height:1px; background:#1a1a1a; transition:all 0.3s; }
  .burger.open span:nth-child(1) { transform:translateY(6px) rotate(45deg); }
  .burger.open span:nth-child(2) { opacity:0; }
  .burger.open span:nth-child(3) { transform:translateY(-6px) rotate(-45deg); }
  .mobile-menu { display:none; position:fixed; inset:0; top:57px; background:#f9f8f6; z-index:49; flex-direction:column; align-items:center; justify-content:center; gap:2rem; }
  .mobile-menu.open { display:flex; }
  .mobile-menu a { font-size:1.1rem; letter-spacing:0.15em; text-transform:uppercase; text-decoration:none; color:#333; min-height:44px; display:flex; align-items:center; padding:0 1rem; }
  .mobile-menu .lang-toggle { margin-top:1rem; }

  /* HERO */
  .hero { position:relative; height:90vh; overflow:hidden; }
  .hero img { width:100%; height:100%; object-fit:cover; object-position:center 30%; }
  .hero-overlay { position:absolute; inset:0; background:linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.45) 100%); display:flex; flex-direction:column; justify-content:flex-end; align-items:flex-start; padding:4rem; color:white; }
  .hero-overlay h1 { font-family:'Cormorant Garamond',serif; font-size:4rem; font-weight:700; letter-spacing:0.25em; line-height:1; }
  .hero-overlay p { margin-top:0.75rem; font-size:0.85rem; letter-spacing:0.15em; text-transform:uppercase; opacity:0.8; }
  .hero-cta { display:inline-block; margin-top:2rem; padding:0.7rem 2rem; border:1px solid rgba(255,255,255,0.7); color:white; text-decoration:none; font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; transition:all 0.2s; }
  .hero-cta:hover { background:white; color:#1a1a1a; }

  /* SECTIONS */
  .section { padding:5rem 3rem; }
  .section-header { text-align:center; margin-bottom:3rem; }
  .section-header h2 { font-family:'Cormorant Garamond',serif; font-size:1.8rem; font-weight:300; letter-spacing:0.15em; }
  .section-header p { margin-top:0.5rem; font-size:0.78rem; color:#999; letter-spacing:0.1em; text-transform:uppercase; }
  .see-more { text-align:center; margin-top:2.5rem; }
  .see-more a { font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; color:#999; text-decoration:none; border-bottom:1px solid #d0ccc6; padding-bottom:1px; transition:color 0.2s; }
  .see-more a:hover { color:#1a1a1a; }

  /* GALLERY GRID */
  .gallery { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1px; background:#f9f8f6; }
  .painting, .painting-placeholder { outline:1px solid #ede9e3; }
  .gallery-home { grid-template-columns:repeat(4, 1fr); }
  .painting { background:#f9f8f6; cursor:pointer; position:relative; overflow:hidden; }
  .painting img { width:100%; aspect-ratio:3/4; object-fit:cover; display:block; transition:transform 0.5s ease; }
  .painting:hover img { transform:scale(1.03); }
  .painting-overlay { position:absolute; bottom:0; left:0; right:0; background:linear-gradient(transparent, rgba(0,0,0,0.75)); padding:1.5rem 1rem 1rem; color:white; transform:translateY(100%); transition:transform 0.3s ease; }
  .painting:hover .painting-overlay { transform:translateY(0); }
  .painting-info { padding:1rem; }
  .painting-info h2 { font-family:'Cormorant Garamond',serif; font-size:1rem; font-weight:400; font-style:italic; }
  .painting-info .meta { font-size:0.75rem; color:#999; margin-top:0.2rem; letter-spacing:0.03em; }
  .painting-info .price { margin-top:0.5rem; font-size:0.9rem; color:#444; }
  .badge { display:inline-block; font-size:0.65rem; padding:0.15rem 0.5rem; margin-top:0.4rem; letter-spacing:0.08em; text-transform:uppercase; }
  .badge.sold { background:#f0ece8; color:#aaa; }
  .badge.for-sale { background:#edf2ed; color:#5a7a5a; }
  .inquire-btn { display:block; margin-top:0.6rem; padding:0.6rem 0; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:#888; text-decoration:none; border-top:1px solid #ede9e3; transition:color 0.2s; min-height:44px; line-height:44px; }
  .inquire-btn:hover { color:#1a1a1a; }
  .painting-placeholder { background:#f9f8f6; min-height:1px; }
  /* NEWS */
  .news-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(300px,1fr)); gap:2rem; max-width:1200px; margin:0 auto; padding:0 3rem 4rem; }
  .news-grid-home { grid-template-columns:repeat(3,1fr); }
  .news-card { background:white; border:1px solid #ece9e4; cursor:pointer; display:block; text-decoration:none; color:inherit; }
  .news-card img { width:100%; aspect-ratio:16/9; object-fit:cover; display:block; }
  .news-card-body { padding:1.25rem; }
  .news-card .tag { font-size:0.65rem; letter-spacing:0.12em; text-transform:uppercase; color:#aaa; margin-bottom:0.5rem; }
  .news-card h3 { font-family:'Cormorant Garamond',serif; font-size:1.2rem; font-weight:400; margin-bottom:0.5rem; }
  .news-card .date { font-size:0.75rem; color:#bbb; margin-bottom:0.75rem; }
  .news-card .excerpt { font-size:0.85rem; color:#666; line-height:1.7; }
  .news-card .read-more { display:inline-block; margin-top:0.75rem; font-size:0.72rem; letter-spacing:0.1em; text-transform:uppercase; color:#888; text-decoration:none; border-bottom:1px solid #ede9e3; padding-bottom:1px; min-height:44px; line-height:44px; }
  .news-card .read-more:hover { color:#1a1a1a; }
  .news-card-img-placeholder { width:100%; aspect-ratio:16/9; background:#f4f2ef; display:flex; align-items:center; justify-content:center; }
  .news-card-img-placeholder span { font-size:0.75rem; color:#ccc; letter-spacing:0.1em; text-transform:uppercase; }
  /* NEWS SINGLE */
  .news-page { max-width:760px; margin:0 auto; padding:2rem 3rem 5rem; }
  .news-page .tag { font-size:0.68rem; letter-spacing:0.12em; text-transform:uppercase; color:#aaa; margin-bottom:0.5rem; }
  .news-page h1 { font-family:'Cormorant Garamond',serif; font-size:2.2rem; font-weight:300; margin-bottom:0.5rem; line-height:1.2; }
  .news-page .date { font-size:0.78rem; color:#bbb; margin-bottom:2rem; padding-bottom:2rem; border-bottom:1px solid #ede9e3; }
  .news-page img { width:100%; margin-bottom:2rem; }
  .news-page .body { font-size:0.95rem; line-height:1.9; color:#444; }
  .news-page .body p { margin-bottom:1rem; }
  @media(max-width:768px) { .news-grid { padding:0 1.2rem 3rem; } .news-page { padding:1.5rem; } }

  /* BREADCRUMB */
  .breadcrumb { padding:1.5rem 3rem 0; font-size:0.75rem; color:#aaa; letter-spacing:0.08em; }
  .breadcrumb a { color:#aaa; text-decoration:none; }
  .breadcrumb a:hover { color:#555; }
  /* WORK PAGE */
  .work-page { max-width:1100px; margin:0 auto; padding:2rem 3rem 5rem; display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:start; }
  .work-image { position:sticky; top:100px; }
  .work-image img { width:100%; display:block; }
  .work-image .room-toggle { margin-top:0.75rem; }
  .work-details h1 { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:300; font-style:italic; margin-bottom:0.5rem; }
  .work-details .meta { font-size:0.8rem; color:#999; letter-spacing:0.05em; margin-bottom:1.5rem; padding-bottom:1.5rem; border-bottom:1px solid #ede9e3; }
  .work-description { font-size:0.92rem; line-height:1.9; color:#444; }
  .work-description p { margin-bottom:1rem; }
  .work-description em { font-family:'Cormorant Garamond',serif; font-size:1.05rem; }
  .work-actions { margin-top:2rem; padding-top:1.5rem; border-top:1px solid #ede9e3; }
  .work-actions .price { font-size:1.1rem; color:#333; margin-bottom:1rem; }
  .btn-inquire { display:inline-block; padding:0.7rem 2rem; background:#1a1a1a; color:white; text-decoration:none; font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; transition:background 0.2s; }
  .btn-inquire:hover { background:#444; }
  @media(max-width:768px) {
    .work-page { grid-template-columns:1fr; gap:2rem; padding:1.5rem; }
    .work-image { position:static; }
    .breadcrumb { padding:1rem 1.5rem 0; }
  }
  .room-toggle { display:inline-flex; gap:0; border:1px solid #ede9e3; border-radius:1px; overflow:hidden; margin-top:0.5rem; }
  .room-toggle button { padding:0.4rem 0.8rem; font-size:0.65rem; letter-spacing:0.08em; text-transform:uppercase; background:white; border:none; cursor:pointer; color:#aaa; transition:all 0.15s; min-height:36px; }
  .room-toggle button.active { background:#1a1a1a; color:white; }

  /* INSTAGRAM STRIP */
  .instagram-section { padding:4rem 3rem; text-align:center; background:#f4f2ef; }
  .instagram-section h2 { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:300; letter-spacing:0.15em; margin-bottom:0.5rem; }
  .instagram-section p { font-size:0.78rem; color:#999; letter-spacing:0.1em; text-transform:uppercase; margin-bottom:2rem; }
  .instagram-link { display:inline-block; padding:0.7rem 2rem; border:1px solid #aaa; color:#555; text-decoration:none; font-size:0.75rem; letter-spacing:0.15em; text-transform:uppercase; transition:all 0.2s; }
  .instagram-link:hover { background:#1a1a1a; color:white; border-color:#1a1a1a; }

  /* ABOUT */
  .about-wrap { max-width:1000px; margin:0 auto; padding:5rem 3rem; }
  .about-top { display:grid; grid-template-columns:1fr 1.6fr; gap:5rem; align-items:start; margin-bottom:4rem; }
  .about-top img { width:100%; }
  .about-top h2 { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:300; letter-spacing:0.1em; margin-bottom:1.5rem; }
  .about-top p { font-size:0.9rem; line-height:1.9; color:#444; margin-bottom:1rem; }
  .about-top em { font-family:'Cormorant Garamond',serif; font-size:1.05rem; font-style:italic; }
  .process-title { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:300; letter-spacing:0.15em; text-align:center; margin-bottom:2rem; color:#555; }
  .process-grid { columns:3; gap:8px; }
  .process-grid img { width:100%; display:block; margin-bottom:8px; break-inside:avoid; }

  /* CONTACT */
  .contact-wrap { max-width:560px; margin:0 auto; padding:6rem 2rem; text-align:center; }
  .contact-wrap h2 { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:300; letter-spacing:0.15em; margin-bottom:1rem; }
  .contact-wrap .intro { font-size:0.9rem; color:#666; line-height:1.8; margin-bottom:2rem; }
  .contact-links { display:flex; flex-direction:column; gap:0.75rem; align-items:center; margin-bottom:2rem; }
  .contact-links a { font-size:0.85rem; color:#444; text-decoration:none; letter-spacing:0.05em; }
  .contact-links a:hover { color:#1a1a1a; }
  .contact-note { font-size:0.78rem; color:#aaa; line-height:1.8; }
  .contact-note a { color:#aaa; }

  /* MODAL */
  .modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.92); z-index:200; }
  .modal.open { display:flex; justify-content:center; align-items:center; }
  .modal-inner { position:relative; max-width:90vw; max-height:90vh; display:flex; gap:2rem; align-items:center; }
  .modal-inner img { max-height:85vh; max-width:65vw; object-fit:contain; }
  .modal-info { color:white; min-width:200px; }
  .modal-info h3 { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:300; font-style:italic; margin-bottom:0.5rem; }
  .modal-info .meta { font-size:0.78rem; color:#aaa; line-height:1.8; }
  .modal-info .inquire { display:inline-block; margin-top:1.5rem; padding:0.6rem 1.5rem; border:1px solid rgba(255,255,255,0.4); color:white; text-decoration:none; font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; transition:all 0.2s; }
  .modal-info .inquire:hover { background:white; color:#1a1a1a; }
  .modal-close { position:fixed; top:1.5rem; right:2rem; color:white; font-size:1.8rem; cursor:pointer; background:none; border:none; opacity:0.7; }
  .modal-close:hover { opacity:1; }

  /* FOOTER */
  footer { padding:2.5rem 3rem; border-top:1px solid #ede9e3; display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#bbb; }
  footer a { color:#bbb; text-decoration:none; }
  footer a:hover { color:#888; }

  @media(max-width:768px) {
    nav { padding:1rem 1.2rem; }
    nav .nav-right { display:none; }
    .burger { display:flex; }
    .hero { height:60vh; }
    .hero-overlay { padding:1.5rem; }
    .hero-overlay h1 { font-size:2.2rem; }
    .hero-overlay p { font-size:0.75rem; }
    .hero-cta { padding:0.75rem 1.4rem; font-size:0.75rem; min-height:44px; display:inline-flex; align-items:center; }
    .section { padding:2.5rem 1.2rem; }
    .section-header h2 { font-size:1.4rem; }
    .gallery { grid-template-columns:repeat(2, 1fr); }
    .painting-info { padding:0.75rem; }
    .painting-info h2 { font-size:0.9rem; }
    .about-top { grid-template-columns:1fr; gap:2rem; }
    .about-wrap { padding:2.5rem 1.2rem; }
    .process-grid { grid-template-columns:repeat(2,1fr); }
    footer { flex-direction:column; gap:0.5rem; text-align:center; padding:2rem 1.2rem; }
    .modal-inner { flex-direction:column; max-width:95vw; }
    .modal-inner img { max-width:90vw; max-height:55vh; }
    .modal-info { min-width:unset; text-align:center; }
    .instagram-section { padding:3rem 1.2rem; }
    .btn-inquire { min-height:48px; display:inline-flex; align-items:center; justify-content:center; width:100%; }
    .work-page { padding:1.2rem; }
    .news-page { padding:1.2rem 1.2rem 3rem; }
    .news-page h1 { font-size:1.6rem; }
    .breadcrumb { padding:1rem 1.2rem 0; }
  }
`;

function formatPrice(price, lang) {
  if (!price) return '';
  const dkk = Number(price).toLocaleString('da-DK');
  if (lang === 'en') {
    const eur = Math.round(price / 7.46 / 10) * 10; // afrund til nærmeste 10
    return `${dkk} DKK (~€${eur.toLocaleString('en-GB')})`;
  }
  return `${dkk} kr.`;
}

function badgeLabel(status, t) {
  if (status === 'sold') return t.badge.sold;
  if (status === 'not-for-sale') return t.badge.notForSale;
  return t.badge.forSale;
}

function paintingCard(p, t) {
  const label = badgeLabel(p.status, t);
  const cls = p.status === 'sold' ? 'sold' : 'for-sale';
  const inquireSubject = encodeURIComponent(`Forespørgsel: "${p.title}"`);
  const inquireBody = encodeURIComponent(`Hej Camilla,\n\nJeg er interesseret i maleriet "${p.title}" (${p.size || ''}, ${p.year || ''}).\n\nVenlig hilsen`);
  return `
  <a class="painting" href="/vaerk/${(() => { const base = makeSlug(p.title); return base; })()}" data-img="${p.image ? '/images/' + p.image : ''}" data-room="${p.imageCustomer ? '/images/' + p.imageCustomer : (p.imageRoom ? '/images/' + p.imageRoom : '')}" style="text-decoration:none;color:inherit;display:block">
    ${p.image ? `<img src="/images/${p.image}" alt="${p.title}" loading="lazy">` : ''}
    <div class="painting-info">
      <h2>"${p.title}"</h2>
      <div class="meta">${[p.medium, p.size, p.year].filter(Boolean).join(' · ')}</div>
      ${p.price && p.status !== 'sold' ? `<div class="price">${formatPrice(p.price, t.lang)}</div>` : ''}
      <span class="badge ${cls}">${label}</span>
    </div>
  </a>`;
}

function newsCard(n, t, lang) {
  const title = lang === 'en' ? (n.titleEn || n.title) : n.title;
  const text = lang === 'en' ? (n.textEn || n.text) : n.text;
  const excerpt = text.split('\n\n')[0].slice(0, 140) + (text.length > 140 ? '...' : '');
  const tag = t.news.tags[n.tag] || n.tag;
  const dateStr = n.date ? new Date(n.date).toLocaleDateString(lang === 'en' ? 'en-GB' : 'da-DK', {day:'numeric',month:'long',year:'numeric'}) : '';
  return `<a class="news-card" href="/nyhed/${n.id}" style="text-decoration:none;color:inherit;display:block">
    ${n.image ? `<img src="/images/news/${n.image}" alt="${title}">` : `<div class="news-card-img-placeholder"><span>${tag}</span></div>`}
    <div class="news-card-body">
      <div class="tag">${tag}</div>
      <h3>${title}</h3>
      <div class="date">${dateStr}</div>
      <div class="excerpt">${excerpt}</div>
      <span class="read-more">${t.news.readMore}</span>
    </div>
  </a>`;
}

function metaDescription(title, lang) {
  const descs = {
    da: {
      default: 'Originale malerier og mixed media af den danske kunstner Camilla Blauenfeldt (FruB). Akryl på lærred og mixed media til salg. Galleri i Hillerød.',
      malerier: 'Se alle originale akrylmalerier af Camilla Blauenfeldt (FruB). De fleste værker er til salg. Kontakt for priser.',
      mixed: 'Mixed media og collage-værker af Camilla Blauenfeldt (FruB). Papir, avis, blyant og akryl. Mange til salg.',
      om: 'Om den danske kunstner Camilla Blauenfeldt, kendt som FruB. Maler i akryl og mixed media, baseret i Hillerød.',
      kontakt: 'Kontakt Camilla Blauenfeldt (FruB) for køb af malerier, gallerivisit i Hillerød eller andre forespørgsler.',
      nyheder: 'Nyheder og opdateringer fra Camilla Blauenfeldts atelier — nye værker, udstillinger og inspiration.',
    },
    en: {
      default: 'Original paintings and mixed media by Danish artist Camilla Blauenfeldt (FruB). Acrylics on canvas and mixed media for sale. Gallery in Hillerød, Denmark.',
      malerier: 'Browse all original acrylic paintings by Camilla Blauenfeldt (FruB). Most works are for sale. Contact for pricing.',
      mixed: 'Mixed media and collage works by Camilla Blauenfeldt (FruB). Paper, newspaper, pencil and acrylic. Many for sale.',
      om: 'About Danish artist Camilla Blauenfeldt, known as FruB. Painter in acrylics and mixed media, based in Hillerød, Denmark.',
      kontakt: 'Contact Camilla Blauenfeldt (FruB) to purchase paintings, arrange a gallery visit in Hillerød or other enquiries.',
      nyheder: 'News and updates from Camilla Blauenfeldt\'s studio — new works, exhibitions and inspiration.',
    }
  };
  const key = ['Malerier','Paintings'].includes(title) ? 'malerier'
    : ['Mixed Media'].includes(title) ? 'mixed'
    : ['Om','About'].includes(title) ? 'om'
    : ['Kontakt','Contact'].includes(title) ? 'kontakt'
    : ['Nyheder','News'].includes(title) ? 'nyheder'
    : 'default';
  return (descs[lang] || descs.da)[key] || descs.da.default;
}

function renderLayout(req, title, content) {
  const lang = req.lang;
  const t = req.t;
  t.lang = lang;
  const siteTitle = title === 'FruB' ? 'FruB — Camilla Blauenfeldt' : `${title} — Camilla Blauenfeldt (FruB)`;
  const desc = metaDescription(title, lang);
  const canonical = `https://gallerifrub.dk${req.path}`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="p:domain_verify" content="1cf73b82fc09e880882668197aee4688"/>
  <!-- Umami Analytics (cookie-fri) -->
  <script defer src="https://cloud.umami.is/script.js" data-website-id="85a87f4b-ab67-4760-894d-ef1218061f7c"></script>
  <title>${siteTitle}</title>
  <meta name="description" content="${desc}">
  <meta name="author" content="Camilla Blauenfeldt">
  <link rel="canonical" href="${canonical}">
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${siteTitle}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Galleri FruB">
  <meta property="og:locale" content="${lang === 'en' ? 'en_GB' : 'da_DK'}">
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${siteTitle}">
  <meta name="twitter:description" content="${desc}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <style>${css}</style>
</head>
<body>
  <nav>
    <a href="/" class="logo">FruB</a>
    <div class="nav-right">
      <ul>
        <li><a href="/malerier">${t.nav.paintings}</a></li>
        <li><a href="/mixed-media">${t.nav.mixed}</a></li>
        <li><a href="/nyheder">${t.news.title}</a></li>
        <li><a href="/om">${t.nav.about}</a></li>
        <li><a href="/kontakt">${t.nav.contact}</a></li>
      </ul>
      <div class="lang-toggle">
        <a href="?lang=da" class="${lang === 'da' ? 'active' : ''}">DA</a>
        <a href="?lang=en" class="${lang === 'en' ? 'active' : ''}">EN</a>
      </div>
    </div>
    <button class="burger" id="burger" aria-label="Menu" onclick="var m=document.getElementById('mobile-menu');m.classList.toggle('open');this.classList.toggle('open');">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="mobile-menu" id="mobile-menu">
    <a href="/malerier">${t.nav.paintings}</a>
    <a href="/mixed-media">${t.nav.mixed}</a>
    <a href="/nyheder">${t.news.title}</a>
    <a href="/om">${t.nav.about}</a>
    <a href="/kontakt">${t.nav.contact}</a>
    <div class="lang-toggle">
      <a href="?lang=da" class="${lang === 'da' ? 'active' : ''}">DA</a>
      <a href="?lang=en" class="${lang === 'en' ? 'active' : ''}">EN</a>
    </div>
  </div>
  ${content}
  <footer>
    <span>© Camilla Blauenfeldt (FruB)</span>
    <span>
      <a href="https://www.instagram.com/cblauenfeldt" target="_blank">Instagram</a>
      &nbsp;·&nbsp;
      <a href="/kontakt">Kontakt</a>
      &nbsp;·&nbsp;
      <a href="/admin">Admin</a>
    </span>
  </footer>

  <script>
    // Forsidens nyheder — én række
    function fitHomeNews() {
      const g = document.querySelector('.news-grid-home');
      if (!g) return;
      const items = Array.from(g.querySelectorAll('.news-card'));
      items.forEach(i => i.style.display = '');
      const w = g.offsetWidth;
      const cols = w >= 900 ? 3 : w >= 600 ? 2 : 1;
      g.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
      items.forEach(function(item, i) { if (i >= cols) item.style.display = 'none'; });
    }
    window.addEventListener('load', fitHomeNews);
    window.addEventListener('resize', fitHomeNews);

    // Forsideens galleri — vis præcis ét rækkes billeder
    function fitHomeGallery() {
      document.querySelectorAll('.gallery-home').forEach(g => {
        const items = Array.from(g.querySelectorAll('.painting'));
        items.forEach(i => i.style.display = '');
        const w = g.offsetWidth;
        const cols = w >= 900 ? 4 : w >= 600 ? 3 : 2;
        g.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
        items.forEach((item, i) => { if (i >= cols) item.style.display = 'none'; });
      });
    }
    window.addEventListener('load', fitHomeGallery);
    window.addEventListener('resize', fitHomeGallery);

    function toggleRoom(btn, type) {
      const wrap = btn.closest('.work-image') || btn.closest('.painting');
      const img = wrap.querySelector('img');
      const imgEl = wrap.closest('[data-img]') || wrap;
      img.src = type === 'room' ? (imgEl.dataset.room || img.src) : imgEl.dataset.img;
      btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }
    document.getElementById('modal-close').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
    // Burger menu
    (function() {
      var burger = document.getElementById('burger');
      var mobileMenu = document.getElementById('mobile-menu');
      if (!burger || !mobileMenu) return;
      burger.onclick = function() {
        var isOpen = mobileMenu.classList.contains('open');
        if (isOpen) {
          mobileMenu.classList.remove('open');
          burger.classList.remove('open');
        } else {
          mobileMenu.classList.add('open');
          burger.classList.add('open');
        }
      };
      mobileMenu.querySelectorAll('a').forEach(function(a) {
        a.onclick = function() {
          mobileMenu.classList.remove('open');
          burger.classList.remove('open');
        };
      });
    })();
  </script>
</body>
</html>`;
}

// --- Værk-side: ID redirect til slug ---
app.get('/vaerk/:id', (req, res, next) => {
  const id = req.params.id;
  // Kun hvis det ligner et rent ID (tal eller m+tal eller p+tal)
  if (!/^(m|p)?\d+$/.test(id)) return next();
  const allItems = [
    ...JSON.parse(fs.readFileSync(PAINTINGS_FILE)),
    ...JSON.parse(fs.readFileSync(MIXED_FILE))
  ];
  const p = allItems.find(x => x.id === id);
  if (!p) return next();
  const slug = makeSlug(p.title);
  const duplicate = allItems.filter(x => makeSlug(x.title) === slug).length > 1;
  const canonical = duplicate ? `${slug}-${p.id}` : slug;
  return res.redirect(301, `/vaerk/${canonical}`);
});

// --- Sitemap ---
app.get('/sitemap.xml', (req, res) => {
  const base = 'https://gallerifrub.dk';
  const allItems = [
    ...JSON.parse(fs.readFileSync(PAINTINGS_FILE)),
    ...JSON.parse(fs.readFileSync(MIXED_FILE))
  ];
  const news = JSON.parse(fs.readFileSync(NEWS_FILE));
  const staticPages = ['', '/malerier', '/mixed-media', '/nyheder', '/om', '/kontakt'];
  const urls = [
    ...staticPages.map(p => `  <url><loc>${base}${p}</loc><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`),
    ...allItems.map(p => {
      const base2 = makeSlug(p.title);
      const dupe = allItems.filter(y => makeSlug(y.title) === base2).length > 1;
      const slug = dupe ? `${base2}-${p.id}` : base2;
      return `  <url><loc>${base}/vaerk/${slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
    }),
    ...news.map(n => `  <url><loc>${base}/nyhed/${n.id}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`),
  ];
  res.set('Content-Type', 'application/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`);
});

// --- Robots.txt ---
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://gallerifrub.dk/sitemap.xml');
});

// --- Individuel værk-side (slug) ---
app.get('/vaerk/:slug', (req, res) => {
  const t = req.t; t.lang = req.lang;
  const allItems = [
    ...JSON.parse(fs.readFileSync(PAINTINGS_FILE)),
    ...JSON.parse(fs.readFileSync(MIXED_FILE))
  ];
  const slug = req.params.slug;
  const p = allItems.find(x => {
    const base = makeSlug(x.title);
    const dupe = allItems.filter(y => makeSlug(y.title) === base).length > 1;
    return dupe ? `${base}-${x.id}` === slug : base === slug;
  });
  if (!p) return res.status(404).send('Ikke fundet');

  const isMixed = p.id.startsWith('m');
  const backUrl = isMixed ? '/mixed-media' : '/malerier';
  const backLabel = isMixed ? t.nav.mixed : t.nav.paintings;
  const label = badgeLabel(p.status, t);
  const cls = p.status === 'sold' ? 'sold' : 'for-sale';
  const inquireSubject = encodeURIComponent(`${req.lang === 'da' ? 'Forespørgsel' : 'Enquiry'}: "${p.title}"`);
  const inquireBody = encodeURIComponent(`${req.lang === 'da' ? 'Hej Camilla' : 'Dear Camilla'},\n\n${req.lang === 'da' ? 'Jeg er interesseret i' : 'I am interested in'} "${p.title}" (${p.size || ''}, ${p.year || ''}).\n\n${req.lang === 'da' ? 'Venlig hilsen' : 'Kind regards'}`);
  const desc = req.lang === 'en' ? (p.descriptionEn || p.description || '') : (p.description || '');
  const descHtml = desc.split('\n\n').filter(Boolean).map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`).join('');

  // Schema.org + OG for værkside
  const workDesc = req.lang === 'en' ? (p.descriptionEn || p.description || '') : (p.description || '');
  const workImg = p.image ? `https://gallerifrub.dk/images/${p.image}` : '';
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: p.title,
    description: workDesc.split('\n\n')[0] || '',
    image: workImg,
    creator: { '@type': 'Person', name: 'Camilla Blauenfeldt', alternateName: 'FruB' },
    artMedium: p.medium || '',
    width: p.size ? p.size.split('×')[1] : '',
    height: p.size ? p.size.split('×')[0] : '',
    dateCreated: p.year ? String(p.year) : '',
    offers: p.status === 'for-sale' ? { '@type': 'Offer', availability: 'https://schema.org/InStock', priceCurrency: 'DKK', price: p.price || '' } : undefined,
  });

  res.send(renderLayout(req, `"${p.title}"`, `
  <script type="application/ld+json">${schema}</script>
  ${workImg ? `<meta property="og:image" content="${workImg}">` : ''}
  <div class="breadcrumb">
    <a href="${backUrl}">← ${backLabel}</a>
  </div>
  <div class="work-page">
    ${(() => {
      // imageCustomer har altid forrang over imageRoom
      const roomSrc = p.imageCustomer ? '/images/'+p.imageCustomer : (p.imageRoom ? '/images/'+p.imageRoom : '');
      const isCustomer = !!p.imageCustomer;
      const isAI = !p.imageCustomer && !!p.imageRoom;
      const toggleLabel = isCustomer ? (req.lang === 'da' ? 'I sit nye hjem' : 'In its new home') : (req.lang === 'da' ? 'Visualisering' : 'Visualisation');
      return `<div class="work-image" data-img="${p.image ? '/images/'+p.image : ''}" data-room="${roomSrc}">`;
    })()}
      ${p.image ? `<img src="/images/${p.image}" alt="${p.title}" id="work-main-img">` : ''}
      ${(p.imageCustomer || p.imageRoom) ? `<div>
        <div class="room-toggle" style="margin-top:0.75rem">
          <button class="active" onclick="toggleRoom(this,'painting');document.getElementById('ai-note-${p.id}').style.display='none'">${req.lang === 'da' ? 'Værk' : 'Artwork'}</button>
          <button onclick="toggleRoom(this,'room');document.getElementById('ai-note-${p.id}').style.display='block'">${p.imageCustomer ? (req.lang === 'da' ? 'I sit nye hjem' : 'In its new home') : (req.lang === 'da' ? 'Visualisering' : 'Visualisation')}</button>
        </div>
        ${p.imageCustomer ? `<div id="ai-note-${p.id}" style="display:none;font-size:0.65rem;color:#bbb;margin-top:0.3rem;letter-spacing:0.05em">${req.lang === 'da' ? 'Billede venligst udlånt af den heldige ejer' : 'Image kindly shared by its lucky owner'}</div>` : p.imageRoom ? `<div id="ai-note-${p.id}" style="display:none;font-size:0.65rem;color:#bbb;margin-top:0.3rem;letter-spacing:0.05em">${req.lang === 'da' ? 'AI-genereret visualisering' : 'AI-generated visualisation'}</div>` : `<div id="ai-note-${p.id}" style="display:none"></div>`}
      </div>` : ''}
    </div>
    <div class="work-details">
      <h1>"${p.title}"</h1>
      <div class="meta">${[p.medium, p.size, p.year].filter(Boolean).join(' · ')}</div>
      <div class="work-description">${descHtml || `<p><em>${req.lang === 'da' ? 'Beskrivelse følger.' : 'Description to follow.'}</em></p>`}</div>
      <div class="work-actions">
        ${p.price && p.status !== 'sold' ? `<div class="price">${formatPrice(p.price, req.lang)}</div>` : ''}
        <span class="badge ${cls}" style="display:block;margin-bottom:1rem">${label}</span>
        ${p.status !== 'sold' ? `<a class="btn-inquire" href="mailto:camilla@blauenfeldt.dk?subject=${inquireSubject}&body=${inquireBody}">${req.lang === 'da' ? 'Forespørg om dette værk' : 'Enquire about this work'}</a>` : ''}
      </div>
    </div>
  </div>
  `));
});

// --- Forside ---
app.get('/', (req, res) => {
  const t = req.t; t.lang = req.lang;
  const paintings = JSON.parse(fs.readFileSync(PAINTINGS_FILE)).slice(0, 4);
  const mixed = JSON.parse(fs.readFileSync(MIXED_FILE)).slice(0, 4);
  res.send(renderLayout(req, 'FruB', `
  <div class="hero">
    <img src="/images/forside1.jpg" alt="FruB">
    <div class="hero-overlay">
      <h1>FruB</h1>
      <p>${t.home.tagline}</p>
      <a href="/malerier" class="hero-cta">${t.home.seeAll.replace(' →','')}</a>
    </div>
  </div>

  <div class="section">
    <div class="section-header">
      <h2>${t.home.latestPaintings}</h2>
      <p>${t.home.acrylicSub}</p>
    </div>
    <div class="gallery gallery-home">${paintings.map(p => paintingCard(p, t)).join('')}</div>
    <div class="see-more"><a href="/malerier">${t.home.seeAll}</a></div>
  </div>

  <div class="section" style="background:#f4f2ef; padding-top:4rem; padding-bottom:4rem;">
    <div class="section-header">
      <h2>${t.nav.mixed}</h2>
    </div>
    <div class="gallery gallery-home">${mixed.map(p => paintingCard(p, t)).join('')}</div>
    <div class="see-more"><a href="/mixed-media">${t.home.seeAllMixed}</a></div>
  </div>

  <div class="section" style="background:#f9f8f6;">
    <div class="section-header">
      <h2>${t.news.title}</h2>
      <p>${t.news.sub}</p>
    </div>
    <div class="news-grid news-grid-home">${(() => {
      const items = JSON.parse(fs.readFileSync(NEWS_FILE)).sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,4);
      return items.map(n => newsCard(n, t, req.lang)).join('');
    })()}</div>
    <div class="see-more"><a href="/nyheder">${t.news.seeAll}</a></div>
  </div>

  <div class="instagram-section">
    <h2>Instagram</h2>
    <p>${req.lang === 'da' ? 'Følg med i Camillas daglige arbejde' : 'Follow Camilla\'s daily practice'}</p>
    <div style="max-width:1200px;margin:0 auto 2rem">
      <div data-key="Instagram Feed " class="ft" id="ftxw51yj3"></div>
      <script src="https://wdg.fouita.com/widgets/0x41d230.js"></script>
    </div>
    <a href="https://www.instagram.com/cblauenfeldt" target="_blank" class="instagram-link">@cblauenfeldt</a>
  </div>
  `));
});

// --- Malerier ---
app.get('/malerier', (req, res) => {
  const t = req.t; t.lang = req.lang;
  const paintings = JSON.parse(fs.readFileSync(PAINTINGS_FILE));
  // Fyld op til nærmeste multiple af 3 med tomme bokse
  const cols = 3;
  const remainder = paintings.length % cols;
  const placeholders = remainder === 0 ? '' : Array(cols - remainder).fill('<div class="painting-placeholder"></div>').join('');
  res.send(renderLayout(req, t.nav.paintings, `
  <div class="section">
    <div class="section-header">
      <h2>${t.paintings.title}</h2>
      <p>${t.paintings.sub}</p>
    </div>
    <div class="gallery">${paintings.map(p => paintingCard(p, t)).join('')}${placeholders}</div>
  </div>
  `));
});

// --- Mixed Media ---
app.get('/mixed-media', (req, res) => {
  const t = req.t; t.lang = req.lang;
  const mixed = JSON.parse(fs.readFileSync(MIXED_FILE));
  const cols = 3;
  const remainder = mixed.length % cols;
  const placeholders = remainder === 0 ? '' : Array(cols - remainder).fill('<div class="painting-placeholder"></div>').join('');
  res.send(renderLayout(req, t.nav.mixed, `
  <div class="section">
    <div class="section-header">
      <h2>${t.mixed.title}</h2>
      <p>${t.mixed.sub}</p>
    </div>
    <div class="gallery">${mixed.map(p => paintingCard(p, t)).join('')}${placeholders}</div>
  </div>
  `));
});

// --- Om ---
app.get('/om', (req, res) => {
  const t = req.t; t.lang = req.lang;
  const processImgs = processPhotos.map(f => `<img src="/images/${f}" alt="" loading="lazy">`).join('');
  res.send(renderLayout(req, t.nav.about, `
  <div class="about-wrap">
    <div class="about-top">
      <img src="/images/camilla.jpeg" alt="Camilla Blauenfeldt">
      <div>
        <h2>${t.about.title}</h2>
        <p>${t.about.p1}</p>
        <p>${t.about.p2}</p>
        <p>${t.about.p3}</p>
        <p>${t.about.p4}</p>
        <p><em>${t.about.p5}</em></p>

      </div>
    </div>

    <div style="margin-bottom:4rem">
      <video controls style="width:100%;max-width:800px;display:block;margin:0 auto" preload="metadata">
        <source src="/videos/passion_video.mp4" type="video/mp4">
      </video>
      <p style="text-align:center;font-size:0.85rem;color:#999;margin-top:1rem">${req.lang === 'da' ? 'I 2024 lavede en gruppe studerende fra Copenhagen Business College videoer om Camillas inspirationskilder som del af deres mediestudie.' : 'In 2024 a group of talented students from Copenhagen Business College made a few videos about Camilla\'s sources of inspiration, as part of their media studies.'}</p>
    </div>

    <p class="process-title">${req.lang === 'da' ? 'Forskellige billeder fra værkstedet og udstillinger' : 'Images from the studio and exhibitions'}</p>
    <div class="process-grid">${processImgs}</div>
  </div>
  `));
});

// --- Kontakt ---
app.get('/kontakt', (req, res) => {
  const t = req.t;
  const contactImgs = contactPhotosAll.map(f => `<img src="/images/${f}" alt="" loading="lazy">`).join('');
  res.send(renderLayout(req, t.nav.contact, `
  <div class="about-wrap">
    <div class="about-top">
      <img src="/images/camilla-atelier.jpg" alt="Camilla Blauenfeldt i atelieret">
      <div>
        <h2>${t.contact.title}</h2>
        <p>${t.contact.intro}</p>
        <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.6rem">
          <a href="tel:+4540957818" style="font-size:0.9rem;color:#444;text-decoration:none">+45 40 95 78 18</a>
          <a href="mailto:camilla@blauenfeldt.dk" style="font-size:0.9rem;color:#444;text-decoration:none">camilla@blauenfeldt.dk</a>
          <a href="https://www.instagram.com/cblauenfeldt" target="_blank" style="font-size:0.9rem;color:#444;text-decoration:none">${req.lang === 'da' ? 'Skriv en DM på Instagram' : 'Send a DM on Instagram'}</a>
        </div>
        <p style="margin-top:1.5rem;font-size:0.85rem;color:#aaa;line-height:1.8">
          ${t.contact.visit}<br>${t.contact.shipping}
        </p>
        <p style="margin-top:1rem;font-size:0.85rem;color:#aaa">
          ${t.contact.also} <a href="https://www.artfinder.com/artist/camilla-blauenfeldt/" target="_blank" style="color:#aaa">Artfinder</a>.
        </p>
      </div>
    </div>
  </div>
  <div style="max-width:1000px;margin:0 auto;padding:0 2rem 5rem">
    <p class="process-title">${req.lang === 'da' ? 'Forskellige billeder fra værkstedet og udstillinger' : 'Images from the studio and exhibitions'}</p>
    <div class="process-grid">${contactImgs}</div>
  </div>
  `));
});

// --- Nyheder oversigt ---
app.get('/nyheder', (req, res) => {
  const t = req.t; t.lang = req.lang;
  const news = JSON.parse(fs.readFileSync(NEWS_FILE)).sort((a,b)=>new Date(b.date)-new Date(a.date));
  res.send(renderLayout(req, t.news.title, `
  <div class="section">
    <div class="section-header">
      <h2>${t.news.title}</h2>
      <p>${t.news.sub}</p>
    </div>
  </div>
  <div class="news-grid">${news.map(n => newsCard(n, t, req.lang)).join('')}</div>
  <div class="instagram-section" style="margin-top:2rem">
    <h2>Instagram</h2>
    <p>${req.lang === 'da' ? 'Følg med i Camillas daglige arbejde' : 'Follow Camilla\'s daily practice'}</p>
    <div style="max-width:1200px;margin:0 auto 2rem">
      <div data-key="Instagram Feed " class="ft" id="ftxw51yj3"></div>
      <script src="https://wdg.fouita.com/widgets/0x41d230.js"></script>
    </div>
    <a href="https://www.instagram.com/cblauenfeldt" target="_blank" class="instagram-link">@cblauenfeldt</a>
  </div>
  `));
});

// --- Enkelt nyhed ---
app.get('/nyhed/:id', (req, res) => {
  const t = req.t; t.lang = req.lang;
  const news = JSON.parse(fs.readFileSync(NEWS_FILE));
  const n = news.find(x => x.id === req.params.id);
  if (!n) return res.status(404).send('Ikke fundet');
  const title = req.lang === 'en' ? (n.titleEn || n.title) : n.title;
  const text = req.lang === 'en' ? (n.textEn || n.text) : n.text;
  const tag = t.news.tags[n.tag] || n.tag;
  const dateStr = n.date ? new Date(n.date).toLocaleDateString(req.lang === 'en' ? 'en-GB' : 'da-DK', {day:'numeric',month:'long',year:'numeric'}) : '';
  const bodyHtml = text.split('\n\n').filter(Boolean).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  res.send(renderLayout(req, title, `
  <div class="breadcrumb">
    <a href="/nyheder">← ${t.news.title}</a>
  </div>
  <div class="news-page">
    <div class="tag">${tag}</div>
    <h1>${title}</h1>
    <div class="date">${dateStr}</div>
    ${n.image ? `<img src="/images/news/${n.image}" alt="${title}">` : ''}
    <div class="body">${bodyHtml}</div>
  </div>
  `));
});

// --- Admin login ---
app.get('/admin/login', (req, res) => {
  const error = req.query.error ? '<p style="color:#c00;font-size:0.85rem;margin-bottom:1rem">Forkert password</p>' : '';
  res.send(`<!DOCTYPE html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Admin</title>
  <style>*{margin:0;padding:0;box-sizing:border-box}html{font-size:16px}body{font-family:Georgia,serif;background:#f9f8f6;display:flex;justify-content:center;align-items:center;min-height:100vh;padding:1.5rem}.box{background:white;border:1px solid #e0ddd8;padding:2rem;width:100%;max-width:420px}h2{font-weight:normal;margin-bottom:1.5rem;letter-spacing:0.15em;font-size:1.3rem}input{width:100%;padding:1rem;margin-bottom:1rem;border:1px solid #ddd;font-size:1rem;-webkit-appearance:none;border-radius:0}button{width:100%;padding:1rem;background:#1a1a1a;color:white;border:none;cursor:pointer;font-size:1rem;letter-spacing:0.1em;min-height:50px}</style>
  </head><body><div class="box"><h2>ADMIN</h2>${error}
  <form method="POST" action="/admin/login"><input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password"><button>LOG IND</button></form>
  </div></body></html>`);
});

app.post('/admin/login', (req, res) => {
  if (req.body.password?.toLowerCase() === ADMIN_PASSWORD) { req.session.auth = true; res.redirect('/admin'); }
  else res.redirect('/admin/login?error=1');
});

app.get('/admin/logout', (req, res) => { req.session.destroy(); res.redirect('/admin/login'); });

function requireAuth(req, res, next) {
  if (req.session.auth) return next();
  res.redirect('/admin/login');
}

app.get('/admin', requireAuth, (req, res) => {
  const section = req.query.section || 'paintings';
  const paintings = JSON.parse(fs.readFileSync(PAINTINGS_FILE));
  const mixed = JSON.parse(fs.readFileSync(MIXED_FILE));
  const news = JSON.parse(fs.readFileSync(NEWS_FILE));
  const adminCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#f2f0ed;color:#222}
  .admin-wrap{display:grid;grid-template-columns:200px 1fr;min-height:100vh}
  .sidebar{background:#1a1a1a;color:white;padding:0;display:flex;flex-direction:column}
  .sidebar-logo{padding:1.5rem 1.5rem 1rem;font-size:1.1rem;letter-spacing:.2em;border-bottom:1px solid #333}
  .sidebar-logo span{display:block;font-size:.65rem;color:#888;letter-spacing:.08em;margin-top:.25rem;text-transform:uppercase}
  .sidebar nav{flex:1;padding:.75rem 0}
  .sidebar nav a{display:block;padding:.65rem 1.5rem;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;color:#aaa;text-decoration:none;transition:all .2s}
  .sidebar nav a:hover{color:white;background:#2a2a2a}
  .sidebar nav a.active{color:white;background:#333;border-left:2px solid white}
  .sidebar-footer{padding:1rem 1.5rem;border-top:1px solid #333;font-size:.72rem}
  .sidebar-footer a{color:#666;text-decoration:none;display:block;margin-bottom:.4rem}
  .sidebar-footer a:hover{color:#aaa}
  .main{padding:2rem;overflow-y:auto}
  .main-header{margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid #e0ddd8}
  .main-header h1{font-size:1.1rem;font-weight:normal;letter-spacing:.1em}
  .section-panel{display:none}.section-panel.active{display:block}
  h2{font-weight:normal;font-size:.82rem;letter-spacing:.15em;text-transform:uppercase;margin:1.5rem 0 .75rem;border-bottom:1px solid #e8e5e0;padding-bottom:.4rem;color:#555}
  .upload-form{background:white;border:1px solid #e0ddd8;padding:1.5rem;margin-bottom:1.5rem;border-radius:2px}
  .field{margin-bottom:.8rem}label{display:block;font-size:.75rem;color:#888;margin-bottom:.25rem;letter-spacing:.05em}
  input,select,textarea{width:100%;padding:.5rem;border:1px solid #ddd;font-size:1rem;font-family:Georgia,serif}
  input[type=file]{border:none;padding:0}.row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  button.submit{background:#1a1a1a;color:white;border:none;padding:.5rem 1.2rem;cursor:pointer;font-size:.78rem;letter-spacing:.1em;margin-top:.5rem}
  .list{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:1rem}
  .card{background:white;border:1px solid #e0ddd8}.card img{width:100%;aspect-ratio:3/4;object-fit:cover;display:block}
  .card .info{padding:.6rem;font-size:.78rem}.card h3{font-weight:normal;font-size:.8rem;font-style:italic}
  .card .meta{color:#aaa;font-size:.72rem;margin-top:.15rem}
  .del{display:block;width:100%;padding:.3rem;background:#f8f5f3;border:none;cursor:pointer;color:#ccc;font-size:.72rem;margin-top:.4rem;letter-spacing:.05em}.del:hover{background:#ffe0e0;color:#c00}
  @media(max-width:600px){.admin-wrap{grid-template-columns:1fr}.sidebar{display:flex;flex-direction:row;flex-wrap:wrap;min-height:auto}.sidebar-logo{display:none}.sidebar nav{display:flex;flex-direction:row;flex-wrap:wrap;padding:.4rem}.sidebar nav a{padding:.4rem .8rem;font-size:.72rem}.sidebar-footer{display:none}}
  `;

  function newsFormHtml() {
    return `<form class="upload-form" method="POST" action="/admin/news/add" enctype="multipart/form-data">
      <div class="field">
        <label>Billede (valgfrit)</label>
        <img id="prev-news-new" style="display:none;max-width:200px;margin-bottom:.5rem;display:none">
        <input type="file" name="newsImage" accept="image/*" onchange="previewImg(this,'prev-news-new')">
      </div>
      <div class="field"><label>Titel (dansk)</label><input type="text" name="title" required></div>
      <div class="field"><label>Titel (engelsk)</label><input type="text" name="titleEn"></div>
      <div class="row">
        <div class="field"><label>Dato</label><input type="date" name="date" value="${new Date().toISOString().slice(0,10)}"></div>
        <div class="field"><label>Kategori</label><select name="tag">
          <option value="atelier">Atelier</option>
          <option value="udstilling">Udstilling</option>
          <option value="inspiration">Inspiration</option>
          <option value="presse">Presse</option>
          <option value="andet">Andet</option>
        </select></div>
      </div>
      <div class="field"><label>Tekst (dansk)</label><textarea name="text" id="news-da" rows="6" style="width:100%;padding:.45rem;border:1px solid #ddd;font-size:.9rem;font-family:Georgia,serif;resize:vertical" required></textarea></div>
      <div class="field">
        <label>Tekst (engelsk) <span style="color:#aaa;font-weight:normal">(auto-oversat — rediger hvis nødvendigt)</span></label>
        <textarea name="textEn" id="news-en" rows="6" style="width:100%;padding:.45rem;border:1px solid #ddd;font-size:.9rem;font-family:Georgia,serif;resize:vertical"></textarea>
        <button type="button" onclick="autoTranslate('news-da','news-en')" style="margin-top:.3rem;padding:.3rem .8rem;font-size:.72rem;letter-spacing:.08em;background:#f4f2ef;border:1px solid #ddd;cursor:pointer">Klik her for at auto-oversætte</button>
      </div>
      <button class="submit">Tilføj nyhed</button>
    </form>`;
  }

  function newsCardAdmin(n) {
    return `<div style="display:flex;align-items:center;gap:.75rem;padding:.6rem 0;border-bottom:1px solid #f0ece8">
      <div style="flex:1;font-size:.85rem">
        <strong style="font-weight:normal;font-style:italic">${n.title}</strong>
        <span style="color:#aaa;font-size:.75rem;margin-left:.5rem">${n.date || ''} · ${n.tag}</span>
      </div>
      <a href="/nyhed/${n.id}" target="_blank" style="font-size:.72rem;color:#888;text-decoration:none;padding:.2rem .5rem;border:1px solid #ddd;background:white">Se →</a>
      <a href="/admin/news/edit/${n.id}" style="font-size:.72rem;color:#888;text-decoration:none;padding:.2rem .5rem;border:1px solid #ddd;background:white">Rediger</a>
      <form method="POST" action="/admin/news/delete" onsubmit="return confirm('Slet?')" style="margin:0">
        <input type="hidden" name="id" value="${n.id}">
        <button class="del" style="width:auto;padding:.2rem .5rem">Slet</button>
      </form>
    </div>`;
  }

  function formHtml(col) {
    return `<form class="upload-form" method="POST" action="/admin/add?col=${col}" enctype="multipart/form-data">
      <div class="field">
        <label>Billede (maleri)</label>
        <img id="prev-new-image" style="display:none;max-width:200px;margin-bottom:.5rem">
        <input type="file" name="image" accept="image/*" required onchange="previewImg(this,'prev-new-image')">
      </div>
      <div class="field">
        <label>Billede i rum (valgfrit)</label>
        <img id="prev-new-room" style="display:none;max-width:200px;margin-bottom:.5rem">
        <input type="file" name="imageRoom" accept="image/*" onchange="previewImg(this,'prev-new-room')">
      </div>
      <div class="field">
        <label>Billede i sit nye hjem — rigtigt foto (valgfrit)</label>
        <img id="prev-new-customer" style="display:none;max-width:200px;margin-bottom:.5rem">
        <input type="file" name="imageCustomer" accept="image/*" onchange="previewImg(this,'prev-new-customer')">
      </div>
      <div class="field"><label>Titel</label><input type="text" name="title" required></div>
      <div class="row">
        <div class="field"><label>Materiale</label><input type="text" name="medium"></div>
        <div class="field">
          <label>Størrelse — højde × bredde</label>
          <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:.4rem">
            <input type="number" name="height_cm" placeholder="højde" min="1">
            <span style="color:#aaa;font-size:.85rem">×</span>
            <input type="number" name="width_cm" placeholder="bredde" min="1">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="field"><label>År</label><input type="number" name="year"></div>
        <div class="field"><label>Pris (DKK)</label><input type="number" name="price"></div>
      </div>
      <div class="field"><label>Status</label><select name="status">
        <option value="for-sale">Til salg</option>
        <option value="sold">Solgt</option>
        <option value="not-for-sale">Ikke til salg</option>
      </select></div>
      <div class="field">
        <label>Beskrivelse på dansk</label>
        <textarea name="description" id="desc-da-new" rows="5" style="width:100%;padding:.45rem;border:1px solid #ddd;font-size:.9rem;font-family:Georgia,serif;resize:vertical" oninput="clearEnAuto(this)"></textarea>
      </div>
      <div class="field">
        <label>Beskrivelse på engelsk <span style="color:#aaa;font-weight:normal">(auto-oversat — rediger hvis nødvendigt)</span></label>
        <textarea name="descriptionEn" id="desc-en-new" rows="5" style="width:100%;padding:.45rem;border:1px solid #ddd;font-size:.9rem;font-family:Georgia,serif;resize:vertical"></textarea>
        <button type="button" onclick="autoTranslate('desc-da-new','desc-en-new')" style="margin-top:.3rem;padding:.3rem .8rem;font-size:.72rem;letter-spacing:.08em;background:#f4f2ef;border:1px solid #ddd;cursor:pointer">Klik her for at auto-oversætte</button>
      </div>
      <button class="submit">Tilføj</button>
    </form>`;
  }

  function cardHtml(p, col) {
    return `<div class="card" data-id="${p.id}">  
      <div style="text-align:center;padding:.3rem;background:#f8f6f3;cursor:grab;color:#ccc;font-size:.85rem" class="drag-handle">≡</div>
      ${p.image ? `<img src="/images/${p.image}" alt="${p.title}">` : '<div style="height:120px;background:#f0ece8"></div>'}
      <div class="info">
        <h3>"${p.title}"</h3>
        <div class="meta">${p.year ? p.year + ' · ' : ''}${p.status}${p.price ? ' · ' + Number(p.price).toLocaleString('da-DK') + ' kr.' : ''}</div>
        <a href="/admin/painting/edit/${p.id}?col=${col}" style="display:block;text-align:center;padding:.25rem;margin-top:.4rem;font-size:.72rem;color:#888;text-decoration:none;border:1px solid #ddd;background:white">Rediger</a>
        <form method="POST" action="/admin/delete?col=${col}" onsubmit="return confirm('Slet?')">
          <input type="hidden" name="id" value="${p.id}">
          <button class="del">Slet</button>
        </form>
      </div>
    </div>`;
  }

  const navItems = [
    { key: 'paintings', label: 'Malerier' },
    { key: 'mixed', label: 'Mixed Media' },
    { key: 'news', label: 'Nyheder' },
  ];
  const navHtml = navItems.map(i =>
    `<a href="/admin?section=${i.key}" class="${section === i.key ? 'active' : ''}">${i.label}</a>`
  ).join('');

  res.send(`<!DOCTYPE html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Admin — FruB</title><style>${adminCss}</style></head>
  <body>
  <div class="admin-wrap">
    <div class="sidebar">
      <div class="sidebar-logo">FruB<span>Admin</span></div>
      <nav>${navHtml}</nav>
      <div class="sidebar-footer">
        <a href="/" target="_blank">Se site →</a>
        <a href="/admin/logout">Log ud</a>
      </div>
    </div>
    <div class="main">
      ${section === 'paintings' ? `
        <div class="main-header"><h1>Malerier (${paintings.length})</h1></div>
        <h2>Eksisterende malerier <span style="font-size:.72rem;color:#aaa;font-weight:normal;letter-spacing:0">— træk for at ændre rækkefølge</span></h2>
        <div class="list sortable" id="sort-paintings" data-col="paintings">${paintings.map(p => cardHtml(p, 'paintings')).join('')}</div>
        <h2>Tilføj nyt maleri</h2>${formHtml('paintings')}
      ` : ''}
      ${section === 'mixed' ? `
        <div class="main-header"><h1>Mixed Media (${mixed.length})</h1></div>
        <h2>Eksisterende værker <span style="font-size:.72rem;color:#aaa;font-weight:normal;letter-spacing:0">— træk for at ændre rækkefølge</span></h2>
        <div class="list sortable" id="sort-mixed" data-col="mixed">${mixed.map(p => cardHtml(p, 'mixed')).join('')}</div>
        <h2>Tilføj nyt værk</h2>${formHtml('mixed')}
      ` : ''}
      ${section === 'news' ? `
        <div class="main-header"><h1>Nyheder (${news.length})</h1></div>
        <h2>Eksisterende nyheder</h2>
        <div>${news.map(n => newsCardAdmin(n)).join('')}</div>
        <h2>Tilføj ny nyhed</h2>${newsFormHtml()}
      ` : ''}
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
  <script>
  function previewImg(input, previewId) {
    const prev = document.getElementById(previewId);
    if (!prev || !input.files || !input.files[0]) return;
    prev.style.display = 'block';
    const reader = new FileReader();
    reader.onload = function(e) { prev.src = e.target.result; };
    reader.readAsDataURL(input.files[0]);
  }
  document.querySelectorAll('.sortable').forEach(function(el) {
    el.querySelectorAll('.card').forEach(function(c) { c.style.cursor = 'grab'; });
    Sortable.create(el, {
      animation: 150,
      onEnd: function() {
        const col = el.dataset.col;
        const ids = Array.from(el.querySelectorAll('.card')).map(c => c.dataset.id);
        fetch('/admin/reorder', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({col, ids})
        }).then(r => r.json()).then(d => {
          if (d.ok) {
            el.style.outline = '2px solid #5a7a5a';
            setTimeout(function() { el.style.outline = ''; }, 1000);
          }
        });
      }
    });
  });
  async function autoTranslate(srcId, dstId) {
    const src = document.getElementById(srcId).value.trim();
    if (!src) return;
    const dst = document.getElementById(dstId);
    dst.value = '(oversætter...)';
    try {
      const r = await fetch('/admin/translate', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({text: src})
      });
      const d = await r.json();
      dst.value = d.translated || src;
    } catch(e) {
      dst.value = src;
    }
  }
  function clearEnAuto(el) {
    // Intet - brugeren kan stadig redigere
  }
  </script>
  </body></html>`);
});

// --- Auto-oversat endpoint ---
app.post('/admin/translate', requireAuth, express.json(), async (req, res) => {
  const text = req.body.text || '';
  try {
    const https = require('https');
    // Split i afsnit og overstæt hvert for sig (MyMemory max 500 tegn)
    const paragraphs = text.split(/\n\n+/).filter(Boolean);
    const translated = [];
    for (const para of paragraphs) {
      // Split lange afsnit yderligere ved 450 tegn
      const chunks = [];
      let remaining = para;
      while (remaining.length > 450) {
        const cut = remaining.lastIndexOf('. ', 450);
        if (cut > 0) {
          chunks.push(remaining.slice(0, cut + 1));
          remaining = remaining.slice(cut + 2);
        } else {
          chunks.push(remaining.slice(0, 450));
          remaining = remaining.slice(450);
        }
      }
      if (remaining) chunks.push(remaining);

      const paraTranslated = [];
      for (const chunk of chunks) {
        const encoded = encodeURIComponent(chunk);
        const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=da|en`;
        const data = await new Promise((resolve, reject) => {
          https.get(url, r => {
            let buf = '';
            r.on('data', d => buf += d);
            r.on('end', () => { try { resolve(JSON.parse(buf)); } catch(e) { resolve({}); } });
          }).on('error', reject);
        });
        paraTranslated.push(data.responseData?.translatedText || chunk);
      }
      translated.push(paraTranslated.join(' '));
    }
    res.json({ translated: translated.join('\n\n') });
  } catch(e) {
    res.json({ translated: text });
  }
});

// --- Edit maleri ---
app.get('/admin/painting/edit/:id', requireAuth, (req, res) => {
  const col = req.query.col || 'paintings';
  const file = col === 'mixed' ? MIXED_FILE : PAINTINGS_FILE;
  const items = JSON.parse(fs.readFileSync(file));
  const p = items.find(x => x.id === req.params.id);
  if (!p) return res.redirect('/admin?section=' + (col === 'mixed' ? 'mixed' : 'paintings'));
  const adminCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#f2f0ed;color:#222}.wrap{max-width:700px;margin:2rem auto;padding:0 1.5rem}h1{font-size:1.1rem;font-weight:normal;letter-spacing:.1em;margin-bottom:1.5rem}.back{font-size:.78rem;color:#aaa;text-decoration:none;display:block;margin-bottom:1.5rem}.form{background:white;border:1px solid #e0ddd8;padding:1.5rem}.field{margin-bottom:.8rem}label{display:block;font-size:.75rem;color:#888;margin-bottom:.25rem}input,select,textarea{width:100%;padding:.45rem;border:1px solid #ddd;font-size:.9rem;font-family:Georgia,serif}input[type=file]{border:none;padding:0}.row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}button{background:#1a1a1a;color:white;border:none;padding:.5rem 1.2rem;cursor:pointer;font-size:.78rem;letter-spacing:.1em;margin-top:.5rem}.img-preview{width:100%;max-width:200px;margin-bottom:.5rem}`;
  res.send(`<!DOCTYPE html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rediger — FruB Admin</title><style>${adminCss}</style></head><body>
  <div class="wrap">
    <a class="back" href="/admin?section=${col === 'mixed' ? 'mixed' : 'paintings'}">← Tilbage</a>
    <h1>Rediger: "${p.title}"</h1>
    <form class="form" method="POST" action="/admin/painting/update?col=${col}" enctype="multipart/form-data">
      <input type="hidden" name="id" value="${p.id}">
      <div class="field">
        <label>Maleri-billede</label>
        <div id="wrap-image">
          ${p.image ? `<img id="prev-image" class="img-preview" src="/images/${p.image}" style="display:block;margin-bottom:.5rem"><button type="button" onclick="deleteImg('image','prev-image','${p.id}','${col}')" style="display:block;margin-bottom:.5rem;padding:.6rem 1rem;background:#fff0f0;border:1px solid #ffcccc;color:#c00;font-size:.85rem;cursor:pointer;width:100%;text-align:left">🗑 Slet billede</button>` : '<img id="prev-image" style="display:none;max-width:200px;margin-bottom:.5rem">'}
        </div>
        <input type="file" name="image" accept="image/*" onchange="previewImg(this,'prev-image')">
      </div>
      <div class="field">
        <label>Billede i rum (valgfrit)</label>
        <div id="wrap-imageRoom">
          ${p.imageRoom ? `<img id="prev-room" class="img-preview" src="/images/${p.imageRoom}" style="display:block;margin-bottom:.5rem"><button type="button" onclick="deleteImg('imageRoom','prev-room','${p.id}','${col}')" style="display:block;margin-bottom:.5rem;padding:.6rem 1rem;background:#fff0f0;border:1px solid #ffcccc;color:#c00;font-size:.85rem;cursor:pointer;width:100%;text-align:left">🗑 Slet billede</button>` : '<img id="prev-room" style="display:none;max-width:200px;margin-bottom:.5rem">'}
        </div>
        <input type="file" name="imageRoom" accept="image/*" onchange="previewImg(this,'prev-room')">
      </div>
      <div class="field">
        <label>Billede i sit nye hjem — rigtigt foto (valgfrit)</label>
        <div id="wrap-imageCustomer">
          ${p.imageCustomer ? `<img id="prev-customer" class="img-preview" src="/images/${p.imageCustomer}" style="display:block;margin-bottom:.5rem"><button type="button" onclick="deleteImg('imageCustomer','prev-customer','${p.id}','${col}')" style="display:block;margin-bottom:.5rem;padding:.6rem 1rem;background:#fff0f0;border:1px solid #ffcccc;color:#c00;font-size:.85rem;cursor:pointer;width:100%;text-align:left">🗑 Slet billede</button>` : '<img id="prev-customer" style="display:none;max-width:200px;margin-bottom:.5rem">'}
        </div>
        <input type="file" name="imageCustomer" accept="image/*" onchange="previewImg(this,'prev-customer')">
      </div>
      <div class="field"><label>Titel</label><input type="text" name="title" value="${p.title}" required></div>
      <div class="row">
        <div class="field"><label>Materiale</label><input type="text" name="medium" value="${p.medium||''}"></div>
        <div class="field">
          <label>Størrelse — højde × bredde</label>
          <div style="display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:.4rem">
            <div><input type="number" name="height_cm" placeholder="højde" min="1" value="${p.height_cm||''}"></div>
            <span style="color:#aaa;font-size:.85rem">×</span>
            <div><input type="number" name="width_cm" placeholder="bredde" min="1" value="${p.width_cm||''}"></div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="field"><label>År</label><input type="number" name="year" value="${p.year||''}"></div>
        <div class="field"><label>Pris (DKK)</label><input type="number" name="price" value="${p.price||''}"></div>
      </div>
      <div class="field"><label>Status</label><select name="status">
        <option value="for-sale" ${p.status==='for-sale'?'selected':''}>Til salg</option>
        <option value="sold" ${p.status==='sold'?'selected':''}>Solgt</option>
        <option value="not-for-sale" ${p.status==='not-for-sale'?'selected':''}>Ikke til salg</option>
      </select></div>
      <div class="field"><label>Beskrivelse (dansk)</label><textarea name="description" rows="5" id="desc-da">${p.description||''}</textarea></div>
      <div class="field"><label>Beskrivelse (engelsk)</label><textarea name="descriptionEn" rows="5" id="desc-en">${p.descriptionEn||''}</textarea>
        <button type="button" onclick="autoTranslate('desc-da','desc-en')" style="background:#f4f2ef;color:#555;border:1px solid #ddd;margin-top:.3rem;padding:.3rem .8rem;font-size:.72rem">Klik her for at auto-oversætte</button>
      </div>
      <button type="submit">Gem ændringer</button>
    </form>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
  <script>
  document.querySelectorAll('.sortable').forEach(function(el) {
    el.querySelectorAll('.card').forEach(function(c) { c.style.cursor = 'grab'; });
    Sortable.create(el, {
      animation: 150,
      forceFallback: true,
      onEnd: function() {
        const col = el.dataset.col;
        const ids = Array.from(el.querySelectorAll('.card')).map(c => c.dataset.id);
        fetch('/admin/reorder', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({col, ids})
        }).then(r => r.json()).then(d => {
          if (d.ok) {
            el.style.outline = '2px solid #5a7a5a';
            setTimeout(() => el.style.outline = '', 1000);
          }
        });
      }
    });
  });
  function previewImg(input, previewId) {
    const prev = document.getElementById(previewId);
    if (!prev || !input.files || !input.files[0]) return;
    if (!prev.id) prev.id = previewId;
    prev.style.display = 'block';
    const reader = new FileReader();
    reader.onload = function(e) { prev.src = e.target.result; };
    reader.readAsDataURL(input.files[0]);
  }
  async function deleteNewsImg(id) {
    if (!confirm('Slet dette billede?')) return;
    const res = await fetch('/admin/news/delete-image', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({id})
    });
    if (res.ok) {
      document.getElementById('wrap-newsImage').innerHTML = '<img id="prev-news" style="display:none;max-width:200px;margin-bottom:.5rem">';
    } else {
      alert('Fejl ved sletning');
    }
  }
  async function deleteImg(field, previewId, id, col) {
    if (!confirm('Slet dette billede?')) return;
    const res = await fetch('/admin/painting/delete-image', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({id, col, field})
    });
    if (res.ok) {
      const wrap = document.getElementById('wrap-' + field);
      if (wrap) wrap.innerHTML = '<img id="' + previewId + '" style="display:none;max-width:200px;margin-bottom:.5rem">';
    } else {
      alert('Fejl ved sletning');
    }
  }
  async function autoTranslate(srcId, dstId) {
    const src = document.getElementById(srcId).value.trim();
    if (!src) return;
    const dst = document.getElementById(dstId);
    dst.value = '(oversætter...)';
    try {
      const r = await fetch('/admin/translate', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:src})});
      const d = await r.json();
      dst.value = d.translated || src;
    } catch(e) { dst.value = src; }
  }
  </script>
  </body></html>`);
});

app.post('/admin/painting/update', requireAuth, upload.fields([{name:'image',maxCount:1},{name:'imageRoom',maxCount:1},{name:'imageCustomer',maxCount:1}]), (req, res) => {
  const col = req.query.col || 'paintings';
  const file = col === 'mixed' ? MIXED_FILE : PAINTINGS_FILE;
  let items = JSON.parse(fs.readFileSync(file));
  const idx = items.findIndex(x => x.id === req.body.id);
  if (idx === -1) return res.redirect('/admin?section=' + (col === 'mixed' ? 'mixed' : 'paintings'));
  const p = items[idx];
  p.title = req.body.title;
  p.medium = req.body.medium || null;
  if (req.body.width_cm && req.body.height_cm) {
    p.width_cm = Number(req.body.width_cm);
    p.height_cm = Number(req.body.height_cm);
    p.size = `${req.body.height_cm}\u00d7${req.body.width_cm} cm`;
  }
  p.year = req.body.year ? Number(req.body.year) : null;
  p.price = req.body.price ? Number(req.body.price) : null;
  p.status = req.body.status || 'for-sale';
  p.description = req.body.description || null;
  p.descriptionEn = req.body.descriptionEn || null;
  if (req.files['image']) {
    if (p.image) { const old = path.join(UPLOAD_DIR, p.image); if (fs.existsSync(old)) fs.unlinkSync(old); }
    p.image = path.basename(convertHeicIfNeeded(req.files['image'][0].path, req.files['image'][0].mimetype));
  } else if (req.body.deleteImage === '1' && p.image) {
    const old = path.join(UPLOAD_DIR, p.image); if (fs.existsSync(old)) fs.unlinkSync(old);
    p.image = null;
  }
  if (req.files['imageRoom']) {
    if (p.imageRoom) { const old = path.join(UPLOAD_DIR, p.imageRoom); if (fs.existsSync(old)) fs.unlinkSync(old); }
    p.imageRoom = path.basename(convertHeicIfNeeded(req.files['imageRoom'][0].path, req.files['imageRoom'][0].mimetype));
  } else if (req.body.deleteImageRoom === '1' && p.imageRoom) {
    const old = path.join(UPLOAD_DIR, p.imageRoom); if (fs.existsSync(old)) fs.unlinkSync(old);
    p.imageRoom = null;
  }
  if (req.files['imageCustomer']) {
    if (p.imageCustomer) { const old = path.join(UPLOAD_DIR, p.imageCustomer); if (fs.existsSync(old)) fs.unlinkSync(old); }
    p.imageCustomer = path.basename(convertHeicIfNeeded(req.files['imageCustomer'][0].path, req.files['imageCustomer'][0].mimetype));
  } else if (req.body.deleteImageCustomer === '1' && p.imageCustomer) {
    const old = path.join(UPLOAD_DIR, p.imageCustomer); if (fs.existsSync(old)) fs.unlinkSync(old);
    p.imageCustomer = null;
  }
  fs.writeFileSync(file, JSON.stringify(items, null, 2));

  res.redirect('/admin?section=' + (col === 'mixed' ? 'mixed' : 'paintings'));
});

// --- Edit nyhed ---
app.get('/admin/news/edit/:id', requireAuth, (req, res) => {
  const items = JSON.parse(fs.readFileSync(NEWS_FILE));
  const n = items.find(x => x.id === req.params.id);
  if (!n) return res.redirect('/admin?section=news');
  const adminCss = `*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;background:#f2f0ed;color:#222}.wrap{max-width:700px;margin:2rem auto;padding:0 1.5rem}h1{font-size:1.1rem;font-weight:normal;letter-spacing:.1em;margin-bottom:1.5rem}.back{font-size:.78rem;color:#aaa;text-decoration:none;display:block;margin-bottom:1.5rem}.form{background:white;border:1px solid #e0ddd8;padding:1.5rem}.field{margin-bottom:.8rem}label{display:block;font-size:.75rem;color:#888;margin-bottom:.25rem}input,select,textarea{width:100%;padding:.45rem;border:1px solid #ddd;font-size:.9rem;font-family:Georgia,serif}input[type=file]{border:none;padding:0}.row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}button{background:#1a1a1a;color:white;border:none;padding:.5rem 1.2rem;cursor:pointer;font-size:.78rem;letter-spacing:.1em;margin-top:.5rem}`;
  res.send(`<!DOCTYPE html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rediger nyhed — FruB Admin</title><style>${adminCss}</style></head><body>
  <div class="wrap">
    <a class="back" href="/admin?section=news">← Tilbage</a>
    <h1>Rediger: "${n.title}"</h1>
    <form class="form" method="POST" action="/admin/news/update" enctype="multipart/form-data">
      <input type="hidden" name="id" value="${n.id}">
      <div class="field">
        <label>Billede (valgfrit)</label>
        <div id="wrap-newsImage-edit">
          ${n.image ? `<img id="prev-news-edit" class="img-preview" src="/images/news/${n.image}" style="display:block;max-width:200px;margin-bottom:.5rem"><button type="button" onclick="deleteNewsImgEdit('${n.id}')" style="display:block;margin-bottom:.5rem;padding:.6rem 1rem;background:#fff0f0;border:1px solid #ffcccc;color:#c00;font-size:.85rem;cursor:pointer;width:100%;text-align:left">🗑 Slet billede</button>` : '<img id="prev-news-edit" style="display:none;max-width:200px;margin-bottom:.5rem">'}
        </div>
        <input type="file" name="newsImage" accept="image/*" onchange="previewImg(this,'prev-news-edit')">
      </div>
      <div class="field"><label>Titel (dansk)</label><input type="text" name="title" value="${n.title}" required></div>
      <div class="field"><label>Titel (engelsk)</label><input type="text" name="titleEn" value="${n.titleEn||''}"></div>
      <div class="row">
        <div class="field"><label>Dato</label><input type="date" name="date" value="${n.date||''}"></div>
        <div class="field"><label>Kategori</label><select name="tag">
          <option value="atelier" ${n.tag==='atelier'?'selected':''}>Atelier</option>
          <option value="udstilling" ${n.tag==='udstilling'?'selected':''}>Udstilling</option>
          <option value="inspiration" ${n.tag==='inspiration'?'selected':''}>Inspiration</option>
          <option value="presse" ${n.tag==='presse'?'selected':''}>Presse</option>
          <option value="andet" ${n.tag==='andet'?'selected':''}>Andet</option>
        </select></div>
      </div>
      <div class="field"><label>Tekst (dansk)</label><textarea name="text" id="news-da-edit" rows="8">${n.text||''}</textarea></div>
      <div class="field"><label>Tekst (engelsk)</label><textarea name="textEn" id="news-en-edit" rows="8">${n.textEn||''}</textarea>
        <button type="button" onclick="autoTranslate('news-da-edit','news-en-edit')" style="background:#f4f2ef;color:#555;border:1px solid #ddd;margin-top:.3rem;padding:.3rem .8rem;font-size:.72rem">Klik her for at auto-oversætte</button>
      </div>
      <button type="submit">Gem ændringer</button>
    </form>
  </div>
  <script>
  function previewImg(input, previewId) {
    let prev = document.getElementById(previewId);
    if (!prev) { prev = document.createElement('img'); prev.id = previewId; prev.style.cssText = 'max-width:200px;margin-bottom:.5rem'; input.parentNode.insertBefore(prev, input); }
    if (!input.files || !input.files[0]) return;
    prev.style.display = 'block';
    const reader = new FileReader();
    reader.onload = function(e) { prev.src = e.target.result; };
    reader.readAsDataURL(input.files[0]);
  }
  async function deleteNewsImgEdit(id) {
    if (!confirm('Slet dette billede?')) return;
    const res = await fetch('/admin/news/delete-image', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
    if (res.ok) { document.getElementById('wrap-newsImage-edit').innerHTML = '<img id="prev-news-edit" style="display:none;max-width:200px;margin-bottom:.5rem">'; }
    else alert('Fejl ved sletning');
  }
  async function autoTranslate(srcId, dstId) {
    const src = document.getElementById(srcId).value.trim();
    if (!src) return;
    const dst = document.getElementById(dstId);
    dst.value = '(oversætter...)';
    try {
      const r = await fetch('/admin/translate', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:src})});
      const d = await r.json();
      dst.value = d.translated || src;
    } catch(e) { dst.value = src; }
  }
  </script>
  </body></html>`);
});

app.post('/admin/news/update', requireAuth, upload.fields([{name:'newsImage',maxCount:1}]), (req, res) => {
  let items = JSON.parse(fs.readFileSync(NEWS_FILE));
  const idx = items.findIndex(x => x.id === req.body.id);
  if (idx === -1) return res.redirect('/admin?section=news');
  const n = items[idx];
  n.title = req.body.title;
  n.titleEn = req.body.titleEn || null;
  n.date = req.body.date || null;
  n.tag = req.body.tag || 'andet';
  n.text = req.body.text;
  n.textEn = req.body.textEn || null;
  if (req.files['newsImage']) {
    if (n.image) { const old = path.join(UPLOAD_DIR, 'news', n.image); if (fs.existsSync(old)) fs.unlinkSync(old); }
    n.image = path.basename(convertHeicIfNeeded(req.files['newsImage'][0].path, req.files['newsImage'][0].mimetype));
  } else if (req.body.deleteImage === '1' && n.image) {
    const old = path.join(UPLOAD_DIR, 'news', n.image); if (fs.existsSync(old)) fs.unlinkSync(old);
    n.image = null;
  }
  fs.writeFileSync(NEWS_FILE, JSON.stringify(items, null, 2));
  res.redirect('/admin?section=news');
});

// --- Reorder ---
app.post('/admin/reorder', requireAuth, express.json(), (req, res) => {
  const { col, ids } = req.body;
  const file = col === 'mixed' ? MIXED_FILE : PAINTINGS_FILE;
  const items = JSON.parse(fs.readFileSync(file));
  const reordered = ids.map(id => items.find(p => p.id === id)).filter(Boolean);
  // Tilføj evt. items der ikke er i ids (sikkerhed)
  items.forEach(p => { if (!reordered.find(r => r.id === p.id)) reordered.push(p); });
  fs.writeFileSync(file, JSON.stringify(reordered, null, 2));
  res.json({ ok: true });
});

// --- Slet billede fra nyhed ---
app.post('/admin/news/delete-image', requireAuth, express.json(), (req, res) => {
  const { id } = req.body;
  const items = JSON.parse(fs.readFileSync(NEWS_FILE));
  const n = items.find(x => x.id === id);
  if (!n) return res.status(404).json({error: 'ikke fundet'});
  if (n.image) {
    const imgPath = path.join(UPLOAD_DIR, 'news', n.image);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    n.image = null;
    fs.writeFileSync(NEWS_FILE, JSON.stringify(items, null, 2));
  }
  res.json({ok: true});
});

// --- Slet enkelt billede fra værk ---
app.post('/admin/painting/delete-image', requireAuth, express.json(), (req, res) => {
  const { id, col, field } = req.body;
  const file = col === 'mixed' ? MIXED_FILE : PAINTINGS_FILE;
  const items = JSON.parse(fs.readFileSync(file));
  const p = items.find(x => x.id === id);
  if (!p) return res.status(404).json({error: 'ikke fundet'});
  const imgFile = p[field];
  if (imgFile) {
    const imgPath = path.join(UPLOAD_DIR, imgFile);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    p[field] = null;
    fs.writeFileSync(file, JSON.stringify(items, null, 2));
  }
  res.json({ok: true});
});

// --- News add/delete ---
app.post('/admin/news/add', requireAuth, upload.fields([{name:'newsImage',maxCount:1}]), (req, res) => {
  const items = JSON.parse(fs.readFileSync(NEWS_FILE));
  const nums = items.map(x => parseInt(x.id.replace('n',''))||0);
  const newId = 'n' + (Math.max(0,...nums) + 1);
  items.unshift({
    id: newId,
    title: req.body.title,
    titleEn: req.body.titleEn || null,
    date: req.body.date || new Date().toISOString().slice(0,10),
    tag: req.body.tag || 'andet',
    image: req.files['newsImage'] ? req.files['newsImage'][0].filename : null,
    text: req.body.text,
    textEn: req.body.textEn || null,
  });
  fs.writeFileSync(NEWS_FILE, JSON.stringify(items, null, 2));
  res.redirect('/admin');
});

app.post('/admin/news/delete', requireAuth, (req, res) => {
  let items = JSON.parse(fs.readFileSync(NEWS_FILE));
  const n = items.find(x => x.id === req.body.id);
  if (n && n.image) { const p = path.join(UPLOAD_DIR, n.image); if (fs.existsSync(p)) fs.unlinkSync(p); }
  items = items.filter(x => x.id !== req.body.id);
  fs.writeFileSync(NEWS_FILE, JSON.stringify(items, null, 2));
  res.redirect('/admin');
});

app.post('/admin/add', requireAuth, upload.fields([{name:'image',maxCount:1},{name:'imageRoom',maxCount:1},{name:'imageCustomer',maxCount:1}]), (req, res) => {
  const col = req.query.col === 'mixed' ? MIXED_FILE : PAINTINGS_FILE;
  const items = JSON.parse(fs.readFileSync(col));
  const prefix = req.query.col === 'mixed' ? 'm' : 'p';
  const newId = nextId(items, prefix);
  const imgFile = req.files['image'] ? req.files['image'][0] : null;
  const roomFile = req.files['imageRoom'] ? req.files['imageRoom'][0] : null;
  const customerFile = req.files['imageCustomer'] ? req.files['imageCustomer'][0] : null;
  const imgName = imgFile ? path.basename(convertHeicIfNeeded(imgFile.path, imgFile.mimetype)) : null;
  const roomName = roomFile ? path.basename(convertHeicIfNeeded(roomFile.path, roomFile.mimetype)) : null;
  const customerName = customerFile ? path.basename(convertHeicIfNeeded(customerFile.path, customerFile.mimetype)) : null;
  const newSize = req.body.width_cm && req.body.height_cm ? `${req.body.height_cm}\u00d7${req.body.width_cm} cm` : (req.body.size || null);
  items.unshift({ id: newId, title: req.body.title, image: imgName, imageRoom: roomName, imageCustomer: customerName, medium: req.body.medium || null, size: newSize, width_cm: req.body.width_cm ? Number(req.body.width_cm) : null, height_cm: req.body.height_cm ? Number(req.body.height_cm) : null, year: req.body.year ? Number(req.body.year) : null, price: req.body.price ? Number(req.body.price) : null, status: req.body.status || 'for-sale', description: req.body.description || null, descriptionEn: req.body.descriptionEn || null });
  fs.writeFileSync(col, JSON.stringify(items, null, 2));
  res.redirect('/admin');
});

app.post('/admin/delete', requireAuth, (req, res) => {
  const col = req.query.col === 'mixed' ? MIXED_FILE : PAINTINGS_FILE;
  let items = JSON.parse(fs.readFileSync(col));
  const p = items.find(x => x.id === req.body.id);
  if (p && p.image) { const imgPath = path.join(UPLOAD_DIR, p.image); if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }
  if (p && p.imageRoom) { const imgPath = path.join(UPLOAD_DIR, p.imageRoom); if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }
  if (p && p.imageCustomer) { const imgPath = path.join(UPLOAD_DIR, p.imageCustomer); if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath); }
  items = items.filter(x => x.id !== req.body.id);
  fs.writeFileSync(col, JSON.stringify(items, null, 2));
  res.redirect('/admin');
});

app.listen(PORT, () => console.log(`FruB kører på port ${PORT}`));
