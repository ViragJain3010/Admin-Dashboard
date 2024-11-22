// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = mongoose.model("User", userSchema);

