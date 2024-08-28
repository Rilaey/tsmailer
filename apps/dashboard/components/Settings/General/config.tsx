import { IconAt, IconPhone, IconLocation } from '@tabler/icons-react'

export const cardConfigs = [
  {
    title: 'Name and Email',
    description: 'Please update your name and email below.',
    fields: [
      { label: 'Name', placeholder: 'Your name', field: 'name' },
      {
        label: 'Email',
        placeholder: 'Your email',
        field: 'email',
        icon: <IconAt size={18} />,
        disabled: true,
      },
    ],
    buttonLabel: 'Save',
    onButtonClick: () => console.log('Save Name and Email'),
    isEditedKey: 'nameEmail' as const,
  },
  {
    title: 'Phone and Address',
    description: 'Please update your phone and address below.',
    fields: [
      {
        label: 'Phone',
        placeholder: 'Your phone number',
        field: 'phone',
        icon: <IconPhone size={18} />,
      },
      {
        label: 'Address',
        placeholder: 'Your address',
        field: 'address',
        icon: <IconLocation size={18} />,
      },
    ],
    buttonLabel: 'Save',
    onButtonClick: () => console.log('Save Phone and Address'),
    isEditedKey: 'phoneAddress' as const,
  },
  {
    title: 'Username and Account Type',
    description: 'Manage your username and account type.',
    fields: [
      {
        label: 'Username',
        placeholder: 'Your username',
        field: 'username',
      },
      {
        label: 'Account Type',
        placeholder: 'Your account type',
        field: 'accountType',
        disabled: true,
      },
    ],
    buttonLabel: 'Update Info',
    onButtonClick: () => console.log('Update Username and Account Type'),
    isEditedKey: 'usernameAccount' as const,
  },
  {
    title: 'Membership and Language',
    description: 'Manage your membership and preferred language.',
    fields: [
      {
        label: 'Membership Since',
        placeholder: 'Membership start date',
        field: 'membershipSince',
        disabled: true,
      },
      {
        label: 'Language',
        placeholder: 'Select your preferred language',
        field: 'language',
        isSelect: true,
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
        ],
      },
    ],
    buttonLabel: 'Update Info',
    onButtonClick: () => console.log('Update Membership and Language'),
    isEditedKey: 'membershipLanguage' as const,
  },
]
