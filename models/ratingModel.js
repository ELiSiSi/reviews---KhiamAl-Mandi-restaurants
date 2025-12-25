import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    numGTables: { type: Number, required: true },
    tent: { type: String, required: true },
    cashier: Number,
    cleanliness: Number,
    foodQuality: Number,
    service: Number,
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
