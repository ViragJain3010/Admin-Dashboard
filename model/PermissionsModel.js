// models/Permission.js
const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    group: { type: String, required: true, unique: true },
    permissions: [
      {
        name: { type: String, required: true },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

permissionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

permissionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
