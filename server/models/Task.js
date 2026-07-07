import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dueDate: { type: Date },
    status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    relatedTo: {
      model: { type: String, enum: ["Contact", "Lead", "Deal", null], default: null },
      id: { type: mongoose.Schema.Types.ObjectId, default: null },
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
