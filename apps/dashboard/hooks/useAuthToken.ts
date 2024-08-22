import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useEffect } from "react";

/**
 * Custom session interface extending the Next.js Session interface.
 * It includes additional token details for user authentication.
 *
 * @interface CustomSession
 * @extends {Session}
 */
export interface CustomSession extends Session {
  /**
   * Optional user token details.
   *
   * @type {TokenDetails}
   */
  token?: {
    /**
     * GitHub username.
     * @type {string}
     */
    gh_username: string;

    /**
     * User's name.
     * @type {string}
     */
    name: string;

    /**
     * User's email address.
     * @type {string}
     */
    email: string;

    /**
     * URL to the user's profile picture.
     * @type {string}
     */
    picture: string;

    /**
     * Subject identifier.
     * @type {string}
     */
    sub: string;

    /**
     * User's ID.
     * @type {string}
     */
    id: string;

    /**
     * Another URL to the user's profile picture.
     * @type {string}
     */
    image: string;

    /**
     * Authentication provider (e.g., 'github').
     * @type {string}
     */
    provider: string;

    /**
     * Type of authentication (e.g., 'oauth').
     * @type {string}
     */
    type: string;

    /**
     * Provider-specific user identifier.
     * @type {string}
     */
    providerAccountId: string;

    /**
     * User's access token.
     * @type {string}
     */
    access_token: string;

    /**
     * Token type (e.g., 'bearer').
     * @type {string}
     */
    token_type: string;

    /**
     * Token scope.
     * @type {string}
     */
    scope: string;

    /**
     * Token issue timestamp.
     * @type {number}
     */
    iat: number;

    /**
     * Token expiration timestamp.
     * @type {number}
     */
    exp: number;

    /**
     * Token identifier.
     * @type {string}
     */
    jti: string;
  };
}

export function useAuthToken(required = false) {
  const session = useSession();
  const data = session.data as CustomSession;
  const token = data?.token;

  return {
    token,
    username: token?.gh_username,
    isAuthenticated:
      (session.data && session.data.expires) || 0 > new Date().getTime()
  };
}
