import InjuredAnimal from "../mongodb/models/injuredAnimal.js";
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
export const addInjuredAnimal = async(req,res) =>{
    try {
        const {name, type, injuries, injuryDetail, breed, gender, address, city, country} = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const photoUrl = await cloudinary.uploader.upload(req.files.photo.tempFilePath);
        
        const newInjuredAnimal = await InjuredAnimal.create({name, type, injuries, injuryDetail, breed, gender, address, city, country, photo: photoUrl.url, creator: req.user._id});
        const user = await User.findById(req.user._id);
        user.allInjuredAnimal.push(newInjuredAnimal._id);

        await user.save({ session });
        await session.commitTransaction();

        res.status(200).send({ success:true, message:  "Added successfully", animal:newInjuredAnimal });
    } catch (error) {
        res.status(500).send({ success:false, error });
    }
};


// get  getting all animals
export const getAllInjuredAnimals = async (req, res) => {
    try {    
        const { limit, page, sort, order, name="", type="", breed=""} = req.query;

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
    
        if (filterConditions.length > 0) {
            query.$and = filterConditions;
        }

        const count = await InjuredAnimal.countDocuments(query);
        const lt = Number(limit) || 10;
        const pe = Number(page) || 1;
        const skp = (pe - 1) * lt;

        const animals = await InjuredAnimal.find(query)
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
export const getInjuredAnimalDetail = async(req,res) => {
    try{
        const animal = await InjuredAnimal.findById(req.params.id).populate({path:"creator",select:["-password","-allAnimal","-allInjuredAnimal"]});
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


//put update InjuredAnimal detail
export const updateInjuredAnimal = async(req,res) =>{
    try {
        const {name, type, injurires, injuryDetail, breed, gender, address, city, country} = req.body;

        const animal = await InjuredAnimal.findById(req.params.id);
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

        const updatedInjuredAnimal = await InjuredAnimal.findByIdAndUpdate(req.params.id,{name, type, injurires, injuryDetail, breed, gender, address, city, country});

        res.status(200).send({ 
             success:true,
             message: "Updated successfully",
             animal: updatedInjuredAnimal
        });
    } catch (error) {
        res.status(500).send({ 
            success:false, 
            message: error.message 
        });
    }
};
 

//delete removing animal detial
export const deleteInjuredAnimal = async(req,res) => {
    try{
        const imgArray = req.query.imageUrl.split('/');
        const imgId = imgArray[imgArray.length-1].split('.')[0];
        const session = await mongoose.startSession();
        session.startTransaction();

        const animal = await InjuredAnimal.findById(req.params.id).populate("creator");
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

        const deletedInjuredAnimal = await InjuredAnimal.findByIdAndDelete(req.params.id);
        animal.creator.allInjuredAnimal.pull(animal);
        await cloudinary.uploader.destroy(imgId);
        await animal.creator.save({ session });
        await session.commitTransaction();
        res.status(200).send({ 
            success:true,
            message: "Deleted successfully",
            animal: deletedInjuredAnimal
       });
    }
    catch(error){
        res.status(500).send({ 
            success:false, 
            message: error.message,
        });
    }
}


//get fetch user created animal
export const getUserInjuredAnimal = async(req,res) =>{
    try{
        const user = await User.findById(req.user._id).populate("allInjuredAnimal");
        res.status(200).send({
            success:true,
            allAnimal : user.allInjuredAnimal,
            message: "All User rescue Animal fetches successfully"
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