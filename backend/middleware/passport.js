import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import bcrypt from "bcrypt";
import db from "./../config/DataBase.js";

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
  callbackURL: "http://116.202.101.142:3000/auth/google/callback",
  userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
}, async (accessToken, refreshToken, profile, cb) => {
  console.log(profile);
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [profile.email])
    if (result.rows.length === 0) {
      const newUser = await db.query("INSERT INTO USERS (name, password, email) VALUES($1, $2, $3) RETURNING *",
        [profile.name, null, profile.email])
      cb(null, newUser.rows[0])
    } else {
      cb(null, result.rows[0])
    }
  } catch (err) {
    console.log(err)
  }
}
))

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];
    delete user.password;
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

export default passport;