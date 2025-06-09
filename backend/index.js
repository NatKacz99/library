import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

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

async function selectAllBooks(){
  const result = await db.query("SELECT * FROM books");
  return result.rows;
}

app.get("/", async (req, res) => {
  try{
    const books = await selectAllBooks();
    res.json(books);
  } catch{
    console.error(err.message);
    res.status(500).send('Server error');
  }
})

app.get("/genres", async (req, res ) => {
  try{
    const genres = await db.query('SELECT DISTINCT genre FROM books');
    res.json(genres.rows)
  } catch{
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});