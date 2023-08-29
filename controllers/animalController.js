import Animal from "../mongodb/models/animal.js";
import User from "../mongodb/models/user.js";
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from "mongoose";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


//post adding animal detail
export const addAnimal = async(req,res) =>{
    try {
        const {name, type, description, breed, gender, age, colour, vaccinated, address, city, country, adopted} = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const photoUrl = await cloudinary.uploader.upload(req.files.photo.tempFilePath);
        
        const newAnimal = await Animal.create({name, type, description, breed, gender, age, colour, vaccinated, address, city, country, photo: photoUrl.url, adopted, creator: req.user._id});
        const user = await User.findById(req.user._id);
        user.allAnimal.push(newAnimal._id);

        await user.save({ session });
        await session.commitTransaction();

        res.status(200).send({ success:true, message: "Added successfully", animal:newAnimal});
    } catch (error) {
        res.status(500).send({ success:false, message: "Something went wrong", error });
    }
};


// get  getting all animals
export const getAllAnimals = async (req, res) => {
    try {    
        const { limit, page, sort, order, name="", type="", breed="", adopted=null } = req.query;

        const query = {};

        const filterConditions = [];

        if (type) {
            filterConditions.push({ type: { $regex: type, $options: "i" } });
        }
        if (name) {
            filterConditions.push({ name: { $regex: name, $options: "i" } });
        }
        if (breed) {
            filterConditions.push({ breed: { $regex: breed, $options: "i" } });
        }
        if (adopted!=null) {
            filterConditions.push({ adopted: adopted });
        }

        if (filterConditions.length > 0) {
            query.$and = filterConditions;
        }

        const count = await Animal.countDocuments(query);
        const lt = Number(limit) || 10;
        const pe = Number(page) || 1;
        const skp = (pe - 1) * lt;

        const animals = await Animal.find(query)
            .sort({ [sort]: order })
            .skip(skp)
            .limit(lt);

        res.status(200).send({
            success: true,
            message: "All Animal fetches successfully",
            total: count,
            animals
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message 
        });
    }
};


//get param:id getting particular animal detail;
export const getAnimalDetail = async(req,res) => {
    try{
        const animal = await Animal.findById(req.params.id).populate({path:"creator",select:["-password","-allAnimal","-allInjuredAnimal"]});
        if(!animal){
            res.status(404).send({
                success : false,
                message: "animal not exist"
            })
        }
        res.status(200).send({
            success :true,
            animal
        })
    }
    catch(error){
        res.status(500).send({
            success : false,
            message: error.message
        })
    }
}


//put update Animal detail
export const updateAnimal = async(req,res) =>{
    try {
        const {name, type, description, breed, gender, age, colour, vaccinated, address, city, country, adopted} = req.body;

        const animal = await Animal.findById(req.params.id);
        if(!animal){
            res.status(404).send({
                success : false,
                message: "animal not exist"
            })
        }
        console.log(req.user._id);

        if(animal.creator.toString() !== req.user._id){
            res.status(401).send({
                success : false,
                message: "unautharised access"
            })
        }

        const updatedAnimal = await Animal.findByIdAndUpdate(req.params.id,{name, type, description, breed, gender, age, colour, vaccinated, address, city, country, adopted},{ new: true });

        res.status(200).send({ 
             success:true,
             message: "Updated successfully",
             animal: updatedAnimal
        });
    } catch (error) {
        res.status(500).send({ 
            success:false, 
            message: error.message 
        });
    }
};
 

//delete removing animal detial
export const deleteAnimal = async(req,res) => {
    try{
        const imgArray = req.query.imageUrl.split('/');
        const imgId = imgArray[imgArray.length-1].split('.')[0];
        const session = await mongoose.startSession();
        session.startTransaction();

        const animal = await Animal.findById(req.params.id).populate("creator");
        if(!animal){
            res.status(404).send({
                success : false,
                message: "animal not exist"
            })
        }

        if(animal.creator._id.toString() !== req.user._id){
            res.status(401).send({
                success : false,
                message: "unautharised access"
            })
        }

        const deletedAnimal = await Animal.findByIdAndDelete(req.params.id);
        animal.creator.allAnimal.pull(animal);
        await cloudinary.uploader.destroy(imgId);
        await animal.creator.save({ session });
        await session.commitTransaction();
        res.status(200).send({ 
            success:true,
            message: "Deleted successfully",
            animal: deletedAnimal
       });
    }
    catch(error){
        res.status(500).send({ 
            success:false, 
            message: error.message 
        });
    }
}


//get fetch user created animal
export const getUserAnimal = async(req,res) =>{
    try{
        const user = await User.findById(req.user._id).populate("allAnimal");
        res.status(200).send({
            success:true,
            allAnimal : user.allAnimal,
            message: "All User Animal fetches successfully"
        })
    }
    catch(error){
        res.status(500).send({ 
            success:false, 
            message: error.message 
        });
    }
}



// {
//     "name":"moti",
//     "type":"dog",
//     "description":"moti is very wild dog",
//     "breed":"german sephard",
//     "age":4,
//     "colour":"black",
//     "location": {
//           "streetAddress": "327-B kazi khera lal bangla",
//           "landMark": "Day's Hospital",
//           "city": "Kanpur",
//           "state": "UttarPradesh",
//           "pinCode": 208007,
//           "country": "India"
//        },
//     "adopted":true
//   }