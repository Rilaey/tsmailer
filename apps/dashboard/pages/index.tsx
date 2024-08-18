import type { NextPage } from "next";
import { Button, Text } from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { useGetUserById } from "../hooks/useGetUserById";
import { useContext, useEffect } from "react";
import { UserContext } from "context/userContext";

const Home: NextPage = () => {
  const { data } = useSession();

  const userContext = useContext(UserContext);

  const { getUserById } = useGetUserById();
  useEffect(() => {
    getUserById();
  }, [data, userContext?.user]);
  return (
    <>
      {data && userContext.user ? (
        <>
          <Text>Hey, {userContext?.user?.email}</Text>
          <Button
            color="#9c6fe4"
            variant="filled"
            m={5}
            onClick={() => signOut()}
          >
            logout
          </Button>
        </>
      ) : (
        <Button
          color="#9c6fe4"
          variant="filled"
          m={5}
          component="a"
          href="/login"
        >
          Login
        </Button>
      )}
    </>
  );
};

export default Home;
