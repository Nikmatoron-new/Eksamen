const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.db');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Unable to open database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database:', dbPath);
});

db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS produkter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      navn TEXT NOT NULL,
      beskrivelse TEXT,
      pris REAL NOT NULL,
      bilde TEXT
    )`
  );
});

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
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
    const produkt = await dbGet('SELECT * FROM produkter WHERE id = ?', [req.params.id]);
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
      'INSERT INTO produkter (navn, beskrivelse, pris, bilde) VALUES (?, ?, ?, ?)',
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
    const produkt = await dbGet('SELECT * FROM produkter WHERE id = ?', [req.params.id]);
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
      'UPDATE produkter SET navn = ?, beskrivelse = ?, pris = ?, bilde = ? WHERE id = ?',
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
    await dbRun('DELETE FROM produkter WHERE id = ?', [req.params.id]);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Feil ved sletting av produkt');
  }
});

app.listen(port, () => {
  console.log(`Server kjører på http://localhost:${port}`);
});