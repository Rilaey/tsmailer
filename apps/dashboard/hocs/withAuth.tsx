import {
  AppShell,
  Burger,
  Text,
  Button,
  Center,
  Loader,
  Box,
  Flex,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Navbar from 'components/Navbar/Navbar'
import { UserContext } from 'context/userContext'
import { signOut } from 'next-auth/react'
import React, { useContext } from 'react'

/**
 * Higher-order component that handles displaying authenticated sessions
 * @function
 * @param {React.FC} WrappedComponent - The component to be wrapped with auth context.
 * @returns {React.FC} - The component with added auth context.
 */
export const withAuth = (WrappedComponent: React.FC): React.FC => {
  return (props) => {
    const { user } = useContext(UserContext)
    const [opened, { toggle }] = useDisclosure()

    return (
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        {user?.status === 'authenticated' ? (
          <>
            <AppShell.Header>
              <Flex
                pt="xs"
                px="lg"
                align="center"
                justify="space-between"
                w="100%"
              >
                <Text
                  style={{
                    fontSize: '30px',
                  }}
                  c="#fefefe"
                >
                  <span
                    style={{
                      color: '#9c6fe4',
                    }}
                  >
                    TS
                  </span>
                  Mailer
                </Text>
                <Flex align="center" gap="sm">
                  <Text>{user.data.name}</Text>
                  <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                  />
                </Flex>
              </Flex>
            </AppShell.Header>

            <AppShell.Navbar>
              <Navbar />
            </AppShell.Navbar>

            <AppShell.Main
              style={{
                paddingTop: '2rem',
              }}
            >
              <WrappedComponent {...props} />
            </AppShell.Main>
          </>
        ) : user?.status === 'loading' ? (
          <Center mih="50vh">
            <Loader color="#9c6fe4" />
          </Center>
        ) : (
          // TODO Consider creating fallback component or route to login
          <Button
            color="#9c6fe4"
            variant="filled"
            m={5}
            component="a"
            href="/login"
          >
            Login
          </Button>
        )}
      </AppShell>
    )
  }
}
