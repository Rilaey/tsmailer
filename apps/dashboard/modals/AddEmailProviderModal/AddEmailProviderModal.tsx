import React, { useEffect, useState } from "react";
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
  Card
} from "@mantine/core";
import styles from "./AddEmailProviderModal.module.css";
import { IconInfoCircle } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useHandleConnectProvider } from "hooks/useHandleConnectProvider";

const providerIcons: Record<
  "gmail" | "yahoo" | "iCloud" | "outlook" | "aol" | "zoho",
  string
> = {
  gmail:
    "https://img.icons8.com/?size=100&id=qyRpAggnV0zH&format=png&color=000000",
  yahoo: "https://img.icons8.com/color/256/yahoo.png",
  iCloud:
    "https://img.icons8.com/?size=100&id=VKsqR5pHg8u5&format=png&color=FFFFFF",
  outlook: "https://img.icons8.com/color/256/microsoft-outlook-2019.png",
  aol: "https://img.icons8.com/?size=100&id=BT3PNvFusxnD&format=png&color=000000",
  zoho: "https://cxotoday.com/wp-content/uploads/2023/05/Zoho-New-Logo.png"
};

const providerImages = {
  google: providerIcons.gmail,
  yahoo: providerIcons.yahoo,
  iCloud: providerIcons.iCloud,
  outlook: providerIcons.outlook,
  aol: providerIcons.aol,
  zoho: providerIcons.zoho
};

const AddEmailProviderModal = ({
  opened,
  toggle
}: {
  opened: boolean;
  toggle: () => void;
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  const { data: session } = useSession();

  const { handleConnectProvider } = useHandleConnectProvider();

  const handleModalClose = () => {
    toggle();
    setSelectedProvider(null);
  };

  useEffect(() => {
    const handleConnect = async () => {
      if (session) {
        handleConnectProvider(selectedProvider?.toLowerCase() as string);
      }
    };

    if (selectedProvider) {
      handleConnect();
    }
  }, [selectedProvider]);
  return (
    <Flex justify="flex-end" align="center">
      <Modal
        opened={opened}
        onClose={handleModalClose}
        title={"Configure Email Service"}
        centered
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        classNames={{ title: styles.title }}
      >
        <Text mb="md">
          Connect your email provider to TSMailer to easily manage and send
          emails directly from your account.
        </Text>
        <Grid>
          {Object.keys(providerImages).map((provider) => (
            <Grid.Col key={provider} span={3}>
              <Button
                p={0}
                m={0}
                variant="transparent"
                mih={120}
                onClick={() => {
                  setSelectedProvider(provider);
                }}
              >
                <Card miw={100}>
                  <Image
                    src={
                      providerImages[provider as keyof typeof providerImages]
                    }
                    alt={provider}
                    width={35}
                    height={35}
                    style={{ cursor: "pointer", marginBottom: 10 }}
                  />
                  <Text ta="center">
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </Text>
                </Card>
              </Button>
            </Grid.Col>
          ))}
        </Grid>
        <Flex align="center" justify="flex-end">
          <Button variant="default" onClick={handleModalClose}>
            Cancel
          </Button>
        </Flex>
      </Modal>
    </Flex>
  );
};

export default AddEmailProviderModal;
