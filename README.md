# Golden Care

Website für den Hundecoiffeur **Golden Care** – [Payload CMS](https://payloadcms.com) 3 + Next.js 16, gestylt mit Tailwind CSS 4.

## Voraussetzungen

- Node.js 24 (`nvm use` liest `.nvmrc`)
- pnpm 10 (`corepack enable pnpm`)
- Docker (für die lokale MongoDB)

## Lokale Entwicklung

```bash
cp .env.example .env      # PAYLOAD_SECRET setzen: openssl rand -hex 32
pnpm install
pnpm db:up                # MongoDB 4.4 auf localhost:27018 (docker-compose.dev.yml)
pnpm dev
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin (beim ersten Aufruf ersten Benutzer anlegen)

`pnpm db:down` stoppt die Datenbank; die Daten bleiben im Docker-Volume erhalten.

Nützliche Skripte: `pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm generate:types`, `pnpm generate:importmap`.

## Struktur (Atomic Design)

```
src/
├── app/
│   ├── (frontend)/        # Next.js-Routen der Website (= "Pages" im Atomic Design)
│   └── (payload)/         # Payload Admin + API (generiert, nicht anpassen)
├── collections/           # Payload Collections
├── components/
│   ├── atoms/             # kleinste Bausteine: Heading, Button, Text, ...
│   ├── molecules/         # Kombinationen aus Atoms: Card, NavItem, ...
│   ├── organisms/         # grössere Sektionen: Header, Footer, Hero, ...
│   └── templates/         # Seitengerüste/Layouts
├── lib/                   # Hilfsfunktionen (z. B. `cn` für Tailwind-Klassen)
└── payload.config.ts
```

Jede Komponente liegt in einem eigenen Ordner (`Heading/Heading.tsx` + `index.ts`) und wird über das
`index.ts` der Ebene exportiert, z. B. `import { Heading } from '@/components/atoms'`.

Design-Tokens (Farben, Schriften) sind in `src/app/(frontend)/globals.css` im `@theme`-Block definiert.

## Deployment

Produktion läuft auf dem Server mit Docker Compose hinter Traefik (`docker-compose.yml`):

- `golden-care-cms` – Next.js/Payload (Dockerfile, standalone build), Domain `golden-care.niklas-studer.com`
- `golden-care-mongo` – MongoDB 4.4 im internen Netzwerk, Daten in `./db-data`
- Uploads im Docker-Volume `golden-care-media`

### Einmalig auf dem Server

1. Repo nach `/home/nstuder/golden-care` klonen (das Playbook macht das beim ersten Lauf auch selbst).
2. `.env` aus `.env.example` erstellen und `PAYLOAD_SECRET`, `MONGO_USERNAME`, `MONGO_PASSWORD`,
   `MONGO_DATABASE` setzen. `DATABASE_URL` und `NEXT_PUBLIC_SERVER_URL` setzt `docker-compose.yml`.
3. Das externe Docker-Netzwerk `traefik` muss existieren (wie bei den anderen Projekten).

### Deploy

```bash
pnpm run deploy   # ansible-playbook -i deploy/hosts deploy/deploy-playbook.yml
```

Das Playbook aktualisiert den `main`-Branch auf dem Server, prüft die `.env` und baut/startet die Container neu.

### Backup

`./backup.sh` auf dem Server (im Projektordner) sichert die MongoDB und die Uploads nach `~/backups/golden-care`.
