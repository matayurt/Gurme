import mongoose from "mongoose";

const replySchema = mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Comment",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    name: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
  {
    timestamps: true,
  }
);

const Reply = mongoose.model("Reply", replySchema);

export default Reply;
