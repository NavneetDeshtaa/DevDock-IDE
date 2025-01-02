import mongoose  from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date:{ type: Date, default: Date.now },
  isBlocked: {type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false }
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;