import db from "../config/DataBase.js";

export async function searchGenres(req, res){
  try {
    const genres = await db.query('SELECT DISTINCT genre FROM books');
    res.json(genres.rows)
  } catch(err) {
    console.error(err.message);
    res.status(500).json('Server error');
  }
}

export async function searchBooksByTitleOrAuthor(req, res){
  const search = req.query.search || "";

  try {
    const result = await db.query(
      `SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $2`,
      [`%${search}%`, `%${search}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Server error");
  }
}

export async function displayTheBookOnItsDetailsPage(req, res){
  const { isbn } = req.params;
  try {
    const result = await db.query("SELECT * FROM books WHERE isbn = $1", [isbn]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}