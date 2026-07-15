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
    care_instructions: { type: String },
    shipping_returns: { type: String },
    units: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    id_module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    image: { type: String },
    active: { type: Boolean, default: true },
    seson: { type: String },
    reviews: [
      {
        id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        date: { type: Date, default: Date.now }
      }
    ],
    average_rating: { type: Number, default: 0 },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Product', productSchema);
