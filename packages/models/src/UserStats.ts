import mongoose, { Schema } from "mongoose";
import { IUserStats } from "@repo/types";

const userStatsSchema = new Schema<IUserStats>({
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

export const UserStats =
  mongoose.models.UserStats || mongoose.model("UserStats", userStatsSchema);

export default UserStats;
