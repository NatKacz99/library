import db from "../config/DataBase.js";
import bcrypt from 'bcrypt';

const saltRounds = 10;

export async function updateUserData(req, res){
  const { userId } = req.params;
  const { name, email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }


    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) {
      await db.query("UPDATE users SET name = ($1) WHERE id = ($2)", [name, userId])
    }
    if (email) {
      await db.query("UPDATE users SET email = ($1) WHERE id = ($2)", [email, userId])
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query("UPDATE users SET password = ($1) WHERE id = ($2)", [hashedPassword, userId])
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function deleteUserAccount(req, res){
  const { userId } = req.params;

  await db.query("DELETE FROM loans WHERE user_id = $1", [userId]);
  await db.query("DELETE FROM orders WHERE user_id = $1", [userId]);

  try {
    const result = await db.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);

    if (result.rowCount > 0) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({
        success: false,
        error: `User with id ${userId} not found. No users were deleted.`,
      });
    }
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, error: "Server error while deleting account" });
  }
}