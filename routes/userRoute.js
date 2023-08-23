import express from "express";
import { createUserController, loginController,updateUserController, getUserByIdController } from "../controllers/userController.js";
import { fetchUserId ,validateRequest} from "../middlewares/authMiddleware.js";

const router = express.Router();

//register
router.post("/register", validateRequest("register"), createUserController);

//login
router.post("/login", validateRequest("login"), loginController);

//update user profile
router.put("/update-user", fetchUserId, validateRequest("update-user"), updateUserController);

//get user by id
router.get("/get-user/:id", getUserByIdController);

export default router;