// ============================================================================
// BRYLLUPSPLANLEGGING WEBAPP - EXPRESS SERVER
// ============================================================================
// Dette er hovedserveren for både kundefront og admin-grensesnitt
// Bruker Express.js for routing og PostgreSQL for datapersistens

const express = require('express');           // Webserver-rammeverk
const path = require('path');                 // Fil- og mappeoperasjoner
const { Pool } = require('pg');              // PostgreSQL-tilkobling
const bodyParser = require('body-parser');   // Parser for HTML-skjemadata

const app = express();
const port = process.env.PORT || 3000;

// ============================================================================
// DATABASE TILKOBLING - PostgreSQL
// ============================================================================
// Tilkobles via miljøvariabler (satt av Docker Compose):
// - PGHOST: navn på databaseserver (f.eks. "database" i Docker)
// - PGPORT: port (standard: 5432)
// - PGUSER: brukernavn (f.eks. "postgres")
// - PGPASSWORD: passord
// - PGDATABASE: databasenavn (f.eks. "produkter")

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'produkter'
});

// ============================================================================
// EXPRESS KONFIGURERING
// ============================================================================
app.set('view engine', 'ejs');                           // Bruker EJS for HTML-templates
app.set('views', path.join(__dirname, 'views'));        // Mappen for HTML-sider
app.use(express.static(path.join(__dirname, 'public'))); // Serve CSS, JS, bilder
app.use(bodyParser.urlencoded({ extended: false }));    // Parser for form-data
app.use(bodyParser.json());                             // Parser for JSON-data

// ============================================================================
// HJELPE-FUNKSJONER FOR DATABASESPØRRINGER
// ============================================================================
// Disse gjør det mulig å bruke async/await i stedet for callbacks

// dbAll: Henter FLERE rader fra databasen (f.eks. alle produkter)
function dbAll(sql, params = []) {
  return pool.query(sql, params).then((result) => result.rows);
}

// dbGet: Henter EN enkelt rad fra databasen (f.eks. ett produkt etter ID)
function dbGet(sql, params = []) {
  return pool.query(sql, params).then((result) => result.rows[0]);
}

// dbRun: Utfører INSERT, UPDATE, eller DELETE (ikke SELECT)
function dbRun(sql, params = []) {
  return pool.query(sql, params);
}

// ============================================================================
// KUNDEGRENSESNITT - PRODUKTVISNING
// ============================================================================

// GET / - Viser liste over alle produkter
// Henter alle produkter fra databasen og viser dem på index.ejs
app.get('/', async (req, res) => {
  try {
    const produkter = await dbAll('SELECT * FROM produkter ORDER BY id DESC');
    res.render('index', { produkter });
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved henting av produkter');
  }
});

// GET /produkt/:id - Viser detaljer for ett spesifikt produkt
// :id er produktets ID-nummer i URL-en, f.eks. /produkt/5
app.get('/produkt/:id', async (req, res) => {
  try {
    const produkt = await dbGet('SELECT * FROM produkter WHERE id = $1', [req.params.id]);
    if (!produkt) {
      return res.status(404).send('Produkt ikke funnet');
    }
    res.render('produkt', { produkt });
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved henting av produkt');
  }
});

// ============================================================================
// ADMINGRENSESNITT - PRODUKTHÅNDTERING (CRUD)
// ============================================================================
// VIKTIG: Disse rutene burde være beskyttet med autentisering i produksjon!

app.get('/admin', async (req, res) => {
  try {
    const produkter = await dbAll('SELECT * FROM produkter ORDER BY id DESC');
    res.render('admin', { produkter });
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil i admin');
  }
});

// GET /admin/nytt - Viser tomt skjema for nytt produkt
app.get('/admin/nytt', (req, res) => {
  res.render('admin_form', {
    produkt: { navn: '', beskrivelse: '', pris: '', bilde: '' },
    action: '/admin/nytt',
    title: 'Legg til nytt produkt'
  });
});

// POST /admin/nytt - Lagrer nytt produkt fra skjema
// Tar inn navn, beskrivelse, pris, bilde fra req.body (fra HTML-skjema)
app.post('/admin/nytt', async (req, res) => {
  try {
    const { navn, beskrivelse, pris, bilde } = req.body;
    await dbRun(
      'INSERT INTO produkter (navn, beskrivelse, pris, bilde) VALUES ($1, $2, $3, $4)',
      [navn, beskrivelse, pris || 0, bilde]
    );
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved oppretting av produkt');
  }
});

// GET /admin/rediger/:id - Viser skjema for redigering av eksisterende produkt
app.get('/admin/rediger/:id', async (req, res) => {
  try {
    const produkt = await dbGet('SELECT * FROM produkter WHERE id = $1', [req.params.id]);
    if (!produkt) {
      return res.status(404).send('Produkt ikke funnet');
    }
    res.render('admin_form', {
      produkt,
      action: `/admin/rediger/${produkt.id}`,
      title: 'Rediger produkt'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved å hente produkt for redigering');
  }
});

// POST /admin/rediger/:id - Oppdaterer eksisterende produkt
app.post('/admin/rediger/:id', async (req, res) => {
  try {
    const { navn, beskrivelse, pris, bilde } = req.body;
    await dbRun(
      'UPDATE produkter SET navn = $1, beskrivelse = $2, pris = $3, bilde = $4 WHERE id = $5',
      [navn, beskrivelse, pris || 0, bilde, req.params.id]
    );
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved lagring av produkt');
  }
});

// POST /admin/slett/:id - Sletter ett produkt fra databasen
app.post('/admin/slett/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM produkter WHERE id = $1', [req.params.id]);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved sletting av produkt');
  }
});

// ============================================================================
// START SERVER
// ============================================================================
// Serveren lytter på port 3000 (eller annen port fra miljøvariabel PORT)
app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});