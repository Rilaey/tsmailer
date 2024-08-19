export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!login).*)" // Exclude /login from middleware protection
  ]
};
