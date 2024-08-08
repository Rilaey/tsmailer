import React from "react";
import type { NextPage } from "next";
import { Box, Container, Text } from "@mantine/core";
import LoginForm from "../components/LoginForm/LoginForm";

const login: NextPage = () => {
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
            color: "#b2f35f"
          }}
        >
          TS
        </span>
        Mailer
      </Text>
      <LoginForm />
    </Container>
  );
};

export default login;
