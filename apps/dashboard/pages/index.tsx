import type { NextPage } from "next";
import { Text } from "@mantine/core";
import { useContext } from "react";
import { UserContext } from "context/userContext";
import { withTabs } from "hocs/withTabs";
import { withAuth } from "hocs/withAuth";
import AddEmailProviderModal from "modals/AddEmailProviderModal/AddEmailProviderModal";

const Home: NextPage = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <Text>Welcome to the dashboard</Text>
      <AddEmailProviderModal />
    </>
  );
};

export default withTabs(withAuth(Home));
