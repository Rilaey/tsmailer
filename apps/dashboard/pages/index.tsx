import type { NextPage } from "next";
import { Button } from "@mantine/core";

const Home: NextPage = () => {
  return (
    <Button color="purple" variant="filled" m={5} component="a" href="/login">
      Login
    </Button>
  );
};

export default Home;
