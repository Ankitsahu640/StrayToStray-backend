import express from "express";
import { addAnimal, getAllAnimals, getAnimalDetail, updateAnimal, deleteAnimal, getUserAnimal } from "../controllers/animalController.js";
import { fetchUserId ,validateRequest} from "../middlewares/authMiddleware.js";

const router = express.Router();

//adding animal
router.post("/addAnimal",fetchUserId, validateRequest('addAnimal'), addAnimal);

//fetchinf All Animals
router.get('/getAllAnimals', getAllAnimals);

//fetching single animal detail
router.get('/getAnimalDetail/:id', getAnimalDetail);

//update animal detail
router.put('/updateAnimal/:id', fetchUserId, validateRequest('updateAnimal'), updateAnimal);

//delete animal 
router.delete('/deleteAnimal/:id', fetchUserId, deleteAnimal);

//getting user uploaded animal
router.get('/getUserAnimal', fetchUserId, getUserAnimal);

export default router;
