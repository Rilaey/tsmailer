import { IPlan } from "@repo/types";
import mongoose, { Schema } from "mongoose";

const planSchema = new Schema<IPlan>({
  name: {
    type: String,
    required: true
  },
  monthlyRequest: {
    type: Number,
    required: true
  },
  templates: {
    type: Number,
    required: true
  },
  contacts: {
    type: Number,
    require: true
  },
  emailProviders: {
    type: Number,
    required: true
  },
  attachmentSize: {
    type: Number,
    require: true
  },
  branding: {
    type: String,
    required: true
  },
  dataRetention: {
    type: String,
    required: true
  },
  analytics: {
    type: String,
    required: true
  },
  dynamicVariables: {
    type: Boolean,
    required: true
  },
  support: {
    type: String,
    required: true
  },
  teamManagement: {
    type: String,
    required: true
  },
  ipWhiteListing: {
    type: Boolean,
    required: true
  },
  ipBlackListing: {
    type: Boolean,
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

export const Plan = mongoose.models.Plan || mongoose.model("Plan", planSchema);

export default Plan;
