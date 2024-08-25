import { useState, useEffect } from 'react'

export interface FormState {
  [key: string]: string
}

export type IsEditedState = {
  [key: string]: boolean
}

const useFormState = (initialState: FormState, userData: FormState) => {
  const [formState, setFormState] = useState<FormState>(initialState)
  const [isEdited, setIsEdited] = useState<IsEditedState>({})

  useEffect(() => {
    const updatedIsEdited: IsEditedState = {}
    let hasChanges = false

    for (const key in formState) {
      if (formState[key] !== userData[key]) {
        updatedIsEdited[key] = true
        hasChanges = true
      } else {
        updatedIsEdited[key] = false
      }
    }

    if (hasChanges) {
      setIsEdited(updatedIsEdited)
    }
  }, [formState, userData])

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = event.currentTarget?.value ?? ''
    setFormState(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      // Perform submission here (e.g., API call)
      console.log('Submitting form:', formState)
      // Example: await api.submitForm(formState)
    } catch (error) {
      console.error('Submission error:', error)
    }
  }

  return { formState, isEdited, handleChange, handleSubmit }
}

export default useFormState
