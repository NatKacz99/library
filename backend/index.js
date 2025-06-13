import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from 'bcrypt';
import env from "dotenv";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import GoogleStrategy from "passport-google-oauth2";
import cors from 'cors';

env.config();

const app = express();
const port = 3000;
const saltRounds = 10;
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

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();


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

app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}))

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:5173/"); 
  }
);

app.post("/login", (req, res, next) => {
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
      return res.json({ success: true, user: { id: user.id, email: user.email } });
    });
  })(req, res, next);
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

passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE name = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, isMatch) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          }
          if (isMatch) {
            return cb(null, user);
          } else {
            return cb(null, false, { message: "Invalid password" });
          }
        });
      } else {
        return cb(null, false, { message: "User not found" });
      }
    } catch (err) {
      console.log(err);
      return cb(err);
    }
  })
);

passport.use("google", new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  try{
    const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email])
    if(result.rows.length === 0){
      const newUser = await db.query("INSERT INTO USERS (name, password, email) VALUES($1, $2, $3)", 
        [profile.name, "google", profile.email])
      cb(null, newUser.rows[0])
    } else{
      cb(null, result.rows[0])
    }
  } catch(err){
    console.log(err)
  }
}
))

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});