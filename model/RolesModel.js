// models/Role.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  },
  { timestamps: true }
);

roleSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

roleSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = mongoose.model("Role", roleSchema);
