import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  password: string;
  email: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const MessageSchema = new Schema<Message>({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: [true, "username required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password required"],
  },
  email: {
    type: String,
    required: [true, "email required"],
    unique: true,
    match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "please enter a valid email address"],
  },
  verifyCode: {
    type: String,
    required: [true, "verification code required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verification code expiry required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});



const UserModel=(mongoose.models.User as mongoose.Model<User>)||mongoose.model<User>("User",UserSchema)
export default UserModel