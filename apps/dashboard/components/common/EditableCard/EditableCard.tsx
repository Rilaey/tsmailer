import {
  Grid,
  Card,
  Divider,
  Text,
  Select,
  TextInput,
  Button,
} from '@mantine/core'

export interface EditableCardProps {
  title: string
  description: string
  fields: Array<{
    label: string
    placeholder: string
    field: string
    icon?: React.ReactNode
    disabled?: boolean
    isSelect?: boolean
    options?: Array<{ value: string; label: string }>
  }>
  buttonLabel: string
  onButtonClick: () => void
  isEdited: boolean
  formState: { [key: string]: string }
  handleChange: (
    field: string,
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
}

export const EditableCard: React.FC<EditableCardProps> = ({
  title,
  description,
  fields,
  buttonLabel,
  onButtonClick,
  isEdited,
  formState,
  handleChange,
}) => (
  <Grid.Col span={6}>
    <Card w="100%" shadow="sm">
      <Text mt="md" fw={500} size="lg">
        {title}
      </Text>
      <Text size="sm" c="dimmed">
        {description}
      </Text>
      <Divider my="sm" />
      {fields.map(
        ({ label, placeholder, icon, field, isSelect, options, disabled }) =>
          isSelect ? (
            <Select
              key={label}
              mt="md"
              label={label}
              placeholder={placeholder}
              data={options || []}
              defaultValue={formState[field]}
              onChange={(value) =>
                handleChange(field)({
                  currentTarget: { value: value as string },
                } as React.ChangeEvent<HTMLSelectElement>)
              }
              variant="filled"
            />
          ) : (
            <TextInput
              key={label}
              mt="md"
              label={label}
              placeholder={placeholder}
              rightSection={icon}
              variant="filled"
              defaultValue={formState[field]}
              onChange={handleChange(field)}
              disabled={disabled}
            />
          ),
      )}

      <Button
        mt="xl"
        size="md"
        fullWidth
        onClick={onButtonClick}
        style={{
          visibility: isEdited ? 'visible' : 'hidden',
        }}
      >
        {buttonLabel}
      </Button>
    </Card>
  </Grid.Col>
)
