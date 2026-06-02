const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'produkter'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function dbAll(sql, params = []) {
  return pool.query(sql, params).then((result) => result.rows);
}

function dbGet(sql, params = []) {
  return pool.query(sql, params).then((result) => result.rows[0]);
}

function dbRun(sql, params = []) {
  return pool.query(sql, params);
}

app.get('/', async (req, res) => {
  try {
    const produkter = await dbAll('SELECT * FROM produkter ORDER BY id DESC');
    res.render('index', { produkter });
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved henting av produkter');
  }
});

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

app.get('/admin', async (req, res) => {
  try {
    const produkter = await dbAll('SELECT * FROM produkter ORDER BY id DESC');
    res.render('admin', { produkter });
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil i admin');
  }
});

app.get('/admin/nytt', (req, res) => {
  res.render('admin_form', {
    produkt: { navn: '', beskrivelse: '', pris: '', bilde: '' },
    action: '/admin/nytt',
    title: 'Legg til nytt produkt'
  });
});

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

app.post('/admin/slett/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM produkter WHERE id = $1', [req.params.id]);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved sletting av produkt');
  }
});

app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});