import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
  {
    supp_name: { type: String, required: true },
    email: { type: String },
    phone_number: { type: String },
    direction: { type: String },
    image: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Supplier', supplierSchema);
