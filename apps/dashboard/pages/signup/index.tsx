import React from "react";
import type { NextPage } from "next";
import { Container, Text } from "@mantine/core";
import CreateUserForm from "../../components/CreateUserForm/CreateUserForm";

const index: NextPage = () => {
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
      <CreateUserForm />
    </Container>
  );
};

export default index;
