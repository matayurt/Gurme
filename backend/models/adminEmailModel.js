import mongoose from "mongoose";

const adminEmailSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    api: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminEmail = mongoose.model("AdminEmail", adminEmailSchema);

export default AdminEmail;
