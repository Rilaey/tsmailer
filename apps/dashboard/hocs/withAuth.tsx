import { Button, Center, Loader } from '@mantine/core'
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
    return (
      <>
        {user?.status === 'authenticated' ? (
          <>
            <WrappedComponent {...props} />
            <Button color="#9c6fe4" c="#fefefe" onClick={() => signOut()}>
              Logout
            </Button>
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
      </>
    )
  }
}
