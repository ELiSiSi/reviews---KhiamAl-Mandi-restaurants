// import express from 'express';
// import mongoose from 'mongoose';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import methodOverride from 'method-override';
// import cors from 'cors';
// import dotenv from 'dotenv';
// dotenv.config({ path: './secret.env' });



// import allEvaluationRouter from './routes/AllEvaluationRouter.js';
// import ratingRouter from './routes/ratingRouter.js';
// import Rating from './models/ratingModel.js';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // secrets and security middlewares
// import { xss } from 'express-xss-sanitizer';
// app.use(xss());

// import mongoSanitize from '@exortek/express-mongo-sanitize';  // ← الجديد
// app.use(mongoSanitize());



// import helmet from 'helmet';
// app.use(helmet());

// app.disable('x-powered-by');

// const MONGO_URI = process.env.MONGO_URI;
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')));

// // View engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// // Routes
// app.use('/', ratingRouter);
// app.use('/', allEvaluationRouter);

// app.get('/', async (req, res) => {
//    res.redirect('/rating');
// });


// mongoose

//   .connect(MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}/rating`);
//     });
//   })
//   .catch((err) => {
//     console.log('MONGO URI =>', process.env.MONGO_URI);

//     console.error('MongoDB connection error:', err);
//   });


//   export default app;

import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import methodOverride from 'method-override';
import cors from 'cors';
import dotenv from 'dotenv';

// ✅ تحميل متغيرات البيئة
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: './secret.env' });
}

import allEvaluationRouter from './routes/AllEvaluationRouter.js';
import ratingRouter from './routes/ratingRouter.js';
import Rating from './models/ratingModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS أولاً
app.use(cors());

// Security middlewares
import { xss } from 'express-xss-sanitizer';
app.use(xss());

import mongoSanitize from '@exortek/express-mongo-sanitize';
app.use(mongoSanitize());

import helmet from 'helmet';
app.use(
  helmet({
    contentSecurityPolicy: false, // ✅ مهم لـ EJS
  })
);

app.disable('x-powered-by');

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ✅ MongoDB Connection مع Caching للـ Serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // ✅ مهم جداً في Serverless
      maxPoolSize: 1, // ✅ واحد فقط في Serverless
    };

    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongoose) => {
        console.log('✅ New MongoDB connection established');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        cached.promise = null; // Reset للسماح بإعادة المحاولة
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// ✅ Middleware للاتصال بقاعدة البيانات قبل كل request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      success: false,
      error: 'فشل الاتصال بقاعدة البيانات',
    });
  }
});

// Routes
app.get('/', (req, res) => {
  res.redirect('/rating');
});

app.use('/', ratingRouter);
app.use('/', allEvaluationRouter);

// ✅ Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في السيرفر',
  });
});

// ❌ لا تستخدم app.listen في Serverless!
// mongoose.connect().then(() => app.listen(...)) ← احذف ده

// ✅ Export للـ Vercel
export default app;
