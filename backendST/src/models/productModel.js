import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    color: { type: String },
    size: { type: String },
    stock: { type: Number, default: 0 },
    material: { type: String },
    units: { type: Number },
    category: { type: String },
    sub_category: { type: String },
    image: { type: String },
    active: { type: Boolean, default: true },
    seson: { type: String },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Product', productSchema);
