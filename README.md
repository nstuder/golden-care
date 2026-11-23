# Golden Care

Website für **Golden Care – Salon für Hundegesundheit und Fellpflege** – [Payload CMS](https://payloadcms.com) 3 + Next.js 16, gestylt mit Tailwind CSS 4.

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
- Beispielinhalte: im Admin-Dashboard „Beispielinhalte laden“ oder `pnpm seed` (`pnpm seed -- --force` überschreibt)

`pnpm db:down` stoppt die Datenbank; die Daten bleiben im Docker-Volume erhalten.

Nützliche Skripte: `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format`, `pnpm generate:types`, `pnpm generate:importmap`.

Den Umsetzungsplan findest du in [`plan.md`](plan.md).

## Inhalte pflegen (CMS)

| Bereich                        | Inhalt                                                                                                                                                                                  |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Seiten**                     | Aus Abschnitten (Blocks) zusammengesetzt: Hero, Text, Bild & Text, Leistungen, Vorteile, Kundenstimmen, Galerie, FAQ, Call to Action, Kontaktdaten, Formular. Slug `home` = Startseite. |
| **Leistungen / Kundenstimmen** | Werden von den gleichnamigen Abschnitten angezeigt (alle oder Auswahl).                                                                                                                 |
| **Formulare / Einsendungen**   | Kontaktformular (Payload Form Builder). E-Mails nur mit SMTP-Konfiguration (`SMTP_*` in `.env`).                                                                                        |
| **Einstellungen**              | Name, Kontakt, Adresse, Öffnungszeiten, Social Media – erscheinen in Header, Footer und Kontaktblock.                                                                                   |
| **Navigation**                 | Hauptmenü, Header-Button, Footer-Links.                                                                                                                                                 |
| **Design**                     | Gold-/Violett-Farben, Hintergrund, Textfarbe, Überschriften-Schrift und Ecken.                                                                                                          |

**Live-Vorschau:** Seiten und Design haben Entwürfe mit Autosave. Im Editor über das Auge-Symbol
die Live-Vorschau öffnen – Änderungen erscheinen sofort, veröffentlicht wird erst mit „Änderungen veröffentlichen“.
Technisch: `/next/preview` aktiviert für eingeloggte Benutzer den Next.js Draft Mode.

## SEO & strukturierte Daten

- **JSON-LD (schema.org)** – `src/lib/seo/jsonLd.ts` baut einen verknüpften Graphen:
  `LocalBusiness` (Adresse, Geo, Öffnungszeiten, Leistungen als `OfferCatalog`, Social Profile, Einzugsgebiet),
  `WebSite`, pro Seite `WebPage`/`ContactPage`/`CollectionPage`, `BreadcrumbList` und `FAQPage` (aus FAQ-Abschnitten).
  Prüfen mit dem [Rich Results Test](https://search.google.com/test/rich-results) oder dem [Schema Validator](https://validator.schema.org/).
- **Metadaten** – `src/lib/seo/metadata.ts`: Titel, Beschreibung (SEO-Feld → Hero-Text → Einstellungen),
  Canonical, Open Graph/Twitter-Bild (SEO-Bild → Hero-Bild → Standardbild), `lang="de-DE"`, Theme-Farbe.
- **Pro Seite** im Bereich „SEO“: Titel, Beschreibung, Bild (mit „Generieren“-Vorschlägen) und „noindex“.
- **Sitemap** (`/sitemap.xml`, ohne noindex-Seiten), **robots.txt**, Favicon/Apple-Icon, `logo.png`, Web-Manifest.
- **Indexierung** erst mit `ALLOW_INDEXING=true` (robots.txt + `<meta name="robots">`).

Für Google zusätzlich empfohlen: Google-Unternehmensprofil mit identischem Namen, Adresse und Telefonnummer (NAP),
Search Console einrichten und die Sitemap einreichen.

**Datenmigrationen** liegen in `src/migrations/` und laufen in Produktion beim Start automatisch (`prodMigrations`).

**Bilder:** Die Beispielinhalte verwenden Platzhalterfotos von Unsplash. Einfach in „Medien“ ersetzen.

## Caching (ISR)

Alle Seiten laufen über `src/app/(frontend)/[[...slug]]/page.tsx` mit Incremental Static Regeneration: Eine Seite wird beim ersten Aufruf gerendert und danach aus dem Cache ausgeliefert (Header `x-nextjs-cache: HIT`). Beim Build wird nichts vorgerendert, weil der Docker-Build keine Datenbank hat.

Sobald im CMS etwas veröffentlicht wird (Seiten, Leistungen, Kundenstimmen, Medien, Formulare, Einstellungen, Navigation, Design), leert `src/plugins/revalidate.ts` den Cache der ganzen Website. Zusätzlich wird jede Seite spätestens nach 24 Stunden neu gerendert. Die Live-Vorschau (Draft Mode) ist immer dynamisch.

## Code-Stil

Prettier formatiert den Code und läuft auch als ESLint-Regel (`eslint-plugin-prettier`, Konflikte abgeschaltet via `eslint-config-prettier`).

```bash
pnpm format        # alles formatieren
pnpm format:check  # nur prüfen
pnpm lint          # ESLint inkl. Prettier
```

## Tests

Vitest + Testing Library (`*.test.ts(x)` neben den Komponenten und Hilfsfunktionen):

```bash
pnpm test         # einmal
pnpm test:watch   # Watch-Modus
```

## Struktur (Atomic Design)

```
src/
├── app/
│   ├── (frontend)/        # Next.js-Routen der Website (= "Pages" im Atomic Design), Preview-Routen
│   └── (payload)/         # Payload Admin + API (generiert, nicht anpassen)
├── access/                # Zugriffsregeln
├── blocks/                # Block-Configs + RenderBlocks (CMS-Daten → Organisms)
├── collections/           # Payload Collections (Seiten, Leistungen, Kundenstimmen, Medien, Benutzer)
├── globals/               # Einstellungen, Navigation, Design
├── fields/                # wiederverwendbare Felder (Link, Slug, ...)
├── components/
│   ├── atoms/             # kleinste Bausteine: Heading, Button, Icon, Picture, ...
│   ├── molecules/         # Kombinationen aus Atoms: ServiceCard, FaqItem, FormField, ...
│   ├── organisms/         # Sektionen: Header, Footer, Hero, Gallery, ContactForm, ...
│   ├── templates/         # Seitengerüste/Layouts
│   └── admin/             # eigene Admin-Komponenten (Farbwähler, Seed-Button)
├── lib/                   # Hilfsfunktionen (Theme, Links, Medien, Queries, ...)
├── seed/                  # Beispielinhalte
└── payload.config.ts
```

Jede Komponente liegt in einem eigenen Ordner (`Heading/Heading.tsx` + `index.ts`) und wird über das
`index.ts` der Ebene exportiert, z. B. `import { Heading } from '@/components/atoms'`.

Organisms sind rein präsentational (nur Props, kein Payload-Zugriff) und dadurch einfach testbar.

**Theme:** Das Global „Design“ wird im Root-Layout als CSS-Variablen (`--theme-*`) ausgegeben
(`src/lib/theme.ts`). `globals.css` leitet daraus die Tailwind-Farben `primary-50…900` (Gold),
`secondary-50…900` (Violett), `background`, `foreground` und `muted` per `color-mix()` ab.

## Deployment

Produktion läuft auf dem Server mit Docker Compose hinter Traefik (`docker-compose.yml`):

- `golden-care-cms` – Next.js/Payload (Dockerfile, standalone build), Domain `golden-care.niklas-studer.com`
- `golden-care-mongo` – MongoDB 4.4 im internen Netzwerk, Daten in `./db-data`
- Uploads im Docker-Volume `golden-care-media`

### Einmalig auf dem Server

1. Repo nach `/home/nstuder/golden-care` klonen (das Playbook macht das beim ersten Lauf auch selbst).
2. `.env` aus `.env.example` erstellen und `PAYLOAD_SECRET`, `MONGO_USERNAME`, `MONGO_PASSWORD`,
   `MONGO_DATABASE` setzen. `DATABASE_URL` und `NEXT_PUBLIC_SERVER_URL` setzt `docker-compose.yml`.
   Optional: `SMTP_*`/`CONTACT_EMAIL` für Formular-Mails, `ALLOW_INDEXING=true` sobald die Seite live gehen soll.
3. Das externe Docker-Netzwerk `traefik` muss existieren (wie bei den anderen Projekten).

### Deploy

```bash
pnpm run deploy   # ansible-playbook -i deploy/hosts deploy/deploy-playbook.yml
```

Das Playbook aktualisiert den `main`-Branch auf dem Server, prüft die `.env` und baut/startet die Container neu.

### Backup

`./backup.sh` auf dem Server (im Projektordner) sichert die MongoDB und die Uploads nach `~/backups/golden-care`.
