import express from "express";
import { sendMail } from "../controllers/sendMailController.js";

const router = express.Router();

//sending request for adoption trough g-mail
router.post("/",sendMail);


export default router;
