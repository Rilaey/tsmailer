import type { NextPage } from 'next'
import { withTabs } from 'hocs/withTabs'
import { withAuth } from 'hocs/withAuth'
import { Flex, Text } from '@mantine/core'

const Templates: NextPage = () => {
  return (
    <Flex align="center" justify="space-between" mt="md">
      <Text variant="text" size="xl">
        Templates
      </Text>
    </Flex>
  )
}

export default withTabs(withAuth(Templates))
