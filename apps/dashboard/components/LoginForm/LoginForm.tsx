import {
  Button,
  Paper,
  Text,
  TextInput,
  Loader,
  Box,
  PasswordInput
} from "@mantine/core";
import styles from "../../styles/loginAndCreateAccount.module.css";
import { signIn } from "next-auth/react";
import signInOptions from "../../public/data/signinOptions.json";
import Image from "next/image";
import { useRouter } from "next/router";

const LoginForm = () => {
  const router = useRouter();
  let { error: routeError, token } = router.query;

  // error handling for trying to sign in with an email that already exist for providers
  if (routeError == "OAuthAccountNotLinked") {
    routeError =
      "User already exist with provided email address. Please sign in with the correct provider or credentials.";
  }
  return (
    <Paper
      w={550}
      style={{
        padding: "3%",
        borderRadius: "25px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <Text c="#fcfcfc" fw={600} p={5} size="24px">
        Welcome back.
      </Text>
      <br />
      <Text c="#fcfcfc" fw={600} p={5} size="18px">
        Please select a provider to login.
      </Text>
      <br />
      {routeError && (
        <Text c="crimson" ta="center" fw={600} size="16px">
          {routeError}
        </Text>
      )}
      <br />
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        {signInOptions.map((option) => {
          return (
            <Image
              src={option.logo}
              alt={option.altText}
              key={option.id}
              height={50}
              width={55}
              onClick={() => signIn(option.service)}
              style={{
                margin: "3%",
                cursor: "pointer"
              }}
            />
          );
        })}
      </Box>
    </Paper>
  );
};

export default LoginForm;
