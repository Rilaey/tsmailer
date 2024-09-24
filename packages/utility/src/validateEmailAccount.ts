import { Connection } from "mongoose";

const validateEmailAccount = async (db: Connection, email: string) => {
  const emailAccount = await db
    .collection("emailaccounts")
    .findOne({ email: email });

  return !!emailAccount;
};

export { validateEmailAccount };
