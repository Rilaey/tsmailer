import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { AuthOptions } from "next-auth";

const getDomainWithoutSubdomain = (url: string): string => {
  const urlParts = new URL(url).hostname.split(".");
  return urlParts.slice(-(urlParts.length === 4 ? 3 : 2)).join(".");
};

const useSecureCookies =
  process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

const cookiePrefix = useSecureCookies ? "__Secure-" : "";

const hostName = getDomainWithoutSubdomain(process.env.NEXTAUTH_URL as string);

// Define cookies configuration
const cookies = {
  sessionToken: {
    name: `${cookiePrefix}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: useSecureCookies,
      domain: `.${hostName}` // Use the root domain, e.g., `.tsmailer.com`
    }
  }
};

// Define callback functions
const callbacks: AuthOptions["callbacks"] = {
  async jwt({ token, user }) {
    if (user) {
      //@ts-expect-error
      token.accessToken = user.access_token;
      //@ts-expect-error
      token.user = user.user;
      //@ts-expect-error
      token.refreshToken = user.refresh_token;
    }
    return token;
  },

  async session({ session, token, user }) {
    if (token.user) {
      const { firstName, lastName, email } = token.user as {
        firstName: string;
        lastName: string;
        email: string;
      };
      session.user = {
        name: `${firstName} ${lastName}`,
        email: email
        // Include other user properties if needed
      };
    }
    //@ts-expect-error
    session.accessToken = token.accessToken;
    //@ts-expect-error
    session.refreshToken = token.refreshToken;
    return { ...session, ...token, ...user };
  }
};

// Define AuthOptions
const options: AuthOptions = {
  debug: false,
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies,
  cookies,
  providers: [],
  callbacks
};

// NextAuth handler
const Auth = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);

export default Auth;
