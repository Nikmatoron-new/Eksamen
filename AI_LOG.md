# 🤖 AI-BRUK LOG - Bryllupsplanlegging WebApp

Dokumentasjon av hvordan AI-verktøy ble brukt i utviklingen av denne eksamen-oppgaven.

---

## 📊 Oversikt

| Verktøy | Antall spørsmål | Hva det ble brukt til |
|---------|-----------------|----------------------|
| **GitHub Copilot** | 15+ | Kodeskriving, debugging, kommentarer |
| **Claude Haiku** | 20+ | Forklaring, arkitektur, dokumentasjon |

---

## 🔍 Konkrete AI-spørsmål og svar

### 1. Initiell kodearkitektur

**Spørsmål til Claude:**
```
Jeg skal lage en webapplikasjon for bryllupsprodukter med:
- Admin-grensesnitt for å legge inn produkter
- Kundevisning av produkter
- Database

Hva er best praksis for å strukturere Express-appen?
```

**Svar som ble brukt:**
- Adskille ruter for kunde og admin
- Bruke EJS-templates for HTML
- Bruke PostgreSQL for database
- Implementere CRUD-operasjoner

**Implementasjon:** `server.js` struktur med separate route-seksjoner

---

### 2. Database-design

**Spørsmål til Copilot:**
```
Skriv SQL CREATE TABLE for en produkttabell med:
- ID (auto-incrementing)
- Navn
- Beskrivelse
- Pris
- Bilde-URL
Bruker PostgreSQL
```

**Svar som ble brukt:**
```sql
CREATE TABLE produkter (
  id SERIAL PRIMARY KEY,
  navn TEXT NOT NULL,
  beskrivelse TEXT,
  pris NUMERIC NOT NULL,
  bilde TEXT
);
```

**Implementasjon:** `Produkter.sql` - init-script for Docker

---

### 3. Express-ruter for CRUD

**Spørsmål til Copilot:**
```
Lag Express ruter for:
- GET / (list all)
- GET /produkt/:id (show one)
- POST /admin/nytt (create)
- POST /admin/rediger/:id (update)
- POST /admin/slett/:id (delete)
Med PostgreSQL og pg-library
```

**Svar som ble brukt:**
- Bruke `app.get()`, `app.post()` for ruter
- Bruke `pool.query()` for database
- Bruke `$1`, `$2` for parameterized queries
- Håndtere feil med try/catch

**Implementasjon:** Alle ruter i `server.js`

---

### 4. Docker Compose-oppsett

**Spørsmål til Claude:**
```
Jeg har en Node.js/Express app med PostgreSQL.
Hvordan setter jeg opp Docker Compose med:
- PostgreSQL 15 container
- Node.js container
- Automatisk initialisering av databasen
- Miljøvariabler for tilkobling
```

**Svar som ble brukt:**
- `version: '3.9'` for moderne Compose
- `postgres:15-alpine` for database
- `services:` med `database` og `webserver`
- `depends_on` for riktig startup-rekkefølge
- `volumes` for init-script
- `healthcheck` for å vente på database

**Implementasjon:** `docker-compose.yml`

---

### 5. EJS-templates

**Spørsmål til Copilot:**
```
Lag EJS-template som:
- Viser liste av produkter
- Har link til detalj-side for hver produkt
- Loop gjennom array og vis navn og pris
```

**Svar som ble brukt:**
```html
<% produkter.forEach((produkt) => { %>
  <li>
    <a href="/produkt/<%= produkt.id %>">
      <%= produkt.navn %>
    </a>
    <p><%= produkt.pris %> kr</p>
  </li>
<% }); %>
```

**Implementasjon:** `views/index.ejs`, `views/admin.ejs`

---

### 6. Debugging - port 3000 konflikt

**Spørsmål:**
```
Server startet ikke, feil om port 3000 er i bruk.
Hvordan finner jeg hvilket program bruker port 3000?
```

**Svar som ble brukt:**
```powershell
netstat -ano | findstr ":3000"
tasklist /FI "PID eq XXXXX"
```

Funnet at Docker backend brukte porten.

**Løsning:** Byttet til port 3001 eller brukte Docker Compose

---

### 7. Kodekommentarer

**Spørsmål til Copilot:**
```
Legg til detaljerte kommentarer i denne Express-serveren som forklarer:
- Hva hver import gjør
- Hva hver rute gjør
- Hvordan databasetilkoblingen fungerer
```

**Svar som ble brukt:**
- Blokkkommentarer (`// ====...`) for seksjoner
- Inline-kommentarer for vanskelige deler
- Forklaringer av parameterized queries

**Implementasjon:** Alle kommentarer i `server.js`

---

### 8. Docker Dockerfile

**Spørsmål til Copilot:**
```
Lag Dockerfile for Node.js app som:
- Bruker node:20-alpine base image
- Installerer npm packages
- Kopierer app-koden
- Exposer port 3000
- Kjører "node server.js"
```

