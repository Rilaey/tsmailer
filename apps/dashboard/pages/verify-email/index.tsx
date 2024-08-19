import { Button, Container, Loader, Paper, Text } from "@mantine/core";
import { NextPage } from "next";
import React from "react";
import { useRouter } from "next/router";
import { useResendEmailVerification } from "../../hooks/useResendEmailVerification";

const index: NextPage = () => {
  const { error, isLoading, resendEmailVerification } =
    useResendEmailVerification();

  const router = useRouter();
  const { email } = router.query;
  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text
        style={{
          position: "fixed",
          top: "0",
          left: "10px",
          fontSize: "30px"
        }}
        c="#fefefe"
      >
        <span
          style={{
            color: "#9c6fe4"
          }}
        >
          TS
        </span>
        Mailer
      </Text>
      <Paper
        style={{
          padding: "3%",
          borderRadius: "25px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Text c="#fefefe" size="22px" fw={600}>
          Verify your email address
        </Text>
        <br />
        <Text c="#fefefe" size="18px" fw={200}>
          To start using TSMailer, confirm your email address with the email we
          sent to:
        </Text>
        <br />
        <Text c="#fefefe" size="18px" fw={600}>
          {email}
        </Text>
        <br />
        {error && <Text c="crimson">{error}</Text>}
        <Button
          color="#9c6fe4"
          c="#fefefe"
          variant="filled"
          fullWidth
          onClick={(e) => resendEmailVerification(e, email as string)}
          disabled={isLoading}
        >
          {isLoading ? <Loader color="#9c6fe4" size="sm" /> : "Resend email"}
        </Button>
      </Paper>
    </Container>
  );
};

export default index;
