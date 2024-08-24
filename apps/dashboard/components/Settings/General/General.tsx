import { Box, Text, Flex, Card, TextInput, Button } from '@mantine/core'
import { UserContext } from 'context/userContext'
import React, { useContext } from 'react'

export default function General() {
  const { user } = useContext(UserContext)

  return (
    <Box mt="md">
      <Flex direction="column" gap="md">
        {/* Contact Details Card */}
        <Card w="100%">
          <Text my="md">Contact Details</Text>
          <TextInput
            label="Name"
            placeholder="Your name"
            defaultValue={user?.data.name || 'John Doe'}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            defaultValue={user?.data.email || 'johndoe@example.com'}
            disabled
            mt="md"
          />

          <Button my="md" w={200} size="md">
            Save
          </Button>
        </Card>

        {/* Account Information Card */}
        <Card w="100%">
          <Text my="md">Account Information</Text>
          <TextInput
            label="Username"
            placeholder="Your username"
            defaultValue={'johndoe123'}
          />
          <TextInput
            label="Account Type"
            placeholder="Your account type"
            defaultValue={'Premium'}
            mt="md"
            disabled
          />
          <TextInput
            label="Membership Since"
            placeholder="Membership start date"
            defaultValue={'January 1, 2022'}
            mt="md"
            disabled
          />
          <Button my="md" w={200} size="md">
            Update Info
          </Button>
        </Card>
      </Flex>
    </Box>
  )
}
