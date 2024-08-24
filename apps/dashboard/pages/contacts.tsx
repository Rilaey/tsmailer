import type { NextPage } from 'next'
import { withTabs } from 'hocs/withTabs'
import { withAuth } from 'hocs/withAuth'
import { Flex, Text } from '@mantine/core'

const Contacts: NextPage = () => {
  return (
    <Flex align="center" justify="space-between" mt="md">
      <Text variant="text" size="xl">
        Contacts
      </Text>
    </Flex>
  )
}

export default withTabs(withAuth(Contacts))
