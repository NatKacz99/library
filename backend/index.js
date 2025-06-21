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
import "./middleware/passport.js";
import cors from 'cors';

env.config();

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.get("/", async (req, res) => {
  try {
    const books = await selectAllBooks();
    res.json(books);
  } catch {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

app.use("/", authRoutes);

app.use("/", booksDetailsRoutes);

app.use("/", booksBorrowingsRoutes);

app.use("/", userRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});