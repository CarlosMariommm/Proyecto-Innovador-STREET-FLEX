import mongoose from 'mongoose';

// Ciclo de vida del pedido. Es independiente de `payment_status` (que solo dice
// si se pago y es lo que usa la pantalla de entregas del panel admin).
export const SALE_STATUS = {
  PENDING: 'Pendiente',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const saleSchema = new mongoose.Schema(
  {
    id_shoppig_car: { type: mongoose.Schema.Types.ObjectId, ref: 'Shopping_Car', required: true },
    delivery_addres: { type: String },
    city: { type: String },
    payment_method: { type: String },
    payment_status: { type: String },
    status: {
      type: String,
      enum: Object.values(SALE_STATUS),
      default: SALE_STATUS.PENDING,
    },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Sale', saleSchema);
