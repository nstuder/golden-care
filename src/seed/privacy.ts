import type { SiteInfo } from '@/lib/site'

import type { RichTextInput } from './richText'

/** Text of the former placeholder; used by the migration to detect an unedited privacy page */
export const PRIVACY_PLACEHOLDER =
  'Bitte durch eine rechtlich geprüfte Datenschutzerklärung ersetzen.'

export const PRIVACY_VERSION = 'November 2026'

/**
 * Privacy policy for the website as it is built: own server, contact form, Google Maps embed,
 * self-hosted fonts, no tracking. Based on the Swiss revDSG, with the GDPR where it applies.
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
    `Mit dieser Datenschutzerklärung informieren wir darüber, welche Personendaten wir beim Besuch unserer Website und bei der Kontaktaufnahme bearbeiten. Massgebend ist das Schweizer Datenschutzgesetz (DSG); soweit anwendbar, berücksichtigen wir auch die EU-Datenschutz-Grundverordnung (DSGVO).`,

    { h2: 'Verantwortliche Stelle' },
    [site.name, site.owner].filter(Boolean).join(', ') + (address ? `, ${address}` : ''),
    ...(contact ? [contact] : []),

    { h2: 'Hosting und Server-Logfiles' },
    'Unsere Website wird auf einem gemieteten Server in Deutschland betrieben. Bei jedem Aufruf werden technisch notwendige Daten verarbeitet:',
    {
      ul: [
        'IP-Adresse des anfragenden Geräts',
        'Datum und Uhrzeit des Zugriffs',
        'aufgerufene Seite bzw. Datei und übertragene Datenmenge',
        'Browsertyp, Betriebssystem und die zuvor besuchte Seite (Referrer)',
      ],
    },
    'Diese Daten brauchen wir, um die Website auszuliefern, ihre Sicherheit zu gewährleisten und Fehler zu analysieren. Sie werden nicht mit anderen Daten zusammengeführt und nur so lange aufbewahrt, wie es für diese Zwecke nötig ist.',

    { h2: 'Kontaktformular, E-Mail, Telefon und WhatsApp' },
    'Wenn du uns über das Kontaktformular, per E-Mail oder telefonisch kontaktierst, bearbeiten wir die Angaben, die du uns machst (z.B. Name, Kontaktdaten, Angaben zu deinem Hund und deine Nachricht), ausschliesslich zur Beantwortung deiner Anfrage und zur Terminvereinbarung. Wir geben diese Daten nicht ohne deine Einwilligung weiter und löschen sie, sobald sie nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten bestehen.',
    'Wenn du uns über WhatsApp schreibst, werden Daten auch von WhatsApp bzw. Meta Platforms verarbeitet, teilweise in den USA. Es gelten zusätzlich die Datenschutzbestimmungen von WhatsApp. Wenn du das nicht möchtest, nutze bitte Telefon, E-Mail oder das Kontaktformular.',

    { h2: 'Google Maps' },
    'Auf unserer Kontaktseite ist eine Karte von Google Maps eingebunden, damit du uns leichter findest. Anbieter ist Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland; die Muttergesellschaft ist Google LLC in den USA.',
    'Beim Anzeigen der Karte stellt dein Browser eine Verbindung zu Servern von Google her. Dabei werden insbesondere deine IP-Adresse, Informationen zu deinem Browser und die aufgerufene Seite an Google übermittelt; Google kann dabei Cookies setzen. Die Daten können in die USA übertragen werden. Google LLC ist unter dem EU-US- und dem Swiss-US Data Privacy Framework zertifiziert. Wir haben keinen Einfluss auf diese Datenverarbeitung.',
    'Die Karte erleichtert die Anfahrt zu unserem Salon. Weitere Informationen findest du in der Datenschutzerklärung von Google unter policies.google.com/privacy. Du kannst die Datenübertragung verhindern, indem du die Kontaktseite nicht aufrufst oder in deinem Browser Inhalte von Drittanbietern blockierst.',

    { h2: 'Schriftarten' },
    'Die verwendeten Schriftarten werden direkt von unserem Server geladen. Dabei wird keine Verbindung zu Google Fonts oder anderen Anbietern hergestellt.',

    { h2: 'Cookies und Analyse' },
    'Wir verwenden keine Analyse- oder Tracking-Werkzeuge und keine Werbe-Cookies. Für Besucherinnen und Besucher setzt unsere Website selbst keine Cookies. Cookies von Google können beim Anzeigen der Karte gesetzt werden (siehe Google Maps).',

    { h2: 'Links zu sozialen Netzwerken' },
    'Auf unserer Website verlinken wir auf unsere Profile in sozialen Netzwerken (z.B. Instagram). Es handelt sich um einfache Links: Daten werden erst übertragen, wenn du einen Link anklickst. Danach gelten die Datenschutzbestimmungen des jeweiligen Netzwerks.',

    { h2: 'Deine Rechte' },
    'Du hast das Recht, Auskunft über deine bei uns gespeicherten Personendaten zu verlangen und sie berichtigen oder löschen zu lassen. Du kannst der Bearbeitung widersprechen und erteilte Einwilligungen jederzeit widerrufen. Wende dich dafür an die oben genannte verantwortliche Stelle.',
    'Du kannst dich ausserdem beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB, edoeb.admin.ch) oder, falls die DSGVO anwendbar ist, bei einer Datenschutz-Aufsichtsbehörde in der EU beschweren.',

    { h2: 'Änderungen' },
    `Wir passen diese Datenschutzerklärung an, wenn sich unsere Website oder die rechtlichen Vorgaben ändern. Es gilt die jeweils hier veröffentlichte Fassung. Stand: ${PRIVACY_VERSION}.`,
  ]
}
