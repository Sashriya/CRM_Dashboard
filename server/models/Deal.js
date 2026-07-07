import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    contact: { type: mongoose.Schema.Types.ObjectId, ref: "Contact" },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    stage: {
      type: String,
      enum: ["prospecting", "proposal", "negotiation", "won", "lost"],
      default: "prospecting",
    },
    value: { type: Number, default: 0 },
    closeDate: { type: Date },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Deal", dealSchema);
