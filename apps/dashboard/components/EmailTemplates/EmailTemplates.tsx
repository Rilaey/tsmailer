import {
  Group,
  Avatar,
  Box,
  Text,
  Accordion,
  Button,
  Flex,
  Chip,
} from '@mantine/core'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

interface AccordionLabelProps {
  label: string
  description: string
  isDefault?: boolean
}

const emailTemplates = [
  {
    name: 'My Default Template',
    id: 'template_oq7usp8',
    content:
      'Dear Customer, thank you for your purchase! We appreciate your business and hope you enjoy your new product.',
    description: 'Default email template for general communication.',
    createdAt: '2023-08-01',
    updatedAt: '2024-08-15',
    emailsSent: 330,
  },
  {
    name: 'Welcome Email',
    id: 'template_xys9876',
    content:
      'Welcome to our service! We are thrilled to have you on board. Please find your account details below.',
    description: 'Template used for welcoming new users.',
    createdAt: '2023-09-10',
    updatedAt: '2024-08-20',
    emailsSent: 1250,
  },
  {
    name: 'Password Reset',
    id: 'template_zab6543',
    content:
      'You have requested to reset your password. Please click the link below to proceed.',
    description: 'Template for password reset emails.',
    createdAt: '2024-01-15',
    updatedAt: '2024-08-18',
    emailsSent: 540,
  },
  {
    name: 'Order Confirmation',
    id: 'template_cde1234',
    content:
      'Thank you for your order! Your order number is #123456. We will notify you once it has been shipped.',
    description: 'Template for order confirmation emails.',
    createdAt: '2024-02-28',
    updatedAt: '2024-08-22',
    emailsSent: 880,
  },
  // Add more templates as needed
]

function AccordionLabel({
  label,
  description,
  isDefault,
}: AccordionLabelProps) {
  return (
    <Flex justify="space-between" align="center">
      <Box>
        <Flex align="center" justify="space-between">
          <Avatar
            src="https://img.icons8.com/clouds/256/000000/email.png"
            radius="xl"
            size="lg"
            mr="xl"
          />
          <div>
            <Text>{label}</Text>
            <Text size="sm" c="dimmed" fw={400}>
              {description}
            </Text>
          </div>
        </Flex>
      </Box>
      {isDefault && (
        <Chip defaultChecked variant="light" mr="md">
          Default
        </Chip>
      )}
    </Flex>
  )
}

export function EmailTemplates() {
  const [templates, setTemplates] = useState(emailTemplates)
  const router = useRouter()

  const items = templates.map((template, idx) => (
    <Accordion.Item value={template.id} key={template.id}>
      <Accordion.Control>
        <AccordionLabel
          label={template.name}
          description={`Template ID: ${template.id}`}
          isDefault={idx === 0}
        />
      </Accordion.Control>
      <Accordion.Panel>
        <Flex align="start" justify="space-between">
          <Box>
            <Text>Description: {template.description}</Text>
            <Text>Created At: {template.createdAt}</Text>
          </Box>
          <Button
            onClick={() => router.push(`/templates/${template.id}`)}
          >
            Manage Template
          </Button>
        </Flex>
      </Accordion.Panel>
    </Accordion.Item>
  ))

  return (
    <div>
      <Flex align="center" justify="space-between" mt="md">
        <Text variant="text" size="xl">
          Email Templates
        </Text>
        <Button onClick={() => router.push('/templates/create')}>
          Add New Template
        </Button>
      </Flex>
      <Accordion chevronPosition="right" variant="contained" mt="md">
        {items}
      </Accordion>
    </div>
  )
}

export default EmailTemplates
