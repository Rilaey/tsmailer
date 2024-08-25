import { Box, Grid } from '@mantine/core'
import { EditableCard } from 'components/common/EditableCard/EditableCard'
import { UserContext } from 'context/userContext'
import { FormState } from 'hooks/useFormState'
import React, { useContext, useState } from 'react'
import { cardConfigs } from './config'

export default function General() {
  const { user } = useContext(UserContext)

  const initialFormState = {
    name: user?.data.name || 'John Doe',
    email: user?.data.email || 'johndoe@example.com',
    phone: '+1 (555) 555-5555',
    address: '123 Main St, Springfield',
    username: 'johndoe123',
    accountType: 'Premium',
    membershipSince: 'January 1, 2022',
    language: 'en',
  }

  const [formState, setFormState] = useState(initialFormState)

  // Derive isEdited state directly from formState and user data
  const isEdited = {
    nameEmail:
      formState.name !== (user?.data.name || 'John Doe') ||
      formState.email !== (user?.data.email || 'johndoe@example.com'),
    phoneAddress:
      formState.phone !== '+1 (555) 555-5555' ||
      formState.address !== '123 Main St, Springfield',
    usernameAccount: formState.username !== 'johndoe123',
    membershipLanguage: formState.language !== 'en',
  }

  const handleChange = (field: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: event.currentTarget.value,
    }))
  }

  return (
    <Box mt="md">
      <Grid gutter="lg">
        {cardConfigs.map((config) => (
          <EditableCard
            key={config.title}
            title={config.title}
            description={config.description}
            fields={config.fields}
            buttonLabel={config.buttonLabel}
            onButtonClick={config.onButtonClick}
            isEdited={isEdited[config.isEditedKey] as boolean}
            formState={formState}
            handleChange={handleChange}
          />
        ))}
      </Grid>
    </Box>
  )
}
