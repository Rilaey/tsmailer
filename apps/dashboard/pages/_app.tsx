import "@mantine/core/styles.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { UserContextProvider } from "../context/userContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider defaultColorScheme="dark">
      <UserContextProvider>
        <Component {...pageProps} />
      </UserContextProvider>
    </MantineProvider>
  );
}

export default MyApp;
