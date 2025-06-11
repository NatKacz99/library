import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from 'bcrypt'

const app = express();
const port = 3000;
const saltRounds = 10;

import cors from 'cors';
app.use(cors());
app.use(express.json());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "library",
  password: "Josr84#",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));

async function selectAllBooks() {
  const result = await db.query("SELECT * FROM books");
  return result.rows;
}

app.get("/", async (req, res) => {
  try {
    const books = await selectAllBooks();
    res.json(books);
  } catch {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

app.get("/genres", async (req, res) => {
  try {
    const genres = await db.query('SELECT DISTINCT genre FROM books');
    res.json(genres.rows)
  } catch {
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

app.get("/books", async (req, res) => {
  const search = req.query.search || "";

  try {
    const result = await db.query(
      `SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $2`,
      [`%${search}%`, `%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  console.log(username);
  console.log(email);
  console.log(password);
  console.log(confirmPassword);
  try {
    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Incorrect email.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords are not the same.' });
    }

    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists. Try log in.' })
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log("Error hashing password:", err)
      }
      const result = await db.query(
        `INSERT INTO USERS (name, password, email) VALUES ($1, $2, $3)`,
        [username, hash, email]);
      return res.status(200).json({ success: true, message: 'Registration was successful!' });
    })
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}
)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});