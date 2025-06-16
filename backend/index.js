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

app.get("/api/books/:isbn", async (req, res) => {
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
      return res.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
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
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email])
    if (result.rows.length === 0) {
      const newUser = await db.query("INSERT INTO USERS (name, password, email) VALUES($1, $2, $3)",
        [profile.name, "google", profile.email])
      cb(null, newUser.rows[0])
    } else {
      cb(null, result.rows[0])
    }
  } catch (err) {
    console.log(err)
  }
}
))

app.post("/details/borrow/:isbn", async (req, res) => {
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
})

app.post("/details/order/:isbn", async (req, res) => {
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
})

app.get("/my-borrowings/:userId", async (req, res) => {
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
});

app.get("/my-borrowings/order/:userId", async (req, res) => {
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
})

app.put("/my-data/updatePersonalData/:userId", async (req, res) => {
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
})


passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});