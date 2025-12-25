import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    numGTables: {
      type: Number,
      required: false,
      default: null, // ← مهم جدًا: null مش string
    },
    tent: {
      type: String,
      required: false,
      default: null, // أو '' لو عايز قيمة فاضية
    },
    cashier: { type: Number, required: true },
    cleanliness: { type: Number, required: true },
    foodQuality: { type: Number, required: true },
    service: { type: Number, required: true },
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
