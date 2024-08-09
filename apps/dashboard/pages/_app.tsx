import "@mantine/core/styles.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { UserContextProvider } from "../context/userContext";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <UserContextProvider>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </UserContextProvider>
    </MantineProvider>
  );
}

export default MyApp;
