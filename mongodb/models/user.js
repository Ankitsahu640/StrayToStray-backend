import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true,trim: true },
    email: { type: String, required: true,trim: true },
    password: {type:String, required:true,trim: true},
    contactNo :{type:Number, required:true,trim: true},
    gender: { type: String, required: true },
    address: {type: String, required: true},
    city: {type:String, required:true},
    country: {type:String, required:true},
    avatar: { type: String },
    allAnimal: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
    allInjuredAnimal: [{ type: mongoose.Schema.Types.ObjectId, ref: "InjuredAnimal" }],
    allDonation: [{type: mongoose.Schema.Types.ObjectId, ref: "Donation"}]
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;