import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema({
    doner:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
    animal : { type: mongoose.Schema.Types.ObjectId, ref: "InjuredAnimal"},
    amount : { type:Number, required:true},
    date: { type:Date, default: Date.now, required:true }
})

const DonationModel = mongoose.model("Donation", DonationSchema);

export default DonationModel;