import { IEmailAccounts } from "@packages/types";
import { Schema, model } from "mongoose";

const emailAccountsSchema = new Schema<IEmailAccounts>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  yahoo: [
    {
      email: {
        required: true,
        type: String,
        validate: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/,
          "Invalid email format."
        ]
      },
      password: {
        required: true,
        type: String
      },
      nickName: {
        required: true,
        type: String
      }
    }
  ]
});

const EmailAccounts = model("EmailAccounts", emailAccountsSchema);

export default EmailAccounts;
