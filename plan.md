# Golden Care – Umsetzungsplan

**Golden Care – Salon für Hundegesundheit und Fellpflege**

Stack: Payload CMS 3 (MongoDB) + Next.js 16 (App Router) + Tailwind 4, Atomic Design, Sprache Deutsch.

## 1. Ziele & Rahmen

| Thema      | Entscheidung                                                                                        |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Seiten     | Home, Leistungen, Über uns, Galerie, Kontakt & Anfahrt, Impressum, Datenschutz                      |
| Preise     | Keine Preise – Hinweis „Preis abhängig von Grösse, Fell und Zustand“                                |
| Kontakt    | Telefon / WhatsApp / E‑Mail‑Links **plus** Kontaktformular (Payload Form Builder, Versand per SMTP) |
| Stammdaten | Platzhalter, im CMS unter „Einstellungen“ pflegbar                                                  |
| Farbschema | Gold + dunkles Violett, im CMS anpassbar (Global „Design“)                                          |
| Bilder     | Freie Platzhalterbilder (Unsplash), per Seed in die Mediathek geladen                               |
| Vorschau   | Payload Live Preview inkl. Entwürfe (Drafts + Autosave)                                             |
| Tests      | Vitest + Testing Library für alle Komponenten und Hilfsfunktionen                                   |

### Inspiration aus den Referenzen

- **elke-hundesalon.de**: persönlicher Ton, Leistungen als Icon‑Karten, „Qualitätsversprechen“-Liste, Kundenstimmen, FAQ (Kosten, Dauer, Termine, Produkte), Galerie mit Lightbox, Termin nur nach Vereinbarung.
- **hundesalon-fellkoenig.com**: grosses Hero mit CTA „Jetzt Termin vereinbaren“, Schnellkontakt‑Button im Header, Leistungs‑Kacheln mit Bild, Inhaber‑Vorstellung, Kundenstimme, klarer Kontaktblock (Telefon, E‑Mail, Öffnungszeiten, Adresse).

Golden Care kombiniert beides mit einem edleren Look (Gold auf dunklem Violett, Serif‑Headlines).

## 2. Design-System

### Theme (CMS‑steuerbar)

Global **„Design“** (`theme`) mit Basisfarben:

| Feld          | Default                     | Verwendung                                                |
| ------------- | --------------------------- | --------------------------------------------------------- |
| `primary`     | `#C9A54C` (Gold)            | Buttons, Akzente, Icons                                   |
| `secondary`   | `#2A1638` (dunkles Violett) | Header/Footer, Hero‑Overlay, dunkle Sektionen             |
| `background`  | `#FBF8F3`                   | Seitenhintergrund                                         |
| `foreground`  | `#22162B`                   | Fliesstext                                                |
| `headingFont` | `fraunces`                  | Auswahl: Fraunces / Playfair Display / Cormorant Garamond |
| `radius`      | `lg`                        | Eckenradius: none / sm / lg / full                        |

Umsetzung:

- Das Root‑Layout liest das Global und schreibt CSS‑Variablen (`--theme-primary` …) in ein `<style>` auf `:root`.
- `globals.css` mappt sie in `@theme` auf Tailwind‑Tokens; Abstufungen (50–900) werden per `color-mix()` aus der Basisfarbe berechnet → nur 4 Farben im CMS nötig.
- Utility `buildThemeCss()` validiert Hex‑Werte und fällt auf Defaults zurück (getestet).
- Das Global hat Entwürfe + Live Preview → Farben live ausprobieren, erst mit „Veröffentlichen“ aktiv.

### Atomic Design

```
src/components/
  atoms/       Button, Heading, Text, Eyebrow, Icon, Container, Section, Picture, RichText, Logo, Input, Textarea, Label
  molecules/   SectionHeader, ServiceCard, TestimonialCard, FeatureItem, ContactItem, NavLink, FaqItem, OpeningHours, FormField, SocialLinks
  organisms/   Header (inkl. Mobile‑Menü), Footer, Hero, ServicesGrid, Features, Testimonials,
               Gallery (Lightbox), Faq, ContactSection, ContactForm, CallToAction, ImageText, RichTextSection, PreviewBanner
  templates/   BaseTemplate
src/blocks/    Block‑Configs (Payload) + RenderBlocks → mappt Block‑Daten auf Organisms
```

Organisms sind rein präsentational (Props rein, kein Payload‑Zugriff) → einfach testbar. Datenbeschaffung passiert in `app/(frontend)` bzw. `src/lib/queries.ts`.

## 3. CMS-Modell

### Collections

