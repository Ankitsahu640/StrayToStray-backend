import User from "../mongodb/models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {validationResult} from "express-validator";
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//post register
export const createUserController = async (req, res) => {
    try {
        const { name, email, password, contactNo, gender, address, city , country} = req.body;

        //validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).send({success:false, message: errors.array()});
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(200).send({
              success: false,
              message: "Already Register please login",
            });
          }

        const salt =  bcrypt.genSaltSync(10);
        const hashPass = await bcrypt.hashSync(password, salt);

        let newUser;

        if (req.files && req.files.avatar) {
            const photoUrl = await cloudinary.uploader.upload(req.files.avatar.tempFilePath);
            newUser = await User.create({
                name, email, password: hashPass, contactNo, gender, address, city, country, avatar: photoUrl.url
            });
        } else {
            newUser = await User.create({
                name, email, password: hashPass, contactNo, gender, address, city, country
            });
        }
        

        const token = jwt.sign({_id:newUser._id}, process.env.JWT_SECRET);

        res.status(200).send({
            success: true,
            message: " Register Successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                contactNo: newUser.contactNo,
                gender: newUser.gender,
                address: newUser.address,
                city: newUser.city,
                country: newUser.country,
                avatar: newUser.avatar
              },
            token
          });
        } 
    catch (error) {
        console.log(error);
        res.status(500).send({
          success: false,
          message: "Errro in Registeration",
          error,
        });
    }
};

//post login
export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;

      //validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({success:false, message: errors.array() });
      }

      //check user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(200).send({
          success: false,
          message: "Incorrect Credentials",
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Incorrect Credentials",
        });
      }
      //token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            contactNo: user.contactNo,
            gender: user.gender,
            address: user.address,
            city: user.city,
            country: user.country,
            avatar: user.avatar
          },
        token
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };


//put updateUser      
export const updateUserController = async (req, res) => {
    try {
      const { name, email, contactNo, gender, address, city , country} = req.body;

      //validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({success:false, message: errors.array() });
      }
      
      let updatedUser;

      if (req.files && req.files.avatar) {
          const photoUrl = await cloudinary.uploader.upload(req.files.avatar.tempFilePath);
          updatedUser = await User.findByIdAndUpdate( req.user._id,{
              name, email,  contactNo, gender, address, city, country, avatar: photoUrl.url
          },{new: true});
      } 
      else {
        updatedUser = await User.findByIdAndUpdate( req.user._id,{
              name, email, contactNo, gender, address, city, country
          },{new:true});
      }

      res.status(200).send({
        success: true,
        message: "Profile Updated Successfully",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          contactNo: updatedUser.contactNo,
          gender: updatedUser.gender,
          address: updatedUser.address,
          city: updatedUser.city,
          country: updatedUser.country,
          avatar: updatedUser.avatar
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While Update profile",
        error,
      });
    }
  };

  //get userById
  export const getUserByIdController = async(req,res) =>{
    try{
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "user not exist",
        });
      }
      res.status(200).send({
        success: true,
        message: "user detail",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            contactNo: user.contactNo,
            gender: user.gender,
            address: user.address,
            city: user.city,
            country: user.country,
            avatar: user.avatar
          }
      });
    }
    catch(error){
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error While getting profile",
        error,
      });
    }
  };

