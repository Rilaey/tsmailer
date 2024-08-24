import React, { useState } from 'react'
import { Button, Flex, Grid, Text, TextInput } from '@mantine/core'
import RichTextEditor from 'components/common/RichTextEditor/RichTextEditor'
import { ContentState } from 'draft-js'
import { useRouter } from 'next/router'

export default function CreateTemplate() {
  const [name, setName] = useState(`My new template`)
  const [description, setDescription] = useState(`My new template`)
  const [subject, setSubject] = useState(`New message Test from {{from_name}}`)
  const [content, setContent] = useState(`Hello {{to_name}},
You got a new message from {{from_name}}:
{{message}}
Best Regards,
`)

  const router = useRouter()

  return (
    <Flex direction="column" justify="space-between" mt={50}>
      <Flex align="center" justify="space-between" my="md">
        <Text variant="text" size="xl">
          Email Templates
        </Text>
        <Button onClick={() => router.push('/templates/create')}>
          Create Template
        </Button>
      </Flex>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            mb="md"
            placeholder="Template name"
            withAsterisk
            required
            label="Name"
            value={description}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            mb="md"
            multiple
            withAsterisk
            required
            placeholder="Template description"
            label="Description"
            value={name}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        mb="md"
        placeholder="Subject"
        withAsterisk
        required
        label="Subject"
        value={subject}
        onChange={(sub) => setSubject(sub.target.value)}
      />

      <Text>Content</Text>
      <RichTextEditor
        content={ContentState.createFromText(content).getPlainText()}
        onChange={(newContent) => setContent(newContent)}
      />
      <Flex mt="md" align="center" justify="flex-end">
        <Button onClick={() => router.back()} variant="light">
          Go back
        </Button>
      </Flex>
    </Flex>
  )
}