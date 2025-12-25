import path from 'path';
import { fileURLToPath } from 'url';
import Rating from '../models/ratingModel.js';
import asyncHandler from 'express-async-handler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const RatingPage = (req, res) => {
  res.render('index');
};

export const submitRating = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.phone || !req.body.numGTables) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const newRating = new Rating(req.body);
  await newRating.save();

  res.status(200).json({ message: 'تم إرسال التقييم بنجاح' });
});