| Collection                   | Felder (Auszug)                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `pages`                      | title, slug, layout (Blocks), meta (SEO‑Plugin); Drafts + Autosave + Live Preview |
| `services`                   | title, summary, description, icon, image, order                                   |
| `testimonials`               | quote, author, dog (z.B. „mit Luna, Golden Retriever“)                            |
| `media`                      | alt (Pflicht), Bildgrössen (thumbnail, card, hero)                                |
| `users`                      | Admin‑Login                                                                       |
| `forms` / `form-submissions` | via `@payloadcms/plugin-form-builder`                                             |

### Globals

| Global                       | Inhalt                                                                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `settings` („Einstellungen“) | Salonname, Claim, Inhaber*in, Adresse, Telefon, WhatsApp, E‑Mail, Öffnungszeiten (Array), Terminhinweis, Social Links, Karten‑Link |
| `navigation`                 | Header‑Links, Footer‑Links, CTA‑Button                                                                                             |
| `theme` („Design“)           | siehe oben                                                                                                                         |

### Blocks (Seiten‑Baukasten)

`hero`, `richText`, `imageText`, `servicesGrid` (alle oder ausgewählte Leistungen), `features` (Qualitätsversprechen), `testimonials`, `gallery`, `faq`, `callToAction`, `contact` (Kontaktdaten + Öffnungszeiten + Karte), `form` (Form‑Builder‑Formular).

### Seiteninhalte (Seed)

- **Home**: Hero mit CTA → Intro (ImageText) → Leistungen (Auswahl) → Qualitätsversprechen → Kundenstimmen → CTA „Termin vereinbaren“
- **Leistungen**: Hero → alle Leistungen → Hinweis zu Preisen (RichText) → FAQ (Kosten, Dauer, Termine, Produkte) → CTA
- **Über uns**: Hero → Inhaberin (ImageText) → Werte (Features) → Galerie‑Teaser
- **Galerie**: Hero → Gallery mit Lightbox
- **Kontakt & Anfahrt**: Hero → Kontaktblock (Telefon, WhatsApp, E‑Mail, Adresse, Öffnungszeiten, Karte) → Kontaktformular
- **Impressum / Datenschutz**: RichText mit Platzhaltern

## 4. Live Preview & Entwürfe

- `pages` und `theme` mit `versions.drafts.autosave`.
- `admin.livePreview` mit Breakpoints (Mobil / Tablet / Desktop) und URL auf `/next/preview?path=…`.
- Route `/next/preview`: prüft eingeloggten Payload‑User (kein zusätzliches Secret nötig) und erlaubt nur lokale Pfade, aktiviert `draftMode()`, leitet auf den Pfad weiter. `/next/exit-preview` beendet ihn.
- Seiten laden im Draft Mode mit `draft: true`; `<RefreshRouteOnSave>` (`@payloadcms/live-preview-react`) lädt die Route bei jedem Autosave neu.
- Hinweisbanner „Vorschau aktiv“ im Draft Mode.

## 5. Kontaktformular & E‑Mail

- `@payloadcms/plugin-form-builder` (Felder: Name, E‑Mail, Telefon, Hund/Rasse, Nachricht).
- Einsendungen landen im CMS; Bestätigungs‑ und Benachrichtigungs‑Mails über `@payloadcms/email-nodemailer`.
- SMTP über `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`). Ohne SMTP: Mails werden nur geloggt (Formular funktioniert trotzdem).

## 6. Bilder

- Platzhalter: freie Unsplash‑Fotos (Unsplash License), Liste in `src/seed/images.ts`.
- Seed lädt sie herunter und legt sie als `media` an → später einfach in der Mediathek ersetzen.
- Ausgabe über `next/image`; Fallback‑Platzhalter (Verlauf + Pfote), falls kein Bild gesetzt.

## 7. Seed

- `src/seed/` erstellt Medien, Leistungen, Kundenstimmen, Formular, Seiten und Globals (idempotent: nur wenn leer bzw. mit `--force`).
- Ausführbar lokal per `pnpm seed` (`pnpm seed -- --force`) und im Admin per Button „Beispielinhalte laden“ auf dem Dashboard (`POST /api/seed`, nur eingeloggt) → funktioniert auch auf dem Server ohne Shell.

## 8. Tests

- Vitest + jsdom + `@testing-library/react` + `@testing-library/jest-dom` + `user-event`.
- Unit‑Tests für jedes Atom/Molecule/Organism (Rendering, Varianten, a11y‑Rollen, Interaktion: Mobile‑Menü, Lightbox, FAQ‑Accordion, Formular‑Validierung).
- Tests für `buildThemeCss`, Link‑Auflösung, `RenderBlocks`.
- Scripts `pnpm test`, `pnpm test:watch`; Tests laufen nicht im Docker-Build (schneller Deploy), sondern lokal / in CI.

