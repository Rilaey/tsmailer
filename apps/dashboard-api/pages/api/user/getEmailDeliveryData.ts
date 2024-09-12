import { IMonthlyEmailData } from "@repo/types";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "lib/db";

export default async function getEmailDeliveryData(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { apiKey } = req.body;

  try {
    const db = await dbConnect();

    const user = await db.collection("users").findOne({ apiKey });

    if (!user) {
      throw new Error("Unable to locate user.");
    }

    const monthlyEmailData: IMonthlyEmailData[] = user.monthlyEmailData;

    res.status(200).json(monthlyEmailData);
  } catch (err) {
    res.status(500).json({ Error: err });
  }
}
