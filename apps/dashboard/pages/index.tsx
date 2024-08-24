import type { NextPage } from 'next'
import { withTabs } from 'hocs/withTabs'
import { withAuth } from 'hocs/withAuth'
import AddEmailProviderModal from 'modals/AddEmailProviderModal/AddEmailProviderModal'
import Statistics from 'components/Statistics/Statistics'
import { Button, Flex, Text } from '@mantine/core'
import { useState } from 'react'

const Home: NextPage = () => {
  const [modals, setModals] = useState({
    addNewProvider: false,
  })

  return (
    <>
      <Flex align="center" justify="space-between" mt="md">
        <Text variant="text" size="xl">
          Dashboard
        </Text>
        <Button
          onClick={() =>
            setModals((prev) => ({
              ...prev,
              addNewProvider: !prev.addNewProvider,
            }))
          }
        >
          Add New Service
        </Button>
      </Flex>

      <Statistics />

      <AddEmailProviderModal
        opened={modals.addNewProvider}
        toggle={() =>
          setModals((prev) => ({
            ...prev,
            addNewProvider: !prev.addNewProvider,
          }))
        }
      />
    </>
  )
}

export default withTabs(withAuth(Home))
