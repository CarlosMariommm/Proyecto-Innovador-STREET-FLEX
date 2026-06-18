import mongoose from 'mongoose';

const aiTryOnSchema = new mongoose.Schema(
  {
    name: { type: String },
    id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    image_client: { type: String },
    saved: { type: Boolean, default: false },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('AI_TryOn', aiTryOnSchema);
