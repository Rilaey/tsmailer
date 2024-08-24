import { SimpleGrid, Text, Paper, Group, RingProgress } from '@mantine/core'
import { Stat } from '../useStatistics'

// Components
export function StatsRing({ stats }: { stats: Stat[] }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }}>
      {stats.map(({ label, stats, progress, color }) => (
        <Paper withBorder radius="md" p="xs" my="lg" key={label}>
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
        </Paper>
      ))}
    </SimpleGrid>
  )
}
