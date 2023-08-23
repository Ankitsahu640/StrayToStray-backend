import mongoose from "mongoose";

const InjuredAnimalSchema = new mongoose.Schema({
    name: { type: String, required: true, trim :true},
    type: {type: String, required:true, trim:true},
    injuries: {type: String, required: true},
    injuryDetail: {type: String, required: true,},
    breed: {type: String},
    gender: {type: String,required: true},
    address: {type: String, required: true},
    city: {type:String, required:true},
    country: {type:String, required:true},
    date: { type:Date, default: Date.now, required:true },
    photo: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const injuredAnimalModel = mongoose.model("InjuredAnimal", InjuredAnimalSchema);

export default injuredAnimalModel;