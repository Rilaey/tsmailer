import type { NextPage } from "next";
import { Button } from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { useGetUserById } from "../hooks/useGetUserById";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";

const Home: NextPage = () => {
  const { data } = useSession();

  const { getUserById } = useGetUserById();

  const userContext = useContext(UserContext);

  useEffect(() => {
    getUserById();
    console.log(userContext);
  }, [data, userContext]);
  return (
    <>
      {data ? (
        <Button color="purple" variant="filled" m={5} onClick={() => signOut()}>
          logout
        </Button>
      ) : (
        <Button
          color="purple"
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
