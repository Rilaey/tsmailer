import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Tabs, Box, Text, rem } from '@mantine/core'

/**
 * Higher-order component that adds tabs to a settings page.
 * @function
 * @param {React.FC} WrappedComponent - The component to be wrapped with tabs.
 * @returns {React.FC} - The component with added tabs.
 */
export const withSettings = (WrappedComponent: React.FC): React.FC => {
  /**
   * Component that renders tabs and wraps the provided component.
   * @function
   * @returns {React.ReactElement} - The rendered component.
   */
  const TabsWithRouter: React.FC = () => {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<string>('general')

    useEffect(() => {
      const tab = router.asPath.split('/').pop() || 'general'
      setActiveTab(tab === 'settings' ? 'general' : tab)
    }, [router.asPath])

    const handleTabChange = (value: string) => {
      router.push(`/settings/${value === 'general' ? '' : value}`)
      setActiveTab(value)
    }

    return (
      <Tabs
        value={activeTab}
        onChange={(tab) => handleTabChange(tab as string)}
      >
        <Tabs.List>
          <Tabs.Tab value="general">General</Tabs.Tab>
          <Tabs.Tab value="subscription">Subscription</Tabs.Tab>
        </Tabs.List>
      </Tabs>
    )
  }

  return (props) => (
    <Box mt={rem(50)}>
      <Text variant="text" size="xl" mb="sm">
        Settings
      </Text>
      <TabsWithRouter />
      <WrappedComponent {...props} />
    </Box>
  )
}
