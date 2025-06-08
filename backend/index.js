import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

import cors from 'cors';
app.use(cors());

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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});