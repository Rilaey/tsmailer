import { Button, Flex, Paper, Text } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

// Reusable chart wrapper component
type ChartPaperProps = {
  title: string
  width: string
  minWidth: number
  children: React.ReactNode
}

export function ChartPaper({
  title,
  width,
  minWidth,
  children,
}: ChartPaperProps) {
  return (
    <Paper withBorder radius="md" w={width} miw={minWidth} pb="md" pr="lg">
      <Flex align="center" justify="space-between">
        <Text size="lg" ml="xs" my="sm" mb="md">
          {title}
        </Text>
        <Button color="gray" variant="light" size="xs">
          <IconArrowUpRight />
        </Button>
      </Flex>
      {children}
    </Paper>
  )
}
