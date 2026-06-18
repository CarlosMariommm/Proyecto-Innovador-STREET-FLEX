import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    id_shoppig_car: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopping_Car', required: true },
    delivery_addres: { type: String },
    city: { type: String },
    payment_method: { type: String },
    payment_status: { type: String },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Sale', saleSchema);
