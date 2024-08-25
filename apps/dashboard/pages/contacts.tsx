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
import { useState } from 'react'

const exampleContacts = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    lastSent: '2024-08-15',
    status: 'Subscribed',
    tags: ['customer', 'newsletter'],
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    lastSent: '2024-08-10',
    status: 'Unsubscribed',
    tags: ['lead', 'promotion'],
  },
  {
    id: 6,
    name: 'Anna Taylor',
    email: 'anna.taylor@example.com',
    lastSent: '2024-08-14',
    status: 'Subscribed',
    tags: ['customer', 'vip'],
  },
  {
    id: 7,
    name: 'Paul Walker',
    email: 'paul.walker@example.com',
    lastSent: '2024-08-19',
    status: 'Unsubscribed',
    tags: ['lead', 'inactive'],
  },
  {
    id: 8,
    name: 'Lucy Adams',
    email: 'lucy.adams@example.com',
    lastSent: '2024-08-17',
    status: 'Subscribed',
    tags: ['customer', 'newsletter'],
  },
  {
    id: 9,
    name: 'Mark Robinson',
    email: 'mark.robinson@example.com',
    lastSent: '2024-08-13',
    status: 'Bounced',
    tags: ['customer', 'inactive'],
  },
  {
    id: 10,
    name: 'Susan White',
    email: 'susan.white@example.com',
    lastSent: '2024-08-21',
    status: 'Subscribed',
    tags: ['customer', 'vip'],
  },
  {
    id: 11,
    name: 'Chris Brown',
    email: 'chris.brown@example.com',
    lastSent: '2024-08-12',
    status: 'Subscribed',
    tags: ['customer', 'newsletter'],
  },
  {
    id: 12,
    name: 'Nina Black',
    email: 'nina.black@example.com',
    lastSent: '2024-08-16',
    status: 'Unsubscribed',
    tags: ['lead', 'promotion'],
  },
  {
    id: 13,
    name: 'Tom Harris',
    email: 'tom.harris@example.com',
    lastSent: '2024-08-11',
    status: 'Subscribed',
    tags: ['customer', 'vip'],
  },
  {
    id: 14,
    name: 'Emily Green',
    email: 'emily.green@example.com',
    lastSent: '2024-08-09',
    status: 'Bounced',
    tags: ['customer', 'inactive'],
  },
  {
    id: 15,
    name: 'Ryan Clark',
    email: 'ryan.clark@example.com',
    lastSent: '2024-08-18',
    status: 'Subscribed',
    tags: ['customer', 'newsletter'],
  },
  {
    id: 16,
    name: 'Sophie Davis',
    email: 'sophie.davis@example.com',
    lastSent: '2024-08-20',
    status: 'Unsubscribed',
    tags: ['lead', 'inactive'],
  },
  {
    id: 17,
    name: 'Jake Turner',
    email: 'jake.turner@example.com',
    lastSent: '2024-08-14',
    status: 'Subscribed',
    tags: ['customer', 'vip'],
  },
  {
    id: 18,
    name: 'Laura King',
    email: 'laura.king@example.com',
    lastSent: '2024-08-13',
    status: 'Bounced',
    tags: ['customer', 'inactive'],
  },
]

export const Contacts: NextPage = () => {
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [activePage, setPage] = useState(1)

  const contactsPerPage = 10

  // Filter contacts by search query, status, and tag
  const filteredContacts = exampleContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      !statusFilter ||
      contact.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesTag = !tagFilter || contact.tags.includes(tagFilter)

    return matchesSearch && matchesStatus && matchesTag
  })

  // Sort contacts based on selected sort option
  const sortedContacts = filteredContacts.sort((a, b) => {
    if (!sortBy) return 0
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'email') return a.email.localeCompare(b.email)
    if (sortBy === 'lastSent')
      return new Date(a.lastSent).getTime() - new Date(b.lastSent).getTime()
    return 0
  })

  // Paginate contacts
  const paginatedContacts = sortedContacts.slice(
    (activePage - 1) * contactsPerPage,
    activePage * contactsPerPage,
  )

  const rows = paginatedContacts.map((contact) => (
    <Table.Tr
      key={contact.id}
      bg={
        selectedContacts.includes(contact.id)
          ? 'var(--mantine-color-violet-light)'
          : undefined
      }
    >
      <Table.Td>
        <Checkbox
          aria-label="Select contact"
          checked={selectedContacts.includes(contact.id)}
          onChange={(event) =>
            setSelectedContacts(
              event.currentTarget.checked
                ? [...selectedContacts, contact.id]
                : selectedContacts.filter((id) => id !== contact.id),
            )
          }
        />
      </Table.Td>
      <Table.Td>{contact.name}</Table.Td>
      <Table.Td>{contact.email}</Table.Td>
      <Table.Td>{contact.lastSent}</Table.Td>
      <Table.Td>{contact.status}</Table.Td>
      <Table.Td>{contact.tags.join(', ')}</Table.Td>
    </Table.Tr>
  ))

  return (
    <Page>
      <Flex align="center" justify="space-between" mb="md">
        <Text variant="text" size="xl">
          Contacts
        </Text>
        <Button>Create Contact</Button>
      </Flex>
      <Grid>
        <Grid.Col span={{ base: 4, lg: 3, md: 3, sm: 12 }}>
          <TextInput
            label="Search"
            mb="md"
            placeholder="Search contact"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3, md: 3, sm: 12 }}>
          <Select
            label="Sort By"
            mb="md"
            placeholder="Select sorting option"
            data={[
              { value: 'name', label: 'Name' },
              { value: 'email', label: 'Email' },
              { value: 'lastSent', label: 'Last Sent' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3, md: 3, sm: 12 }}>
          <Select
            label="Filter by Status"
            mb="md"
            placeholder="Select status"
            data={[
              { value: 'Subscribed', label: 'Subscribed' },
              { value: 'Unsubscribed', label: 'Unsubscribed' },
              { value: 'Bounced', label: 'Bounced' },
            ]}
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 4, lg: 3, md: 3, sm: 12 }}>
          <Select
            label="Filter by Tag"
            mb="md"
            placeholder="Select tag"
            data={[
              { value: 'customer', label: 'Customer' },
              { value: 'newsletter', label: 'Newsletter' },
              { value: 'vip', label: 'VIP' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'promotion', label: 'Promotion' },
            ]}
            value={tagFilter}
            onChange={(value) => setTagFilter(value)}
          />
        </Grid.Col>
      </Grid>
      <Box mih={250}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th />
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Last Sent</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Tags</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        {exampleContacts.length === 0 && (
          <Text ta="center">No contacts created yet</Text>
        )}
        {filteredContacts.length === 0 && (
          <Text my="md" ta="center">
            No contacts found
          </Text>
        )}
      </Box>
      <Center>
        <Pagination
          total={Math.ceil(filteredContacts.length / contactsPerPage)}
          value={activePage}
          onChange={setPage}
          mt="sm"
        />
      </Center>
    </Page>
  )
}

export default withAuth(Contacts)
