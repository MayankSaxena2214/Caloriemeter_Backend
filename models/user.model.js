import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate email entries
      lowercase:true
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 8);
});

// Generate JWT Token
userSchema.methods.getAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

userSchema.methods.comparePassword=async function(password){
  return await bcrypt.compare(password,this.password);
}
export const User = mongoose.model("User", userSchema);
