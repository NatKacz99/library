import db from "../config/DataBase.js";

export async function checkBookOut(req, res) {
  const { isbn } = req.params;
  const { userId } = req.body;

  if (!userId || !isbn) {
    return res.status(400).json({ message: "Missing userId or isbn" });
  }

  try {
    const today = new Date();
    const returnAt = new Date(today);
    returnAt.setDate(returnAt.getDate() + 30);
    console.log("Return date:", returnAt.toISOString());

    await db.query('BEGIN');

    const bookResult = await db.query(
      'SELECT isbn, pieces_amount FROM books WHERE isbn = $1 FOR UPDATE',
      [isbn]
    );

    if (bookResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    const book = bookResult.rows[0];

    if (book.pieces_amount <= 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "Book is not available"
      });
    }

    const existingLoan = await db.query(
      'SELECT id FROM loans WHERE isbn = $1 AND user_id = $2 AND return_at > NOW()',
      [isbn, userId]
    );

    if (existingLoan.rows.length > 0) {
      await db.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: "You have already borrowed this book"
      });
    }


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
    await db.query('COMMIT');

    res.status(200).json({ message: "The book was borrowed successfully" });
  }
  catch (err) {
    await db.query('ROLLBACK');
    console.error("Error during loan insert:", err);
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function bookUpBook(req, res) {
  const { isbn } = req.params;
  const { userId } = req.body;

  if (!userId || !isbn) {
    return res.status(400).json({ message: "Missing userId or isbn" });
  }

  try {
    const bookResult = await db.query('SELECT * FROM books WHERE isbn = $1', [isbn]);
    const book = bookResult.rows[0];

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found"
      });
    }


    const existingOrder = await db.query(
      'SELECT id FROM orders WHERE book_isbn = $1 AND user_id = $2',
      [isbn, userId]
    );

    if (existingOrder.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "You have already ordered this book"
      });
    }

    await db.query(`INSERT INTO orders (book_isbn, user_id)
      VALUES ($1, $2)`, [isbn, userId]);
    res.status(200).json({ message: "The book was order successfully" });
  } catch (err) {
    console.error("Error during order insert:", err);
    return res.status(500).json({ message: "Internal server error" })
  }
}

export async function displayUserBorrowings(req, res) {
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
export async function displayUserOrders(req, res) {
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