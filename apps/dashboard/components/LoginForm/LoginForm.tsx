import { Button, Paper, Text, TextInput, Loader, Box } from "@mantine/core";
import styles from "../../styles/loginAndCreateAccount.module.css";
import { useLogin } from "../../hooks/useLogin";
import { signIn } from "next-auth/react";
import signInOptions from "../../public/data/signinOptions.json";
import Image from "next/image";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import { useVerifyUserEmail } from "../../hooks/useVerifyUserEmail";
import { useEffect } from "react";

const LoginForm = () => {
  const router = useRouter();
  let { error: routeError, token } = router.query;

  const { successfulVerification, verifyUserEmail } = useVerifyUserEmail();

  const { error, isLoading, loginFormState, setLoginFormState, login } =
    useLogin();

  // error handling for trying to sign in with an email that already exist for providers
  if (routeError == "OAuthAccountNotLinked") {
    routeError =
      "User already exist with provided email address. Please sign in with the correct provider or credentials.";
  }

  const handleFormChange = (e: { target: { name: any; value: any } }) => {
    setLoginFormState((prev) => {
      if (prev) {
        return {
          ...prev,
          [e.target.name]: e.target.value
        };
      }

      return prev;
    });
  };

  useEffect(() => {
    if (token) {
      const decodedToken = jwt.decode(
        token as string,
        process.env.AUTH_SECRET as any
      );

      if (decodedToken) {
        //@ts-ignore
        //email + jwtid is not of type JWT, but its getting sent as part of the token.
        verifyUserEmail(decodedToken.email, decodedToken.jwtid);
      }
    }
  }, [token]);
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
      component="form"
      onSubmit={login}
    >
      <Text c="#fcfcfc" fw={600} p={5} size="24px">
        Welcome back.
      </Text>
      <br />

      {/* message after create user redirect */}
      {successfulVerification ? (
        <>
          <Text c="green" size="18px" p={5} fw={600}>
            Please sign in with new user credentials.
          </Text>
        </>
      ) : (
        <>
          <Text c="#fcfcfc" fw={600} p={5} size="18px">
            Please enter your account details.
          </Text>
        </>
      )}
      <br />
      {routeError && (
        <Text c="crimson" ta="center" fw={600} size="16px">
          {routeError}
        </Text>
      )}
      <br />
      <TextInput
        type="text"
        label="Email"
        placeholder="Email"
        classNames={{ label: styles.label }}
        p={5}
        name="email"
        value={loginFormState.email}
        onChange={(e) => handleFormChange(e)}
      />
      <TextInput
        type="password"
        label="Password"
        placeholder="Password"
        classNames={{ label: styles.label }}
        p={5}
        name="password"
        value={loginFormState.password}
        onChange={(e) => handleFormChange(e)}
      />
      <Box p={5} m={5} style={{ textAlign: "right" }}>
        {/* TODO: Create forgot password logic */}
        <Text p={5} m={5} component="a" href="/" className={styles.link}>
          Forgot Password?
        </Text>
      </Box>
      {error && (
        <Text
          p={5}
          m={5}
          style={{
            textAlign: "center"
          }}
          c="crimson"
        >
          {error}
        </Text>
      )}
      <Button
        fullWidth
        p={5}
        m={5}
        color="#9c6fe4"
        c="var(--mantine-color-body)"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? <Loader color="#9c6fe4" size="sm" /> : "Sign in"}
      </Button>
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

      <Box p={5} m={5} style={{ textAlign: "right" }}>
        <Text p={5} m={5} component="a" href="/signup" className={styles.link}>
          Create an account.
        </Text>
      </Box>
    </Paper>
  );
};

export default LoginForm;
