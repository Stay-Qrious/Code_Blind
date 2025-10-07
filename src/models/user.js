const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, "Secretkey@123");
  return token;
};

const UserModel = new model("UserModel", userSchema);
module.exports = { UserModel };
