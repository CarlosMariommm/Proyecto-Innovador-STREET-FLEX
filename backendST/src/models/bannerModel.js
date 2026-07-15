import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  id_module: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  image: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Banner', bannerSchema);
