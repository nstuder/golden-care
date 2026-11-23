import { privacyPolicy } from './privacy'

const text = (site: Parameters<typeof privacyPolicy>[0]) => JSON.stringify(privacyPolicy(site))

describe('privacyPolicy', () => {
  it('names the controller from the settings', () => {
    const policy = text({
      name: 'Golden Care',
      owner: 'Anna Muster',
      street: 'Musterstrasse 12',
      zip: '1234',
      city: 'Musterort',
      email: 'hallo@golden-care.ch',
    })
    expect(policy).toContain('Golden Care, Anna Muster, Musterstrasse 12, 1234 Musterort')
    expect(policy).toContain('E-Mail: hallo@golden-care.ch')
  })

  it('covers the services the website uses', () => {
    const policy = text({ name: 'Golden Care' })
    for (const topic of ['Google Maps', 'Kontaktformular', 'Server-Logfiles', 'Schriftarten']) {
      expect(policy).toContain(topic)
    }
  })
})
