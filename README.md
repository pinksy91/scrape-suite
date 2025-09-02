# Scrape Suite

Scrape Suite è un aggregatore di ricerca che esegue lo scraping di più siti web e aggrega i risultati in un'interfaccia unificata. L'applicazione utilizza una moderna tecnologia frontend basata su React/Vite con TypeScript e componenti shadcn‑ui/Tailwind CSS, e un backend Node.js (Express) che sfrutta Playwright per eseguire in parallelo la raccolta dati. Questa versione rimuove i riferimenti a tool di scaffolding e introduce la logica di scraping personalizzata.

## Caratteristiche

* **Ricerca unificata**: cerca prodotti o offerte su più siti contemporaneamente, con risultati in un'unica pagina.
* **Filtri avanzati**: filtra per gruppo (categoria), range di prezzo, disponibilità; ordina per rilevanza, prezzo o data di scraping.
* **Gestione fonti e gruppi**: interfaccia per abilitare/disabilitare siti, assegnare gruppi e definire regole di scraping.
* **Scraping concorrente e robusto**: backend con Playwright per pagine JavaScript, gestione `srcset`/placeholder, backoff e possibilità di rotazione user‑agent/proxy.
* **Aggiornamento in tempo reale**: job tracciati con polling dello stato e recupero risultati.
* **Design responsive**: UI a card con immagini, descrizioni e prezzi basata su shadcn/Tailwind.

## Stack tecnologico

* **Frontend**: Vite + React + TypeScript + shadcn‑ui + Tailwind CSS
* **Backend**: Node.js + Express + Playwright per lo scraping
* **Gestione stato**: React Query per chiamate asincrone e caching
* **Tipizzazione**: condivisa fra client e server tramite file TypeScript

La struttura del progetto include cartelle `public/` e `src/` con sottocartelle per `components`, `pages`, `data`, `lib` e `types`.

## Installazione

1. Clona il repository:

   ```bash
   git clone <URL_DEL_REPO>
   cd scrape-suite
   ```
2. Installa le dipendenze:

   ```bash
   npm install
   ```
3. Avvia l'ambiente di sviluppo (client + server):

   ```bash
   npm run dev
   ```

   Il frontend sarà in ascolto sulla porta `5173` e l'API backend sulla `5174`.

> Assicurati di avere Node.js installato. Se preferisci Bun, puoi adattare gli script e le dipendenze.

## Configurazione

Crea un file `.env` (o `.env.local`) nella radice con queste variabili:

```
PORT=5174                 # porta del backend
VITE_API_URL=http://localhost:5174  # URL dell'API usato dal frontend
```

## API

Il backend espone pochi endpoint REST:

* **POST `/api/search`**: avvia un job di scraping. Corpo JSON: `{ query: string, sites: string[] }`. Ritorna `{ jobId }`.
* **GET `/api/jobs/:id/status`**: restituisce lo stato del job (`queued`, `running`, `done`, `error`) e l'array `products` con i risultati se completato.
* **GET `/health`**: verifica lo stato del server.

I risultati sono oggetti `ProductCard` con campi come `title`, `url`, `image`, `price`, `source` e `scrapedAt`.

## Come contribuire

* Forka il progetto e crea un branch per le tue modifiche.
* Aggiungi nuovi adapter di scraping in `server/sites/` seguendo l'esempio esistente.
* Apri una Pull Request descrivendo le tue modifiche.

## Licenza

Questo progetto è distribuito con licenza **MIT**.
