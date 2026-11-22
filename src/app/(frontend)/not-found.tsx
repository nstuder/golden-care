import { Button, Container, Heading, Icon, Text } from '@/components/atoms'

export default function NotFound() {
  return (
    <Container
      width="narrow"
      className="flex flex-1 flex-col items-center justify-center gap-6 py-32 text-center"
    >
      <Icon name="paw" className="size-14 text-primary-500" />
      <Heading level={1} size={2}>
        Hier ist leider niemand
      </Heading>
      <Text size="lg">Die Seite wurde nicht gefunden – vielleicht hat sie ein Hund vergraben.</Text>
      <Button href="/">Zur Startseite</Button>
    </Container>
  )
}
