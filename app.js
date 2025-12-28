import express from 'express';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import { connectToDatabase } from './config/database.js'; // ✅

dotenv.config({ path: './secret.env' });

import allEvaluationRouter from './routes/AllEvaluationRouter.js';
import ratingRouter from './routes/ratingRouter.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// View engine
app.set('views', 'views');
app.set('view engine', 'ejs');

// ✅ Database Middleware
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'خطأ في الاتصال بقاعدة البيانات',
    });
  }
});

// Routes
app.use('/Khiam-Al-Mandi-restaurants', ratingRouter);
app.use('/Khiam-Al-Mandi-restaurants/show', allEvaluationRouter);

app.get('/', (req, res) => {
  res.redirect('/Khiam-Al-Mandi-restaurants/rating');
});

// Local dev
if (process.env.NODE_ENV !== 'production') {
  connectToDatabase().then(() => {
    app.listen(3000, () => console.log('Server on port 3000'));
  });
}

export default app;