**Svar som ble brukt:**
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3000
CMD ["node", "server.js"]
```

**Implementasjon:** `Dockerfile`

---

### 9. README-dokumentasjon

**Spørsmål til Claude:**
```
Lag en README for studentprosjekt som skal dokumentere:
- Hvordan starte appen (Docker og lokalt)
- Kodearchitektur og forklaring
- Database-skjema
- Alle ruter og funksjonalitet
- Sikkerhetsproblemer som skal fikses senere

Format: Markdown med gode headings og kodeblokker
```

**Svar som ble brukt:**
- Struktur med TOC, seksjoner, tabeller
- Kodeblokker for Docker commands
- Visuell hierarki med emojis og formatting
- Sjekkliste for eksamen-krav

**Implementasjon:** Fullstendig `README.md`

---

### 10. Forklaring av SQL parameterplassholdere

**Spørsmål til Claude:**
```
Hva er forskjellen mellom ? og $1 i SQL-spørringer?
Hvilken skal jeg bruke med PostgreSQL og pg-library?
```

**Svar som ble brukt:**
- `?` er SQLite/MySQL-format
- `$1`, `$2`, osv. er PostgreSQL-format
- Forebygger SQL-injection
- `pg`-library krever PostgreSQL-format

**Implementasjon:** Alle SQL-spørringer bruker `$1`, `$2`, ...

---

### 11. Miljøvariabler i Docker

**Spørsmål til Copilot:**
```
Hvordan leser jeg miljøvariabler fra Docker i Node.js?
process.env.PGHOST?
```

**Svar som ble brukt:**
```javascript
const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  ...
});
```

**Implementasjon:** Database-tilkobling i `server.js`

---

### 12. HTML-skjema for oppretting

**Spørsmål til Copilot:**
```
Lag HTML-skjema som sender POST request med:
- navn
- beskrivelse
- pris
- bilde
Action: /admin/nytt
```

**Svar som ble brukt:**
```html
<form action="/admin/nytt" method="post">
  <input type="text" name="navn" required>
  <textarea name="beskrivelse"></textarea>
  <input type="number" name="pris" required>
  <input type="text" name="bilde">
  <button type="submit">Lagre</button>
</form>
```

**Implementasjon:** `views/admin_form.ejs`

---

### 13. CSS-styling

**Spørsmål:**
```
Lag en minimalistisk, responsiv CSS for webappen med:
- Header med blå bakgrunn
- Tabell for admin
- Produktliste for kunde
- Input-felter
```

**Svar som ble brukt:**
- Flexbox for layout
- Faste farger og padding
- Mobile-friendly viewport
- Tabell-styling

**Implementasjon:** `public/styles.css`

---

### 14. .gitignore fil

**Spørsmål:**
```
Hva bør jeg legge i .gitignore for Node.js prosjekt?
```

**Svar som ble brukt:**
```
node_modules/
.env
database.db
*.log
.DS_Store
```

**Implementasjon:** `.gitignore`

---

### 15. Feil med YAML-innrykk i docker-compose

**Spørsmål til Copilot:**
```
YAML-feil: "All mapping items must start at the same column"
Hva betyr det?
```

**Svar som ble brukt:**
- YAML krever riktig innrykk (2 eller 4 mellomrom)
- Alle nøkler på samme nivå må starte i samme kolonne
- Tab-tegn støttes ikke (kun mellomrom)

**Implementasjon:** Fikset `docker-compose.yml` med 2 mellomrom innrykk

---

## 📈 Hvordan AI-svarene ble brukt

### Prosess

1. **Spørsmål stilles** → AI gir svar
2. **Svar evalueres** → Er det relevant? Passer til prosjektet?
3. **Implementeres** → Koden skrives/redigeres
4. **Testes** → Kjøres og debugges
5. **Dokumenteres** → Legges til kommentarer

### Eksempel: Database-tilkobling

**Step 1:** Spurt "Hvordan tilkoble PostgreSQL fra Node.js med pg-library?"

**Step 2:** Fikk forslag om `new Pool({ host, port, user, password, database })`

**Step 3:** Implementerte i `server.js` med miljøvariabler

**Step 4:** Testet med Docker Compose - det fungerte

**Step 5:** Dokumenterte i README og kommentarer

---

## ✅ Konklusjon

AI ble brukt for:
- ✅ Initiell kodestruktur og best-practices
- ✅ Debugging av feil (port-konflikt, YAML)
- ✅ Kodehjelpere (templates, middleware)
- ✅ Dokumentasjon (README, kommentarer)
- ✅ Konseptuell forståelse (forklaring av konsepter)

AI ble **IKKE** brukt for:
- ❌ Fullstendig løsning (kode ble alltid gjennomgått)
- ❌ Kopiering av hele filer uten forståelse
- ❌ Erstatning for læring

---

## 🎯 Læringsutbytte

Gjennom å bruke AI har jeg lært:
1. Hvordan strukturere Express-app
2. PostgreSQL + Node.js integrasjon
3. Docker Compose-oppsetup
4. EJS-templates
5. CRUD-operasjoner

---

**Dokumentasjon opprettet:** Juni 2, 2026

**AI-verktøy brukt:**
- GitHub Copilot (VS Code integrasjon)
- Claude Haiku (tekstbasert chat)
