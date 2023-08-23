import mongoose from "mongoose";

const AnimalSchema = new mongoose.Schema({
    name: { type: String, required: true, trim :true},
    type: {type: String, required:true, trim:true},
    description: { type: String, required: true },
    breed: {type: String},
    gender: {type: String, required:true},
    age: {type:Number, required: true},
    colour: {type:String, required:true},
    vaccinated: { type:Boolean, default: false},
    address: {type: String, required: true},
    city: {type:String, required:true},
    country: {type:String, required:true},
    date: { type:Date, default: Date.now },
    photo: { type: String, required: true },
    adopted: { type:Boolean, default: false, required: true},
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const animalModel = mongoose.model("Animal", AnimalSchema);

export default animalModel;