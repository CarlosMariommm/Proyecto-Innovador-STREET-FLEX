import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    id_supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    date_of_entry: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Inventory', inventorySchema);
