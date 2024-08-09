import type { NextPage } from "next";
import { Button } from "@mantine/core";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const Home: NextPage = () => {
  const { data } = useSession();

  useEffect(() => {
    console.log(data);
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
