import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    event_name: { type: String, required: true },
    event_start: { type: Date },
    event_end: { type: Date },
    discount: { type: Number },
    description: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

export default mongoose.model('Event', eventSchema);
