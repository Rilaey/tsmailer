import React, { useState } from "react";
import { Button, Flex, Grid, Text, TextInput } from "@mantine/core";
import RichTextEditor from "components/common/RichTextEditor/RichTextEditor";
import { ContentState } from "draft-js";
import { useRouter } from "next/router";
import { notifications } from "@mantine/notifications";
import { useSession } from "next-auth/react";

export default function CreateTemplate() {
  const [name, setName] = useState(`My new template`);
  const [description, setDescription] = useState(`My new template`);
  const [subject, setSubject] = useState(`New message Test from {{from_name}}`);
  const [content, setContent] = useState(`Hello {{to_name}},
You got a new message from {{from_name}}:
{{message}}
Best Regards,
{{from_name}}
`);

  const { data: session } = useSession();

  const router = useRouter();

  // 1) Only here for testing
  // 2) Needs to be made into a hook
  // 3) Outlines how we have to send the token to api

  const handleCreateTemplate = async () => {
    try {
      if (!session) return null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_API_URL}/api/template/createTemplate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.accessToken}`
          },
          body: JSON.stringify({
            name: name,
            description: description,
            subject: subject,
            content: content
          }),
          credentials: "include"
        }
      );

      if (!response.ok) {
        return notifications.show({
          position: "top-right",
          title: "Error creating template.",
          message: "Try again.",
          color: "red"
        });
      }

      router.push(`/templates`);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <Flex direction="column" justify="space-between" mt={50}>
      <Flex align="center" justify="space-between" my="md">
        <Text variant="text" size="xl">
          Email Templates
        </Text>
        <Button onClick={() => handleCreateTemplate()}>Create Template</Button>
      </Flex>
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            mb="md"
            placeholder="Template name"
            withAsterisk
            required
            label="Name"
            value={name}
            name="name"
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
            value={description}
            name="description"
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
        name="subject"
        onChange={(e) => setSubject(e.target.value)}
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
  );
}
