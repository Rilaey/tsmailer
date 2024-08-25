import {
  Table,
  Text,
  Paper,
  Checkbox,
  Flex,
  Grid,
  TextInput,
  Select,
  Button,
  Box,
  Center,
  Pagination,
} from '@mantine/core'
import Page from 'components/common/Page/Page'
import { withAuth } from 'hocs/withAuth'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

const exampleEmailHistory = [
  {
    id: 1,
    recipientEmail: 'john.doe@example.com',
    subject: 'Welcome!',
    providerId: 'provider1',
    templateId: 'template1',
    sentDate: '2024-08-15',
    status: 'Sent',
  },
  {
    id: 2,
    recipientEmail: 'jane.smith@example.com',
    subject: 'Thank You!',
    providerId: 'provider2',
    templateId: 'template2',
    sentDate: '2024-08-10',
    status: 'Failed',
  },
  {
    id: 3,
    recipientEmail: 'michael.johnson@example.com',
    subject: 'Special Offer',
    providerId: 'provider1',
    templateId: 'template3',
    sentDate: '2024-08-08',
    status: 'Sent',
  },
  {
    id: 4,
    recipientEmail: 'emily.davis@example.com',
    subject: 'Monthly Newsletter',
    providerId: 'provider3',
    templateId: 'template1',
    sentDate: '2024-08-05',
    status: 'Sent',
  },
  {
    id: 5,
    recipientEmail: 'chris.lee@example.com',
    subject: 'Survey Invitation',
    providerId: 'provider2',
    templateId: 'template4',
    sentDate: '2024-08-02',
    status: 'Failed',
  },
  {
    id: 6,
    recipientEmail: 'susan.martin@example.com',
    subject: 'Account Update',
    providerId: 'provider3',
    templateId: 'template2',
    sentDate: '2024-07-30',
    status: 'Sent',
  },
  {
    id: 7,
    recipientEmail: 'david.wilson@example.com',
    subject: 'Event Reminder',
    providerId: 'provider1',
    templateId: 'template5',
    sentDate: '2024-07-28',
    status: 'Sent',
  },
  {
    id: 8,
    recipientEmail: 'laura.moore@example.com',
    subject: 'New Feature Announcement',
    providerId: 'provider2',
    templateId: 'template3',
    sentDate: '2024-07-25',
    status: 'Sent',
  },
  {
    id: 9,
    recipientEmail: 'alex.brown@example.com',
    subject: 'Follow-Up',
    providerId: 'provider1',
    templateId: 'template6',
    sentDate: '2024-07-20',
    status: 'Failed',
  },
  {
    id: 10,
    recipientEmail: 'jessica.white@example.com',
    subject: 'Confirmation',
    providerId: 'provider3',
    templateId: 'template7',
    sentDate: '2024-07-18',
    status: 'Sent',
  },
  {
    id: 11,
    recipientEmail: 'ryan.harris@example.com',
    subject: 'Password Reset',
    providerId: 'provider2',
    templateId: 'template8',
    sentDate: '2024-07-15',
    status: 'Sent',
  },
  {
    id: 12,
    recipientEmail: 'sophie.lee@example.com',
    subject: 'Thank You for Your Purchase',
    providerId: 'provider1',
    templateId: 'template9',
    sentDate: '2024-07-10',
    status: 'Failed',
  },
]

export const EmailHistory: NextPage = () => {
  const [selectedEmails, setSelectedEmails] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [providerFilter, setProviderFilter] = useState<string | null>(null)
  const [templateFilter, setTemplateFilter] = useState<string | null>(null)
  const [activePage, setPage] = useState(1)

  const emailsPerPage = 10

  // Filter emails by search query, status, provider, and template
  const filteredEmails = exampleEmailHistory.filter((email) => {
    const matchesSearch =
      email.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      !statusFilter || email.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesProvider =
      !providerFilter || email.providerId === providerFilter

    const matchesTemplate =
      !templateFilter || email.templateId === templateFilter

    return matchesSearch && matchesStatus && matchesProvider && matchesTemplate
  })

  // Sort emails based on selected sort option
  const sortedEmails = filteredEmails.sort((a, b) => {
    if (!sortBy) return 0
    if (sortBy === 'recipientEmail')
      return a.recipientEmail.localeCompare(b.recipientEmail)
    if (sortBy === 'sentDate')
      return new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime()
    if (sortBy === 'subject') return a.subject.localeCompare(b.subject)
    return 0
  })

  // Paginate emails
  const paginatedEmails = sortedEmails.slice(
    (activePage - 1) * emailsPerPage,
    activePage * emailsPerPage,
  )

  const rows = paginatedEmails.map((email) => (
    <Table.Tr
      key={email.id}
      bg={
        selectedEmails.includes(email.id)
          ? 'var(--mantine-color-violet-light)'
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          aria-label="Select email"
          checked={selectedEmails.includes(email.id)}
          onChange={(event) =>
            setSelectedEmails(
              event.currentTarget.checked
                ? [...selectedEmails, email.id]
                : selectedEmails.filter((id) => id !== email.id),
            )
          }
        />
      </Table.Td>
      <Table.Td>{email.recipientEmail}</Table.Td>
      <Table.Td>{email.subject}</Table.Td>
      <Table.Td>{email.sentDate}</Table.Td>
      <Table.Td>{email.status}</Table.Td>
      <Table.Td>{email.providerId}</Table.Td>
      <Table.Td>{email.templateId}</Table.Td>
    </Table.Tr>
  ))

  return (
    <Page>
      <Flex align="center" justify="space-between" mb="md">
        <Text variant="text" size="xl">
          Email History
        </Text>
      </Flex>
      <Grid>
        <Grid.Col span={{ base: 4, lg: 3, md: 3, sm: 12 }}>
          <TextInput
            label="Search"
            mb="md"
            placeholder="Search email history"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3, md: 3, sm: 12 }}>
          <Select
            label="Filter by Status"
            mb="md"
            placeholder="Select status"
            data={[
              { value: 'Sent', label: 'Sent' },
              { value: 'Failed', label: 'Failed' },
              // Add more status options if needed
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3, md: 3, sm: 12 }}>
          <Select
            label="Filter by Provider"
            mb="md"
            placeholder="Select provider"
            data={[
              { value: 'provider1', label: 'Provider 1' },
              { value: 'provider2', label: 'Provider 2' },
              // Add more provider options if needed
            ]}
            value={providerFilter}
            onChange={(value) => setProviderFilter(value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3, md: 3, sm: 12 }}>
          <Select
            label="Filter by Template"
            mb="md"
            placeholder="Select template"
            data={[
              { value: 'template1', label: 'Template 1' },
              { value: 'template2', label: 'Template 2' },
              // Add more template options if needed
            ]}
            value={templateFilter}
            onChange={(value) => setTemplateFilter(value)}
          />
        </Grid.Col>
      </Grid>
      <Box mih={250}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Recipient Email</Table.Th>
              <Table.Th>Subject</Table.Th>
              <Table.Th>Sent Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Provider ID</Table.Th>
              <Table.Th>Template ID</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {exampleEmailHistory.length === 0 && (
          <Text ta="center">No email history found</Text>
        )}
        {filteredEmails.length === 0 && (
          <Text my="md" ta="center">
            No emails match the current filters
          </Text>
        )}
      </Box>
      <Center>
        <Pagination
          total={Math.ceil(filteredEmails.length / emailsPerPage)}
          value={activePage}
          onChange={setPage}
          mt="sm"
        />
      </Center>
    </Page>
  )
}

export default withAuth(EmailHistory)
