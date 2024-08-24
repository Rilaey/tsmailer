import React, { useEffect, useState } from 'react'
import {
  Modal,
  Stepper,
  Button,
  Text,
  Stack,
  TextInput,
  Checkbox,
  Blockquote,
  Group,
} from '@mantine/core'
import styles from './AddEmailProviderModal.module.css'
import { useDisclosure } from '@mantine/hooks'
import { IconInfoCircle } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const AddEmailProviderModal = ({}) => {
  const [active, setActive] = useState(0)
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)

  const { data: session } = useSession()

  const router = useRouter()

  // router . push ?
  const handleConnect = () => {
    if (session) {
      if (selectedProvider == 'Gmail') {
        router.push('/api/google/connect')
      } else if (selectedProvider == 'Yahoo') {
        router.push('/api/yahoo/connect')
      }
    }
  }

  const [opened, { open, close }] = useDisclosure(false)

  const handleModalClose = () => {
    // close modal
    close()

    // clear provider if selected
    setSelectedProvider((prev) => (prev = null))

    // so user doesn't see step reset
    setTimeout(() => {
      setActive(0)
    }, 300)
  }
  return (
    <>
      <Button onClick={open}>Add New Service</Button>

      <Modal
        opened={opened}
        onClose={() => handleModalClose()}
        title={active == 0 ? 'Select Email Service' : 'Configure Email Service'}
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        classNames={{
          title: styles.title,
        }}
      >
        <Stepper
          active={active}
          onStepClick={setActive}
          classNames={{ steps: styles.steps, content: styles.content }}
        >
          <Stepper.Step description="Select Email Service">
            <Stack>
              <Button
                c="#fefefe"
                onClick={() => {
                  setSelectedProvider('Gmail')
                  setActive(1)
                }}
              >
                Gmail
              </Button>
              <Button
                c="#fefefe"
                onClick={() => {
                  setSelectedProvider('Yahoo')
                  setActive(1)
                }}
              >
                Yahoo
              </Button>
            </Stack>
          </Stepper.Step>

          <Stepper.Step description="Configure Email Service">
            <Text c="#fefefe" fw={500} pb={5}>
              Selected Service: {selectedProvider}
            </Text>
            <Stack>
              <TextInput
                name="nickName"
                label="Nick Name"
                defaultValue={selectedProvider as string}
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
                color="#9c6fe4"
                iconColor="#fefefe"
                size="md"
                label="Send test email to verify configuration"
                m={5}
              />
            </Stack>
            <Group justify="right" className={styles.buttonGroup}>
              <Button
                color="#9c6fe4"
                c="#fefefe"
                ta="start"
                m={5}
                onClick={handleConnect}
                fullWidth
              >
                Connect Account
              </Button>
            </Group>
          </Stepper.Step>
        </Stepper>
      </Modal>
    </>
  )
}

export default AddEmailProviderModal
