import { Button, Flex, Paper, Skeleton, Text } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

// Reusable chart wrapper component
type ChartPaperProps = {
  title: string
  width: string
  minWidth: number
  children: React.ReactNode
  loading: boolean
}

export function ChartPaper({
  title,
  width,
  minWidth,
  children,
  loading,
}: ChartPaperProps) {
  return (
    <Paper
      withBorder
      radius="md"
      w={width}
      miw={minWidth}
      pb="md"
      pr={loading ? 0 : 'lg'}
      mih={200}
      style={{
        overflow: 'hidden',
      }}
    >
      <Flex align="center" justify="space-between" px={loading ? 'sm' : 0}>
        <Text size="lg" ml="xs" my="sm" mb="md">
          {title}
        </Text>
        <Button color="gray" variant="light" size="xs">
          <IconArrowUpRight />
        </Button>
      </Flex>
      {loading ? <Skeleton h="100%" w="100%" /> : children}
    </Paper>
  )
}
