import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    full_name: { type: String, required: true },
    phone_number: { type: String },
    image: { type: String },
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Client', clientSchema);
