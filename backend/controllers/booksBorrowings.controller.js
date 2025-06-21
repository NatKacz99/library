import db from "../config/DataBase.js";

export async function checkBookOut(req, res){
  const { isbn } = req.params;
  const { userId } = req.body;

  if (!userId || !isbn) {
    return res.status(400).json({ message: "Missing userId or isbn" });
  }

  try {
    const result = await db.query('SELECT * FROM books WHERE isbn = $1', [isbn]);
    const book = result.rows[0];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const today = new Date();
    const returnAt = new Date(today);
    returnAt.setDate(returnAt.getDate() + 30);
    console.log("Return date:", returnAt.toISOString());

    var piecesAmountResult = await db.query(
      'SELECT pieces_amount FROM books'
    )
    var piecesAmount = piecesAmountResult.rows[0];

    await db.query(
      `INSERT INTO loans (isbn, user_id, return_at)
        VALUES ($1, $2, $3)`, [isbn, userId, returnAt.toISOString()]
    )

    await db.query(
      `UPDATE books
    SET pieces_amount = pieces_amount - 1
    WHERE isbn = $1`,
      [isbn]
    );

    res.status(200).json({ message: "The book was borrowed successfully" });
  }
  catch (err) {
    console.error("Error during loan insert:", err);
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function bookUpBook(req, res){
  const { isbn } = req.params;
  const { userId } = req.body;

  if (!userId || !isbn) {
    return res.status(400).json({ message: "Missing userId or isbn" });
  }

  try {
    const result = await db.query('SELECT * FROM books WHERE isbn = $1', [isbn]);
    const book = result.rows[0];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    await db.query(`INSERT INTO orders (book_isbn, user_id)
      VALUES ($1, $2)`, [isbn, userId]);
    res.status(200).json({ message: "The book was order successfully" });
  } catch (err) {
    console.error("Error during order insert:", err);
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function displayUserBorrowings(req, res){
  const { userId } = req.params;
  try {
    const result = await db.query(
      `SELECT books.title, books.author, l.rented_at, l.return_at
       FROM loans l
       JOIN books ON l.isbn = books.isbn
       WHERE l.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function displayUserOrders(req, res){
  const { userId } = req.params;
  try {
    const result = await db.query(
      `SELECT books.title, books.author
      FROM orders o
      JOIN books ON o.book_isbn = books.isbn
      WHERE o.user_id = $1`, [userId]
    )
    res.json(result.rows);
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}