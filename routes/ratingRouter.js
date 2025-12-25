import express from 'express';
import { RatingPage, submitRating } from '../servers/ratingServer.js';

const router = express.Router();

router.get('/rating', RatingPage);
router.post('/api/submitrating', submitRating);
export default router;
