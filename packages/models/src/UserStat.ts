import mongoose, { Schema } from "mongoose";
import { IUserStat } from "@repo/types";

export interface IUserStatDocument extends IUserStat, Document {}

const userStatSchema = new Schema<IUserStatDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  monthlyEmailData: [
    {
      month: {
        type: String,
        required: true
      },
      year: {
        type: String,
        required: true
      },
      sent: {
        type: Number,
        required: true
      },
      failed: {
        type: Number,
        required: true
      },
      apiCalls: {
        type: Number,
        required: true
      }
    }
  ],
  totalSentMail: {
    type: Number,
    required: true,
    default: 0
  },
  totalApiCalls: {
    type: Number,
    required: true,
    default: 0
  },
  resetMonthlyEmailDate: {
    type: String,
    required: true
  },
  createdDate: {
    type: String,
    required: true
  },
  lastModifiedDate: {
    type: String,
    required: true
  }
});

export const UserStat =
  (mongoose.models.UserStat as mongoose.Model<IUserStatDocument>) ||
  mongoose.model("UserStat", userStatSchema);

export default UserStat;
