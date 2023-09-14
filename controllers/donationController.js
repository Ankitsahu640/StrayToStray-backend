import Stripe from 'stripe';
import Donation from '../mongodb/models/donation.js';
import User from "../mongodb/models/user.js";
import mongoose from 'mongoose';

const stripe = Stripe('sk_test_51Nndj5SEBwGuV2QLWae5NQeax3uMPlm5AECgANiU3ITNsxAa6RV5StD4S6QunnN8orWeOZdMG7UFvwvllJ1eaKkv00g8SmKCqE');

export const donate = async(req,res) => {
    
    try {
        const {doner,animal,amount} = req.body;

        const mongoSession = await mongoose.startSession();
        mongoSession.startTransaction();
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            line_items:[{
                price_data: {
                    currency: "INR",
                    product_data: {
                      name: animal.name,
                      images: [animal.photo],
                    },
                    unit_amount: amount * 100,
                  },
                  quantity: 1,
            }],
            mode:"payment",
            success_url: `${process.env.CLIENT_URL}/checkout-success`,
            cancel_url: `${process.env.CLIENT_URL}/checkout-cancel`,
        });

        console.log(session);
        
    
        // Store donation data in MongoDB
        const donation =  await Donation.create({ doner,animal, amount });

        const user = await User.findById(req.user._id);
        user.allDonation.push(donation._id);

        await user.save({ mongoSession });
        await mongoSession.commitTransaction();

        res.status(200).json({id:session.id});
      }
       catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Donation failed' });
      }
}



export const getUserDonation = async(req,res) =>{
  try{
      const user = await User.findById(req.user._id).populate({
        path:'allDonation',
        populate:['animal']
      });
      res.status(200).send({
          success:true,
          allDonation : user.allDonation,
          message: "All User Donation fetches successfully"
      })
  }
  catch(error){
      res.status(500).send({ 
          success:false, 
          message: error.message 
      });
  }
}