## 9. SEO & Qualität

- `@payloadcms/plugin-seo` für Meta‑Titel/Beschreibung/Bild pro Seite, `generateMetadata`.
- `sitemap.ts`, `robots.ts` (Indexierung erst mit `ALLOW_INDEXING=true`), JSON‑LD – siehe 9b (Name, Adresse, Öffnungszeiten aus „Einstellungen“).
- Barrierefreiheit: semantische Landmarks, Fokus‑Stile, Kontrast Gold/Violett geprüft, Skip‑Link.

## 9b. Lokale SEO & strukturierte Daten (Erweiterung)

- [x] Öffnungszeiten strukturiert (Wochentage + Öffnet/Schliesst), Anzeige inkl. „geschlossen“ automatisch
- [x] Migration der bisherigen Freitext-Öffnungszeiten (`src/migrations`, läuft beim Start in Produktion)
- [x] Einstellungen → Tab „SEO & Google“: Unternehmenstyp, Standardbild, Region, Land, Koordinaten, Einzugsgebiet, Preisniveau
- [x] JSON-LD-Graph: LocalBusiness (+ OfferCatalog aus Leistungen), WebSite, WebPage/ContactPage/CollectionPage, BreadcrumbList, FAQPage
- [x] Metadaten pro Seite mit Fallbacks, Canonical, Open Graph/Twitter, `noindex`-Option, `lang="de-CH"`, Theme-Farbe
- [x] Sitemap mit Prioritäten (ohne noindex-Seiten), Favicon, Apple-Icon, Logo, Web-Manifest
- [x] Tests für alle Builder und Hilfsfunktionen
- [ ] Echte Koordinaten/Region eintragen, Google-Unternehmensprofil & Search Console (nach Go-live)

## 9c. Logo & Caching (Erweiterung)

- [x] Logo nach Vorlage der Kundin: Golden Retriever im Trab, Lorbeerzweige, goldener Pinselring, Marcellus-Schrift (Vektor, `src/components/atoms/Logo`)
- [x] Header-Logo (Hund + Wortmarke), rundes Logo im Footer, Favicon, Apple-Icon, `public/logo.png`
- [x] ISR: Seiten werden beim ersten Aufruf gerendert und gecacht, Änderungen im CMS erneuern den Cache sofort (`src/plugins/revalidate.ts`)
- [x] Kontakt: Google-Maps-Karte (lädt direkt), abschaltbar im Kontakt-Abschnitt
- [x] Header: Infoleiste (Öffnungszeiten, Adresse, Telefon, Social), schrumpft beim Scrollen, goldene Linie, CTA mit Glanz-Effekt
- [x] Scroll-Animationen mit IntersectionObserver (`data-reveal`, respektiert „reduzierte Bewegung“), Hero-Einstieg
- [x] Datenschutzerklärung vollständig (Hosting, Kontakt, WhatsApp, Google Maps, Schriften, Cookies, Rechte), Migration ersetzt den Platzhalter
- [x] Prettier in ESLint integriert (`eslint-plugin-prettier`, `eslint-config-prettier`), `pnpm format` / `format:check`
- [x] Code-Review: sichere Preview-Redirects, Seed lädt Bilder vor dem Löschen, Kontaktformular an `CONTACT_EMAIL`, fehlerhafte URLs → 404, WhatsApp-Nummern normalisiert u.a.
- [ ] Datenschutzerklärung rechtlich prüfen lassen

## 10. Umsetzungsschritte

1. [x] Plan
2. [x] Dependencies (Form Builder, SEO, Nodemailer, Live Preview, Vitest/Testing Library)
3. [x] Theme‑System (Global, CSS‑Variablen, Tailwind‑Tokens)
4. [x] Collections, Globals, Blocks
5. [x] Atoms → Molecules → Organisms → Templates
6. [x] Routen: `/` + `/[slug]`, Preview‑Routen, Formular‑Submit, Sitemap/Robots
7. [x] Live Preview
8. [x] Seed + Admin‑Button
9. [x] Tests
10. [x] Typecheck, Lint, Build, Smoke‑Test lokal
11. [x] `.env.example`/README ergänzen
12. [x] Deploy auf golden-care.niklas-studer.com (22.11.2026), Beispielinhalte geladen

## 11. Später / offen

- Echte Stammdaten, Logo, Fotos und Texte
- SMTP‑Zugang für Formular‑Mails
- Impressum/Datenschutz juristisch korrekt befüllen
- Go-live: `ALLOW_INDEXING=true` in der Server-`.env` setzen und neu deployen
- Optional: Online‑Terminbuchung, Google‑Bewertungen, Instagram‑Feed
