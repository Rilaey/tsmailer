import { Button, Paper, Text, TextInput, Loader, Box } from "@mantine/core";
import styles from "../../styles/loginForm.module.css";
import { useLogin } from "../../hooks/useLogin";
import { signIn } from "next-auth/react";
import signInOptions from "../../public/data/signinOptions.json";
import Image from "next/image";

const LoginForm = () => {
  const { error, isLoading, loginFormState, setLoginFormState, login } =
    useLogin();

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
  return (
    <Paper
      w={550}
      h={550}
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
      <Text c="#fcfcfc" fw={600} p={5} size="18px">
        Please enter your account details.
      </Text>
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
        <Text p={5} m={5} component="a" href="/signup" className={styles.link}>
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
        color="#b2f35f"
        c="var(--mantine-color-body)"
        disabled={isLoading}
        type="submit"
      >
        {isLoading ? <Loader color="#b2f35f" size="sm" /> : "Sign in"}
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
