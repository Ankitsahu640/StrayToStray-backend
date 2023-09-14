import express from "express";
import { fetchUserId } from "../middlewares/authMiddleware.js";
import { donate, getUserDonation } from "../controllers/donationController.js";

const router = express.Router();

router.post("/donate",fetchUserId,donate);

router.get("/getUserDonation",fetchUserId,getUserDonation);

export default router;