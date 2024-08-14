import { Button, Paper, Text, TextInput, Loader, Box } from "@mantine/core";
import styles from "../../styles/loginAndCreateAccount.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSignUpUser } from "../../hooks/useSignUpUser";

const CreateUserForm = () => {
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);

  const { error, isLoading, signUpFormState, setSignUpFormState, signUpUser } =
    useSignUpUser();

  const handleFormChange = (e: { target: { name: string; value: string } }) => {
    setSignUpFormState((prev) => {
      if (prev) {
        return {
          ...prev,
          [e.target.name]: e.target.value
        };
      }

      return prev;
    });
  };

  const { data } = useSession();

  const router = useRouter();
  let { error: routeError } = router.query;

  useEffect(() => {
    if (signUpFormState.password != signUpFormState.confirmedPassword) {
      setIsPasswordMatch((prev) => {
        return (prev = false);
      });
    } else {
      setIsPasswordMatch((prev) => {
        return (prev = true);
      });
    }
  }, [signUpFormState.password, signUpFormState.confirmedPassword]);
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
      onSubmit={signUpUser}
    >
      <Text c="#fcfcfc" fw={600} p={5} size="24px">
        Welcome to TSMailer.
      </Text>
      <br />
      <Text c="#fcfcfc" fw={600} p={5} size="18px">
        Please enter your new account details.
      </Text>
      <br />
      {routeError && (
        <Text c="crimson" ta="center" fw={600} size="16px">
          {routeError}
        </Text>
      )}
      <TextInput
        withAsterisk
        type="text"
        label="Name"
        placeholder="Name"
        classNames={{ label: styles.label }}
        p={5}
        name="name"
        value={signUpFormState.name}
        onChange={(e) => handleFormChange(e)}
      />
      <TextInput
        withAsterisk
        type="text"
        label="Email"
        placeholder="Email"
        classNames={{ label: styles.label }}
        p={5}
        name="email"
        value={signUpFormState.email}
        onChange={(e) => handleFormChange(e)}
      />
      <TextInput
        withAsterisk
        type="password"
        label="Password"
        placeholder="Password"
        classNames={{ label: styles.label }}
        p={5}
        name="password"
        value={signUpFormState.password}
        onChange={(e) => handleFormChange(e)}
      />
      <TextInput
        withAsterisk
        type="password"
        label="Confirm Password"
        placeholder="Confirm Password"
        classNames={{ label: styles.label }}
        p={5}
        name="confirmedPassword"
        value={signUpFormState.confirmedPassword}
        onChange={(e) => handleFormChange(e)}
      />
      <br />
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
      {!isPasswordMatch && (
        <Text
          p={5}
          m={5}
          style={{
            textAlign: "center"
          }}
          c="crimson"
          fw={500}
        >
          Passwords do not match.
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

      <Box p={5} m={5} style={{ textAlign: "right" }}>
        <Text p={5} m={5} component="a" href="/login" className={styles.link}>
          Already have an account? Login here.
        </Text>
      </Box>
    </Paper>
  );
};

export default CreateUserForm;
