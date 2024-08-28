import {
  SimpleGrid,
  Text,
  Paper,
  Group,
  RingProgress,
  Skeleton,
} from '@mantine/core'
import { Stat } from '../statistics.types'

interface StatsRingProps {
  loading: boolean
  stats: Stat[]
}
// Components
export function StatsRing({ stats, loading }: StatsRingProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      {stats.map(({ label, stats, progress, color }) => (
        <Paper
          withBorder
          radius="md"
          p="xs"
          my="lg"
          key={label}
          mih={100}
          style={{
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <Skeleton h="100%" w="100%" />
          ) : (
            <Group>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: progress, color }]}
              />
              <div>
                <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                  {label}
                </Text>
                <Text fw={700} size="xl">
                  {stats}
                </Text>
              </div>
            </Group>
          )}
        </Paper>
      ))}
    </SimpleGrid>
  )
}
