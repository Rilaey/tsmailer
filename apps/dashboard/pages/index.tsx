import type { NextPage } from "next";
import { Button } from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { useGetUserById } from "../hooks/useGetUserById";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data } = useSession();

  const { getUserById } = useGetUserById();

  // const userContext = useContext(UserContext);

  useEffect(() => {
    getUserById();
  }, [data]);
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
