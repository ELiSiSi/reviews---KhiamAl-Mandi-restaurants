import express from 'express';
import { RatingPage, submitRating } from '../servers/ratingServer.js';

const router = express.Router();

router.get('/rating', RatingPage);
router.post('/api/submitrating', submitRating);
router.get('/api/keep-alive', async (req, res) => {
  try {
    // خيار 1: مجرد count خفيف (أخف حاجة)
    await Rating.countDocuments({});

    // خيار 2: لو عايز تضيف/تمسح document
    await Rating.deleteMany({ ping: true }); // امسح القديم
    await new Rating({ name: 'ping', phone: '000', ping: true }).save();

    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send('Error');
  }
});
export default router;
