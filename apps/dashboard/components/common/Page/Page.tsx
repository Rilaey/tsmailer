import React from 'react'
import { Box } from '@mantine/core'

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <Box component="section" mt={60}>
      {children}
    </Box>
  )
}
