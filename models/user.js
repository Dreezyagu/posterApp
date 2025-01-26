import { Schema as _Schema, model } from "mongoose";

const Schema = _Schema;

const userSchema = Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "new",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

export default model("User", userSchema);
