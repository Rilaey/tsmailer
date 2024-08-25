import {
  Group,
  Avatar,
  Text,
  Accordion,
  Grid,
  TextInput,
  Select,
  Button,
  Stack
} from "@mantine/core";

const emailProvidersList = [
  {
    id: "example@gmail.com",
    image:
      "https://img.icons8.com/?size=100&id=qyRpAggnV0zH&format=png&color=000000",
    label: "Gmail",
    description:
      "Google’s email service with a clean interface and integrated Google apps.",
    content:
      "Gmail is a free email service developed by Google, known for its user-friendly interface and integration with other Google services."
  },
  {
    id: "example@yahoo.com",
    image: "https://img.icons8.com/color/256/yahoo.png",
    label: "Yahoo Mail",
    description: "Yahoo’s email service with robust features and spam filters.",
    content:
      "Yahoo Mail offers 1TB of storage, advanced search, and various security features to protect your emails."
  },
  {
    id: "example@icloud.com",
    image:
      "https://img.icons8.com/?size=100&id=VKsqR5pHg8u5&format=png&color=FFFFFF",
    label: "iCloud",
    description:
      "Apple’s email service with integrated Apple ecosystem features.",
    content:
      "iCloud Mail integrates with Apple devices and services, providing seamless syncing of emails across devices."
  },
  {
    id: "example@outlook.com",
    image: "https://img.icons8.com/color/256/microsoft-outlook-2019.png",
    label: "Outlook",
    description:
      "Microsoft’s email service with integrated calendar and task management.",
    content:
      "Outlook includes an email client, calendar, task manager, and address book, integrating well with other Microsoft Office applications."
  },
  {
    id: "example@aol.com",
    image:
      "https://img.icons8.com/?size=100&id=BT3PNvFusxnD&format=png&color=000000",
    label: "Aol",
    description:
      "Aol’s email service with a long history and robust spam filters.",
    content:
      "Aol Mail offers unlimited storage, advanced spam filters, and a user-friendly interface, known for its reliability and security features."
  }
];

interface AccordionLabelProps {
  label: string;
  image: string;
  description: string;
}

function AccordionLabel({ label, image, description }: AccordionLabelProps) {
  return (
    <Group wrap="nowrap">
      <Avatar src={image} radius="xl" size="lg" />
      <div>
        <Text>{label}</Text>
        <Text size="sm" color="dimmed" fw={400}>
          {description}
        </Text>
      </div>
    </Group>
  );
}

interface ProviderFormProps {
  id: string;
  email: string;
  serviceName: string;
  serviceId: string;
  serviceType: string;
}

function ProviderForm({
  id,
  email,
  serviceName,
  serviceId,
  serviceType
}: ProviderFormProps) {
  return (
    <Stack p="md">
      <Text size="lg" fw={500}>
        Edit Service
      </Text>
      <Grid>
        <Grid.Col span={6}>
          <TextInput label="Email" defaultValue={id} variant="filled" />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Service Name"
            defaultValue={serviceName}
            variant="filled"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Service ID"
            defaultValue={serviceId}
            variant="filled"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            label="Service Type"
            defaultValue={serviceType}
            variant="filled"
            data={["Personal", "Business"]}
          />
        </Grid.Col>
      </Grid>
      <Text size="sm">
        {`Allow "Send email on your behalf" permission during connection. Both
        Gmail and Google Apps accounts are supported.`}
      </Text>
      <Button>Save</Button>
      <Button variant="outline">Send test email to verify configuration</Button>
      <Button variant="outline" color="red">
        Remove Provider
      </Button>
    </Stack>
  );
}

export default function ProviderList() {
  const items = emailProvidersList.map((item) => (
    <Accordion.Item value={item.id} key={item.id}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>
        <ProviderForm
          id={item.id}
          email={`${item.label}_API`}
          serviceName={item.label}
          serviceId="service_ongz1s4"
          serviceType="Personal"
        />
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Accordion chevronPosition="right" variant="contained" mt="xl">
      {items}
    </Accordion>
  );
}
