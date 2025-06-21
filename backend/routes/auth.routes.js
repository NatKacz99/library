import express from "express";
import passport from "passport";
import {authorizationGoogleScope, authGoogleCallback, login, signup} from "./../controllers/auth.controller.js"

const router = express.Router();

router.get("/auth/google", authorizationGoogleScope);

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), authGoogleCallback);

router.post("/login", login);

router.post("/signup", signup);

export default router;