import {
  Box,
  Grid,
  Flex,
  Card,
  Text,
  Button,
  Progress,
  Radio,
  RadioGroup,
  ActionIcon,
  CopyButton,
  rem,
  Tooltip,
  Divider,
} from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'

const PlanCard = ({
  plan,
  onCancel,
}: {
  plan: string
  onCancel?: () => void
}) => (
  <Card w="100%" mb="md" h="100%">
    <Flex
      h="100%"
      w="100%"
      direction="column"
      align="flex-start"
      justify="space-between"
    >
      <Box w="100%">
        <Text my="md" size="xl" fw={700}>
          Current Plan
        </Text>
        <Divider my="sm" />
        <Text>Plan: {plan}</Text>
        <Text>Status: Active</Text>
        <Text>Next Billing Date: August 31, 2024</Text>
      </Box>
      {onCancel && (
        <Button
          fullWidth
          size="md"
          variant="outline"
          color="red"
          onClick={onCancel}
        >
          Cancel Subscription
        </Button>
      )}
    </Flex>
  </Card>
)

const ApiUsageCard = ({ used, limit }: { used: number; limit: number }) => {
  const remainingRequests = limit - used
  const usagePercentage = (used / limit) * 100

  return (
    <Card w="100%" mb="md" h="100%">
      <Flex
        direction="column"
        align="flex-start"
        justify="space-between"
        h="100%"
      >
        <Box w="100%">
          <Text my="md" size="xl" fw={700}>
            API Usage
          </Text>
          <Divider my="sm" />
          <Text>Requests Used: {used}</Text>
          <Text>Requests Remaining: {remainingRequests}</Text>
        </Box>
        <Box mih={10} w="100%">
          <Progress
            value={usagePercentage}
            color={
              usagePercentage >= 70 && usagePercentage <= 80
                ? 'yellow'
                : usagePercentage > 80
                ? 'red'
                : 'violet'
            }
          />
        </Box>
        {remainingRequests <= 0 && (
          <Text c="red" mt="sm">
            You have reached your API request limit for this month. Please
            upgrade your plan to continue using the service.
          </Text>
        )}
      </Flex>
    </Card>
  )
}

const ManageSubscriptionCard = ({
  selectedPlan,
  onPlanChange,
}: {
  selectedPlan: string
  onPlanChange: (value: string) => void
}) => (
  <Card w="100%" mb="md" h="100%">
    <Flex
      direction="column"
      align="flex-start"
      justify="space-between"
      h="100%"
      w="100%"
    >
      <Box w="100%">
        <Text my="md" size="xl" fw={700}>
          Manage Your Subscription
        </Text>
        <Divider my="sm" />
        <RadioGroup
          value={selectedPlan}
          onChange={onPlanChange}
          label="Select your plan:"
          description="Choose the plan that best suits your needs."
        >
          <Radio my="md" value="Free" label="Free Plan - $0/month" />
          <Radio mt="md" value="Standard" label="Standard Plan - $9.99/month" />
          <Radio mt="md" value="Pro" label="Pro Plan - $19.99/month" />
        </RadioGroup>
      </Box>
      <Button
        size="md"
        fullWidth
        mt="md"
        onClick={() => alert(`Subscribed to ${selectedPlan} plan`)}
      >
        Save Changes
      </Button>
    </Flex>
  </Card>
)

const ApiKeyCard = ({
  apiKey,
  onGenerateNewKey,
}: {
  apiKey: string
  onGenerateNewKey: () => void
}) => (
  <Card w="100%" mb="md" h="100%">
    <Flex direction="column" justify="space-between" h="100%" w="100%">
      <Box>
        <Text my="md" size="xl" fw={700}>
          API Key Management
        </Text>
        <Divider my="sm" />
        <Flex align="center" justify="space-between">
          <Text>Current API Key: {apiKey}</Text>
          <CopyButton value={apiKey} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? 'Copied' : 'Copy'}
                withArrow
                position="right"
              >
                <ActionIcon
                  color={copied ? 'violet' : 'gray'}
                  variant="subtle"
                  onClick={copy}
                >
                  {copied ? (
                    <IconCheck style={{ width: rem(16) }} />
                  ) : (
                    <IconCopy style={{ width: rem(16) }} />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Flex>
      </Box>
      <Box>
        <Button fullWidth onClick={onGenerateNewKey}>
          Generate New API Key
        </Button>
      </Box>
    </Flex>
  </Card>
)

export default function Subscriptions() {
  const [selectedPlan, setSelectedPlan] = useState('Free')
  const [apiUsage, setApiUsage] = useState({ limit: 500, used: 300 })
  const [apiKey, setApiKey] = useState('your-current-api-key') // Example API key

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value)
    // Add logic to handle plan change
  }

  const handleGenerateNewKey = () => {
    // Add logic to generate a new API key
    const newApiKey = 'new-generated-api-key'
    setApiKey(newApiKey)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setApiUsage((prev) => {
        if (prev.used < prev.limit) {
          return { ...prev, used: prev.used + 1 }
        } else {
          clearInterval(interval)
          return prev
        }
      })
    }, 100)

    return () => clearInterval(interval)
  }, [apiUsage.limit])

  return (
    <Box mt="md">
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <PlanCard
            plan={selectedPlan}
            onCancel={
              selectedPlan !== 'Free'
                ? () => alert('Cancel Subscription')
                : undefined
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <ApiKeyCard apiKey={apiKey} onGenerateNewKey={handleGenerateNewKey} />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <ManageSubscriptionCard
            selectedPlan={selectedPlan}
            onPlanChange={handlePlanChange}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
          <ApiUsageCard used={apiUsage.used} limit={apiUsage.limit} />
        </Grid.Col>
      </Grid>
      <Flex direction="column" gap="md" mt="md">
        <Card w="100%" mb="md">
          <Text my="md" size="xl" fw={700}>
            Need Help?
          </Text>
          <Divider my="sm" />
          <Text>
            If you have any issues with your subscription, contact our support
            team.
          </Text>
          <Button maw={200} mt="md" size="md" variant="outline">
            Contact Support
          </Button>
        </Card>
      </Flex>
    </Box>
  )
}
