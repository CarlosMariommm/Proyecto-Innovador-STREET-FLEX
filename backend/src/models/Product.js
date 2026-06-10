import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    countInStock: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true }
}, {
    timestamps: true,
    strict: false
});

const Product = mongoose.model('Product', productSchema);
export default Product;
