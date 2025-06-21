import express from "express";
import {searchGenres, searchBooksByTitleOrAuthor, displayTheBookOnItsDetailsPage} from 
"../controllers/booksDetails.controller.js";

const router = express.Router();

router.get("/genres", searchGenres);
router.get("/books", searchBooksByTitleOrAuthor);
router.get("/api/books/:isbn", displayTheBookOnItsDetailsPage);

export default router;
