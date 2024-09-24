import "@mantine/core/styles.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { UserContextProvider } from "../context/userContext";
import { SessionProvider } from "next-auth/react";
import Script from "next/script";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-MZCH2Q6LKQ"
      ></Script>
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-MZCH2Q6LKQ');`
        }}
      ></Script>
      <MantineProvider
        defaultColorScheme="dark"
        theme={{ primaryColor: "violet" }}
      >
        <SessionProvider session={session}>
          <UserContextProvider>
            <Component {...pageProps} />
          </UserContextProvider>
        </SessionProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
