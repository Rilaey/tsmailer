import React, { useState } from 'react'
import {
  Modal,
  Grid,
  Stepper,
  Button,
  Text,
  Stack,
  TextInput,
  Checkbox,
  Blockquote,
  Group,
  Flex,
  Image,
  Card,
} from '@mantine/core'
import styles from './AddEmailProviderModal.module.css'
import { IconInfoCircle } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useHandleConnectProvider } from 'hooks/useHandleConnectProvider'

const providerIcons: Record<
  'gmail' | 'yahoo' | 'iCloud' | 'outlook' | 'aol' | 'zoho',
  string
> = {
  gmail:
    'https://img.icons8.com/?size=100&id=qyRpAggnV0zH&format=png&color=000000',
  yahoo: 'https://img.icons8.com/color/256/yahoo.png',
  iCloud:
    'https://img.icons8.com/?size=100&id=VKsqR5pHg8u5&format=png&color=FFFFFF',
  outlook: 'https://img.icons8.com/color/256/microsoft-outlook-2019.png',
  aol:
    'https://img.icons8.com/?size=100&id=BT3PNvFusxnD&format=png&color=000000',
  zoho:
    'https://cxotoday.com/wp-content/uploads/2023/05/Zoho-New-Logo.png',
}

const providerImages = {
  gmail: providerIcons.gmail,
  yahoo: providerIcons.yahoo,
  iCloud: providerIcons.iCloud,
  outlook: providerIcons.outlook,
  aol: providerIcons.aol,
  zoho: providerIcons.zoho,
}

const AddEmailProviderModal = ({
  opened,
  toggle,
}: {
  opened: boolean
  toggle: () => void
}) => {
  const [active, setActive] = useState(0)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const { data: session } = useSession()
  const router = useRouter()

  const { handleConnectProvider } = useHandleConnectProvider()

  const handleConnect = () => {
    if (session) {
      handleConnectProvider(selectedProvider?.toLowerCase() as string)
    }
  }

  const handleModalClose = () => {
    toggle()
    setSelectedProvider(null)
    setTimeout(() => {
      setActive(0)
    }, 300)
  }

  return (
    <Flex justify="flex-end" align="center">
      <Modal
        opened={opened}
        onClose={handleModalClose}
        title={
          active === 0 ? 'Select an email provider' : 'Configure Email Service'
        }
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        classNames={{ title: styles.title }}
      >
        <Text mb="md">
          Connect your email provider to TSMailer to easily manage and send
          emails directly from your account.
        </Text>
        <Stepper
          active={active}
          onStepClick={setActive}
          classNames={{ steps: styles.steps, content: styles.content }}
        >
          <Stepper.Step description="Select an email provider">
            <Grid>
              {Object.keys(providerImages).map((provider) => (
                <Grid.Col key={provider} span={3}>
                  <Button
                    p={0}
                    m={0}
                    variant="transparent"
                    mih={120}
                    onClick={() => {
                      setSelectedProvider(provider)
                      setActive(1)
                    }}
                  >
                    <Card miw={100}>
                      <Image
                        src={
                          providerImages[
                            provider as keyof typeof providerImages
                          ]
                        }
                        alt={provider}
                        width={35}
                        height={35}
                        style={{ cursor: 'pointer', marginBottom: 10 }}
                      />
                      <Text ta="center">
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                      </Text>
                    </Card>
                  </Button>
                </Grid.Col>
              ))}
            </Grid>
          </Stepper.Step>

          <Stepper.Step description="Configure Email Service">
            <Text c="#fefefe" fw={500} pb={5} tt="capitalize">
              Selected Service: {selectedProvider}
            </Text>
            <Stack p="md">
              <TextInput
                name="nickName"
                label="Nick Name"
                defaultValue={selectedProvider || ''}
                tt="capitalize"
                pb={5}
                pt={5}
                m={5}
              />
              <Blockquote
                color="#9c6fe4"
                c="#fefefe"
                radius="md"
                iconSize={32}
                icon={<IconInfoCircle />}
                m={5}
              >
                Allow "Send email on your behalf" permission during connection.
                Both Gmail and Google Apps accounts are supported.
              </Blockquote>
              <Checkbox
                defaultChecked
                iconColor="#fefefe"
                size="md"
                label="Send test email to verify configuration"
                m={5}
              />
            </Stack>
            <Group justify="right" className={styles.buttonGroup}>
              <Button
                ta="start"
                tt="capitalize"
                onClick={handleConnect}
                fullWidth
              >
                Connect {selectedProvider}
              </Button>
              <Button
                variant="subtle"
                ta="start"
                onClick={() => setActive(0)}
                fullWidth
              >
                Go back
              </Button>
            </Group>
          </Stepper.Step>
        </Stepper>
        <Flex align="center" justify="flex-end">
          <Button variant="default" onClick={handleModalClose}>
            Cancel
          </Button>
        </Flex>
      </Modal>
    </Flex>
  )
}

export default AddEmailProviderModal
