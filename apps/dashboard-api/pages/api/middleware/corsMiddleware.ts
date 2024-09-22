// corsMiddleware.ts
import { NextApiRequest, NextApiResponse } from "next";

export default function cors(
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
): void {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.NEXTAUTH_URL as string
  );

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  next();
}
