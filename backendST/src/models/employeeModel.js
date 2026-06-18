import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    single_document: { type: String },
    phone_number: { type: String },
    image: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Employee', employeeSchema);
