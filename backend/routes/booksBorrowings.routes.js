import express from "express";
import {checkBookOut, bookUpBook, displayUserBorrowings, displayUserOrders} from 
"./../controllers/booksBorrowings.controller.js"

const router = express.Router();

router.post("/details/borrow/:isbn", checkBookOut);
router.post("/details/order/:isbn", bookUpBook);
router.get("/my-borrowings/:userId", displayUserBorrowings);
router.get("/my-borrowings/order/:userId", displayUserOrders);

export default router;