import type { NextPage } from 'next'
import { withTabs } from 'hocs/withTabs'
import { withAuth } from 'hocs/withAuth'
import AddEmailProviderModal from 'modals/AddEmailProviderModal/AddEmailProviderModal'
import { Button, Flex, Text } from '@mantine/core'
import { useState } from 'react'
import ProviderList from 'components/Providers/Providers'

const Providers: NextPage = () => {
  const [modals, setModals] = useState({
    addNewProvider: false,
  })

  return (
    <>
      <Flex align="center" justify="space-between" mt="md">
        <Text variant="text" size="xl">
          Providers
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

      <AddEmailProviderModal
        opened={modals.addNewProvider}
        toggle={() =>
          setModals((prev) => ({
            ...prev,
            addNewProvider: !prev.addNewProvider,
          }))
        }
      />

      <ProviderList />
    </>
  )
}

export default withTabs(withAuth(Providers))
