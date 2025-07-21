import express from "express";
import bodyParser from "body-parser";
import env from "dotenv";
import db from './config/DataBase.js';
import passport from "passport";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js";
import booksDetailsRoutes from "./routes/booksDetails.routes.js";
import booksBorrowingsRoutes from "./routes/booksBorrowings.routes.js";
import userRoutes from "./routes/user.routes.js";
import {selectAllBooks} from "./services/allBooks.services.js";
import { sanitizeMiddleware } from './middleware/sanitization.js';
import "./middleware/passport.js";
import cors from 'cors';
import rateLimit from 'express-rate-limit';

env.config();

const app = express();
const port = 3000;
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  skipSuccessfulRequests: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({limit: '1mb'}));
app.use(sanitizeMiddleware);

app.use(cors({
  origin: 'http://116.202.101.142:5173',
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/login', loginLimiter);

app.get("/", async (req, res) => {
  try {
    const books = await selectAllBooks();
    res.json(books);
  } catch(err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
})

app.use("/", authRoutes);

app.use("/", booksDetailsRoutes);

app.use("/", booksBorrowingsRoutes);

app.use("/", userRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
