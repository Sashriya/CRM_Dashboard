import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    company: { type: String, trim: true },
    source: {
      type: String,
      enum: ["website", "referral", "cold_call", "social_media", "event", "other"],
      default: "other",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "unqualified", "converted"],
      default: "new",
    },
    value: { type: Number, default: 0 },
    aiScore: { type: Number, min: 0, max: 100, default: null },
    aiSummary: { type: String, default: "" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
