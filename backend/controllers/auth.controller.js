import db from "./../config/DataBase.js";
import passport from "passport";
import bcrypt from 'bcrypt';
import { sanitizeString, sanitizeEmail, sanitizeUserId } from '../middleware/sanitization.js';

const saltRounds = 10;

export const authorizationGoogleScope = passport.authenticate("google", {
  scope: ["profile", "email"]
});

export function authGoogleCallback(req, res) {
  res.redirect("http://localhost:5173/");
}

export async function login(req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return next(err);
    }
    if (!user) {
      console.warn("Authentication failed:", info);
      return res.status(401).json({ success: false, message: info?.message || "Invalid credentials" });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }
      return res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    });
  })(req, res, next);
}


export async function signup(req, res) {
  const { username, email, password, confirmPassword } = req.body;
  console.log(username);
  console.log(email);
  console.log(password);
  console.log(confirmPassword);
  try {
    username = sanitizeString(username, 50);
    email = sanitizeEmail(email);
    password = sanitizeString(password, 100);
    confirmPassword = sanitizeString(confirmPassword, 100);
    
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

    if(password.length < 8 ){
      return res.status(400).json({success: false, message: `The password must consist of at 
        least 8 characters`})
    }

    const checkResultEmail = await db.query("SELECT * FROM users WHERE email = $1", [
      email
    ]);

    const checkResultUsername = await db.query("SELECT * FROM users WHERE name = $1", [
      username
    ]);

    if (checkResultEmail.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already exists. Try log in.' })
    }

    if (checkResultUsername.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exist. Choose a different nick.' })
    }

    try {
      const hash = await bcrypt.hash(password, saltRounds);
      const result = await db.query(
        `INSERT INTO USERS (name, password, email) VALUES ($1, $2, $3)`,
        [username, hash, email]
      );
      return res.status(200).json({ success: true, message: 'Registration was successful!' });
    } catch (err) {
      console.error("Error during registration:", err);
      return res.status(500).json({ success: false, message: 'Registration failed.' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}