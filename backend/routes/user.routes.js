import express from "express";
import {updateUserData, deleteUserAccount} from "./../controllers/userData.controller.js";

const router = express.Router();

router.put("/my-data/updatePersonalData/:userId", updateUserData);
router.delete("/my-data/delete-account/:userId", deleteUserAccount);

export default router;