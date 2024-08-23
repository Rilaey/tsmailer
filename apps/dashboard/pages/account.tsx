import type { NextPage } from 'next'
import { Text } from '@mantine/core'
import { useContext } from 'react'
import { UserContext } from 'context/userContext'
import { withTabs } from 'hocs/withTabs'
import { withAuth } from 'hocs/withAuth'

const Account: NextPage = () => {
  const { user } = useContext(UserContext)

  return (
    <>
      <Text>Welcome to the accounts page</Text>
    </>
  )
}

export default withTabs(withAuth(Account))
