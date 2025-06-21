import db from './../config/DataBase.js';

export async function selectAllBooks() {
  const result = await db.query("SELECT * FROM books");
  return result.rows;
}

