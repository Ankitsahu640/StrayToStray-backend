import express from "express";
import { addInjuredAnimal, getAllInjuredAnimals, getInjuredAnimalDetail, updateInjuredAnimal, deleteInjuredAnimal, getUserInjuredAnimal } from "../controllers/injuredAnimalController.js";
import { fetchUserId ,validateRequest} from "../middlewares/authMiddleware.js";

const router = express.Router();

//adding animal
router.post("/addInjuredAnimal",fetchUserId, validateRequest('addInjuredAnimal'), addInjuredAnimal);

//fetchinf All InjuredAnimals
router.get('/getAllInjuredAnimals', getAllInjuredAnimals);

//fetching single animal detail
router.get('/getInjuredAnimalDetail/:id', getInjuredAnimalDetail);

//update animal detail
router.put('/updateInjuredAnimal/:id', fetchUserId, validateRequest('updateInjuredAnimal'), updateInjuredAnimal);

//delete animal 
router.delete('/deleteInjuredAnimal/:id', fetchUserId, deleteInjuredAnimal);

//getting user uploaded animal
router.get('/getUserInjuredAnimal', fetchUserId, getUserInjuredAnimal);

export default router;
