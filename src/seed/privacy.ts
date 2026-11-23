import type { SiteInfo } from '@/lib/site'

import type { RichTextInput } from './richText'

/** Text of the former placeholder; used by migrations to detect an unedited privacy page */
export const PRIVACY_PLACEHOLDER =
  'Bitte durch eine rechtlich geprüfte Datenschutzerklärung ersetzen.'

/** Marker of the first (Swiss) generated version, replaced by the German one */
export const PRIVACY_SWISS_MARKER = 'Massgebend ist das Schweizer Datenschutzgesetz'

export const PRIVACY_VERSION = 'November 2026'

/**
 * Privacy policy (GDPR, German law) for the website as it is built: hosting, contact form,
 * WhatsApp, Google Maps with click-to-load consent, self-hosted fonts, no tracking.
 */
export function privacyPolicy(site: SiteInfo): RichTextInput[] {
  const address = [site.street, [site.zip, site.city].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(', ')
  const contact = [
    site.phone ? `Telefon: ${site.phone}` : null,
    site.email ? `E-Mail: ${site.email}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return [
    'Mit dieser Datenschutzerklärung informieren wir dich darüber, welche personenbezogenen Daten wir beim Besuch unserer Website und bei der Kontaktaufnahme verarbeiten, zu welchem Zweck und auf welcher Rechtsgrundlage. Grundlage ist die Datenschutz-Grundverordnung (DSGVO) sowie das Telekommunikation-Digitale-Dienste-Datenschutz-Gesetz (TDDDG).',

    { h2: 'Verantwortliche Stelle' },
    [site.name, site.owner].filter(Boolean).join(', ') + (address ? `, ${address}` : ''),
    ...(contact ? [contact] : []),

    { h2: 'Hosting und Server-Logfiles' },
    'Unsere Website wird bei einem Hosting-Anbieter auf einem Server in Deutschland betrieben. Bei jedem Aufruf werden technisch notwendige Daten verarbeitet:',
    {
      ul: [
        'IP-Adresse des anfragenden Geräts',
        'Datum und Uhrzeit des Zugriffs',
        'aufgerufene Seite bzw. Datei und übertragene Datenmenge',
        'Browsertyp, Betriebssystem und die zuvor besuchte Seite (Referrer)',
      ],
    },
    'Diese Daten brauchen wir, um die Website auszuliefern, ihre Sicherheit zu gewährleisten und Fehler zu analysieren. Rechtsgrundlage ist unser berechtigtes Interesse an einem sicheren und funktionsfähigen Internetauftritt (Art. 6 Abs. 1 lit. f DSGVO). Die Daten werden nicht mit anderen Daten zusammengeführt und gelöscht, sobald sie für diese Zwecke nicht mehr erforderlich sind.',

    { h2: 'Kontaktformular, E-Mail und Telefon' },
    'Wenn du uns über das Kontaktformular, per E-Mail oder telefonisch kontaktierst, verarbeiten wir die Angaben, die du uns machst (z.B. Name, Kontaktdaten, Angaben zu deinem Hund und deine Nachricht), ausschließlich zur Bearbeitung deiner Anfrage und zur Terminvereinbarung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit deine Anfrage auf einen Termin oder Vertrag abzielt, und im Übrigen unser berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO).',
    'Wir geben diese Daten nicht ohne deine Einwilligung weiter und löschen sie, sobald deine Anfrage abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten (z.B. für Rechnungen) entgegenstehen.',

    { h2: 'WhatsApp' },
    'Du kannst uns auch über WhatsApp schreiben. Anbieter ist die WhatsApp Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland. Dabei werden Daten auch von WhatsApp bzw. dem Mutterkonzern Meta Platforms verarbeitet, unter Umständen auch in den USA. Meta ist unter dem EU-US Data Privacy Framework zertifiziert. Die Nutzung ist freiwillig; Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Wenn du das nicht möchtest, nutze bitte Telefon, E-Mail oder das Kontaktformular.',

    { h2: 'Google Maps' },
    'Auf unserer Kontaktseite kannst du eine Karte von Google Maps einblenden, damit du uns leichter findest. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; Muttergesellschaft ist die Google LLC in den USA.',
    'Die Karte wird erst geladen, wenn du auf „Karte laden“ klickst. Vorher werden keine Daten an Google übertragen. Mit dem Klick willigst du ein (Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG), dass dein Browser eine Verbindung zu Servern von Google herstellt. Dabei werden insbesondere deine IP-Adresse, Informationen zu deinem Browser und die aufgerufene Seite an Google übermittelt; Google kann Cookies setzen. Die Daten können in die USA übertragen werden; die Google LLC ist unter dem EU-US Data Privacy Framework zertifiziert. Auf diese Datenverarbeitung haben wir keinen Einfluss.',
    'Wählst du „Immer laden“, speichern wir diese Entscheidung im lokalen Speicher deines Browsers, damit die Karte künftig direkt erscheint. Du kannst deine Einwilligung jederzeit widerrufen, indem du die Websitedaten in deinem Browser löschst. Weitere Informationen findest du in der Datenschutzerklärung von Google unter policies.google.com/privacy.',

    { h2: 'Schriftarten' },
    'Die verwendeten Schriftarten werden direkt von unserem Server geladen. Dabei wird keine Verbindung zu Google Fonts oder anderen Anbietern hergestellt.',

    { h2: 'Cookies und Analyse' },
    'Wir verwenden keine Analyse- oder Tracking-Werkzeuge und keine Werbe-Cookies. Für Besucherinnen und Besucher setzt unsere Website selbst keine Cookies. Cookies von Google können erst gesetzt werden, wenn du die Karte lädst (siehe Google Maps).',

    { h2: 'Links zu sozialen Netzwerken' },
    'Auf unserer Website verlinken wir auf unsere Profile in sozialen Netzwerken (z.B. Instagram). Es handelt sich um einfache Links: Daten werden erst übertragen, wenn du einen Link anklickst. Danach gelten die Datenschutzbestimmungen des jeweiligen Netzwerks.',

    { h2: 'Deine Rechte' },
    'Du hast gegenüber uns folgende Rechte hinsichtlich deiner personenbezogenen Daten:',
    {
      ul: [
        'Auskunft (Art. 15 DSGVO)',
        'Berichtigung (Art. 16 DSGVO)',
        'Löschung (Art. 17 DSGVO)',
        'Einschränkung der Verarbeitung (Art. 18 DSGVO)',
        'Datenübertragbarkeit (Art. 20 DSGVO)',
        'Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)',
        'Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)',
      ],
    },
    'Wende dich dafür einfach an die oben genannte verantwortliche Stelle. Außerdem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO), zum Beispiel bei der Behörde deines Wohnorts oder der für uns zuständigen Landesdatenschutzbehörde.',

    { h2: 'Änderungen' },
    `Wir passen diese Datenschutzerklärung an, wenn sich unsere Website oder die rechtlichen Vorgaben ändern. Es gilt die jeweils hier veröffentlichte Fassung. Stand: ${PRIVACY_VERSION}.`,
  ]
}
