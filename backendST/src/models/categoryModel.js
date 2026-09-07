import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    // Los renglones que se ven anidados debajo de la categoria en el sidebar
    // de la app movil (ver CategorySidebar.js) — puramente de navegacion, no
    // hay productos etiquetados por subcategoria todavia.
    subcategories: [{ type: String }],
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    id_module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Category', categorySchema);
