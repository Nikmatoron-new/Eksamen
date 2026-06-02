# Bryllupsplanlegging Webapplikasjon

En fullstendig webbasert løsning for administrasjon og visning av bryllupsprodukter (musikere, blomster, bordkort, osv.).

**Eksamen:** Bryllupsplanlegging WebApp - Juni 2026

---

## 📋 Innholdsfortegnelse

- [Prosjektstruktur](#prosjektstruktur)
- [Teknologistakk](#teknologistakk)
- [Hvordan starte serveren](#hvordan-starte-serveren)
- [Kodearchitektur](#kodearchitektur)
- [Database](#database)
- [Funksjonalitet](#funksjonalitet)
- [Docker Compose](#docker-compose)
- [Kodeforklaring](#kodeforklaring)

---

## 🗂️ Prosjektstruktur

```
Eksamen/
├── server.js                      # Express-server med alle ruter
├── package.json                   # Node-avhengigheter
├── docker-compose.yml             # Docker Compose-konfigurasjon
├── Dockerfile                     # Docker-bygginstruks
├── Produkter.sql                  # Initialiserings-SQL for databasen
├── views/                         # EJS-html-maler
│   ├── index.ejs                 # Kundeliste
│   ├── produkt.ejs               # Produktdetalj
│   ├── admin.ejs                 # Admin-oversikt
│   └── admin_form.ejs            # Admin-skjema (nytt/rediger)
├── public/                        # Statiske filer (CSS, JS, bilder)
│   └── styles.css                # Hovedstil
├── eksamensoppgave.md            # Oppgaveformulering
└── README.md                     # Denne filen
```

---

## 🛠️ Teknologistakk

| Lag | Teknologi | Hva det gjør |
|-----|-----------|------------|
| **Server** | Node.js + Express | Webserver, routing |
| **Template** | EJS | HTML-maler med variabler |
| **Database** | PostgreSQL | Persistent lagring av produkter |
| **Container** | Docker + Docker Compose | Automatisert oppsett og kjøring |

---

## 🚀 Hvordan starte serveren

### Alternativ 1: Med Docker Compose (anbefalt)

**Forutsetninger:**
- Docker Desktop installert
- En terminal åpnet i prosjektroten

**Start serveren:**

```powershell
docker compose up --build
```

**Åpne i nettleser:**

- Kundevisning: [http://localhost:3000](http://localhost:3000)
- Admin-side: [http://localhost:3000/admin](http://localhost:3000/admin)

hvis ikke disse fungere bruk: 
- Kundevisning: [http://localhost](http://localhost)
- Admin-side: [http://localhost/admin](http://localhost/admin)

**Stoppe serveren:**

Trykk `Ctrl+C` i terminalen.

---

### Alternativ 2: Lokalt (uten Docker)

**Forutsetninger:**
- Node.js installert
- PostgreSQL installert og kjørende lokalt

**Installere avhengigheter:**

```powershell
npm install
```

**Sette miljøvariabler:**

```powershell
$env:PGHOST="localhost"
$env:PGUSER="postgres"
$env:PGPASSWORD="dittpassord"
$env:PGDATABASE="produkter"
```

**Start serveren:**

```powershell
npm start
```

---

## 🏗️ Kodearchitektur

### Hva gjør hva?

#### `server.js`
Hovediagentet i appen. Den:
1. Setter opp Express-serveren
2. Kobler til PostgreSQL-databasen
3. Definerer alle ruter (URLs)
4. Håndterer klient-forespørsler

#### `views/`
EJS-templates (HTML-filer med JavaScript-variabler). Eksempel:

```html
<h1><%= produkt.navn %></h1>
<p><%= produkt.beskrivelse %></p>
```

`<%= variabel %>` byttet ut med verdi fra server.

#### `docker-compose.yml`
Definerer to Docker-kontainere:
- `database`: PostgreSQL-instans
- `webserver`: Node.js-appen

#### `Produkter.sql`
Opprettelseskriptet som setter opp databasetabellen når Docker startes.

---

## 🗄️ Database

### Tabell: `produkter`

```sql
CREATE TABLE produkter (
  id SERIAL PRIMARY KEY,           -- Automatisk økende ID
  navn TEXT NOT NULL,              -- Produktnavn (f.eks. "musikere")
  beskrivelse TEXT,                -- Detaljert beskrivelse
  pris NUMERIC NOT NULL,           -- Pris i kroner
  bilde TEXT                       -- URL til produktbilde
);
```

### Eksempeldata

```sql
INSERT INTO produkter (navn, beskrivelse, pris, bilde) VALUES
('Trio - Jazz', 'Fantastisk tre-manns jazz-gruppe', 5000, 'https://example.com/jazz.jpg'),
('Blomster - Roser', 'Røde roser til dekoration', 800, 'https://example.com/roser.jpg');
```

---

## ✨ Funksjonalitet

### Kundegrensesnitt

| URL | Funksjon |
|-----|----------|
| `GET /` | Viser liste over alle produkter |
| `GET /produkt/:id` | Viser detaljer for ett produkt |

### Admingrensesnitt

| Rute | Metode | Funksjon |
|------|--------|----------|
| `/admin` | GET | Oversikt over alle produkter |
| `/admin/nytt` | GET | Tomt skjema for nytt produkt |
| `/admin/nytt` | POST | Lagrer nytt produkt |
| `/admin/rediger/:id` | GET | Redigerings-skjema |
| `/admin/rediger/:id` | POST | Lagrer endringer |
| `/admin/slett/:id` | POST | Sletter produkt |

---

## 🐳 Docker Compose

### `docker-compose.yml` - Forklart

```yaml
version: '3.9'
services:
  
  database:
    image: postgres:15-alpine          # PostgreSQL versjon 15
    environment:
      POSTGRES_USER: postgres          # Brukernavn
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: produkter           # Database som skal opprettes
    volumes:
      - ./Produkter.sql:/docker-entrypoint-initdb.d/init.sql:ro
      # ^ Kjører SQL-filen når containeren starter
    
  webserver:
    build:
      context: .                       # Bygger fra prosjektroten
      dockerfile: Dockerfile           # Bruker Dockerfile
    ports:
      - "3000:3000"                    # Eksponerer port 3000
    depends_on:
      database:
        condition: service_healthy     # Venter på at databasen er klar
    environment:
      PGHOST: database                 # Navn på database-container
      PGDATABASE: produkter
      # ^ Rest av verdiene kommer fra docker-compose.yml
```

---

## 🧠 Kodeforklaring

### Hvordan en produktvisning fungerer

**Brukerens perspektiv:**
1. Åpner [http://localhost:3000](http://localhost:3000)
eller
1. Åpner [http://localhost](http://localhost)

**Serverens perspektiv:**

```javascript
// 1. Express mottar forespørsel
app.get('/', async (req, res) => {

  // 2. Spør databasen om alle produkter
  const produkter = await dbAll('SELECT * FROM produkter ORDER BY id DESC');
  
  // 3. Bytter variabler i index.ejs med faktiske data
  res.render('index', { produkter });
});
```

**I index.ejs:**

```html
<% produkter.forEach((produkt) => { %>
  <li><%= produkt.navn %></li>
<% }); %>
```

Resultat: HTML-liste med alle produkter.

---

### Hvordan admin legger til produkt

1. Klikker på "Legg til nytt produkt"
2. Express viser tomt skjema (`admin_form.ejs`)
3. Admin fyller inn navn, pris, osv.
4. Skjemaet sendes som POST til `/admin/nytt`
5. Server kjører:

```javascript
app.post('/admin/nytt', async (req, res) => {
  const { navn, beskrivelse, pris, bilde } = req.body;
  
  // Lagrer i databasen
  await dbRun(
    'INSERT INTO produkter (navn, beskrivelse, pris, bilde) VALUES ($1, $2, $3, $4)',
    [navn, beskrivelse, pris, bilde]
  );
  
  // Returnerer til admin-siden
  res.redirect('/admin');
});
```

6. Produktet vises nå på [http://localhost:3000](http://localhost:3000)
eller
6. Produktet vises nå på [http://localhost](http://localhost)

---

## 📝 Miljøvariabler

Disse stilles automatisk av Docker Compose, men kan også settes manuelt:

```bash
PGHOST=database              # Hvor databasen er
PGPORT=5432                  # Database-port
PGUSER=postgres              # Database-brukernavn
PGPASSWORD=mysecretpassword  # Database-passord
PGDATABASE=produkter         # Database-navn
PORT=3000                    # Webserver-port
```

---

## 🔒 Sikkerhet (Oppgave 2 & 3)

### Nåværende status
- ❌ **Ingen autentisering** - admin kan aksesseres av hvem som helst
- ❌ **Ingen brannmur** - ingen IP-basert tilgangskontroll
- ❌ **Ingen GDPR-beskyttelse** - passord lagres ikke trygt

### Planlagte forbedringer
1. Legge til login for admin
2. Implementere brannmur-regler (iptables/UFW)
3. Hash passord med bcrypt
4. GDPR-planlegging (rett til sletting, samtykke, osv.)

Se `GDPR-PLAN.md` og `BRUKERVEILEDNING.md` for mer.

---

## 📚 Kilder

- [Express.js dokumentasjon](https://expressjs.com/)
- [PostgreSQL dokumentasjon](https://www.postgresql.org/docs/)
- [Docker dokumentasjon](https://docs.docker.com/)
- [EJS dokumentasjon](https://ejs.co/)

---

## 🤖 AI-bruk

Se `AI_LOG.md` for detaljert dokumentasjon av:
- Hvilke AI-verktøy som ble brukt
- Konkrete spørsmål som ble stilt
- Hvordan AI-svar ble implementert

---

## ✅ Sjekkliste for eksamen

**Oppgave 1 - Utvikling**
- [x] Database-struktur (Produkter.sql)
- [x] Kundevisning (index.ejs, produkt.ejs)
- [x] Admin CRUD (server.js ruter)
- [x] Styling (styles.css)

**Oppgave 2 - Drift**
- [ ] Docker Compose-oppsett *(dette er gjort)*
- [ ] Brannmur-konfigurasjon
- [ ] Dokumentasjon av arkitektur

**Oppgave 3 - Brukerstøtte**
- [ ] GDPR-plan
- [ ] Brukerveiledning

---

## 📧 Kontakt / Support

For spørsmål, se `eksamensoppgave.md` for kravspesifikasjon.

---

**Sist oppdatert:** Juni 2, 2026

