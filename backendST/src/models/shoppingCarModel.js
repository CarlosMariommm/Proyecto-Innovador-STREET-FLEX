import mongoose from 'mongoose';

const shoppingCarSchema = new mongoose.Schema(
  {
    products: [
      {
        id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        amount: { type: Number },
        subtotal: { type: Number },
      }
    ],
    id_client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    total: { type: Number },
    discount: { type: Number },
    total_w_discount: { type: Number },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Shopping_Car', shoppingCarSchema);
