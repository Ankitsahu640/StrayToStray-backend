import  jwt  from "jsonwebtoken";
import {body} from "express-validator";
import multer from "multer";

//Protected Routes token base
export const fetchUserId = async (req, res, next) => {
    try {
      const decode =  jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      req.user = decode;
      next();
    } catch (error) {
      res.status(401).send({
        success: false,
        message: error.message,
      });
    }
  };


  export const validateRequest = (method) => {
    switch (method){
      case 'register': {
        return [
          body('name','name must be atleast 3 character').isLength({ min: 3 }),
          body('email','Enter a valid email').isEmail(),
          body('password','password must be atleast 4 character').isLength({ min: 4 }),
          body('contactNo','contactNo must be 10 number').isInt().isLength({ min: 10,max:10 }),
          body('gender','gender can not be null').notEmpty()
        ]
      }
      case 'login': {
        return [
          body('email','Enter a valid email').isEmail(),
          body('password','password must be atleast 4 character').isLength({ min: 4 }),
        ]
      }
      case 'update-user': {
        return [
          body('name','name must be atleast 3 character').optional().isLength({ min: 3 }),
          body('email','Enter a valid email').optional().isEmail(),
          body('contactNo','contactNo must be 10 number').optional().isInt().isLength({ min: 10,max:10 })
        ]
      }
      case 'addAnimal': {
        return [
          body('name','name can not be null').notEmpty(),
          body('type','type can not be null').notEmpty(),
          body('description','name must be atleast 8 character').isLength({ min: 8 }), 
          body('gender','gender can not be null').notEmpty(),
          body('age','age must be number').isInt().notEmpty(),
          body('colour','colour can not be null').notEmpty(),
          body('address','address can not be null').notEmpty(),
          body('city','city can not be null').notEmpty(),
          body('country','country can not be null').notEmpty(),
          body('photo','photo can not be null').notEmpty(),
        ]
      }
      case 'updateAnimal' : {
        return[
          body('description','name must be atleast 8 character').optional().isLength({ min: 8 }),
          body('age','age must be number').optional().isInt(),
        ]
      }
      case 'addInjuredAnimal': {
        return [
          body('name','name can not be null').notEmpty(),
          body('type','type can not be null').notEmpty(),
          body('injuries','type can not be null').notEmpty(),
          body('injuryDetail','name must be atleast 8 character').isLength({ min: 8 }),
          body('breed','breed can not be null').notEmpty(),
          body('gender','gender can not be null').notEmpty(),
          body('address','address can not be null').notEmpty(),
          body('city','city can not be null').notEmpty(),
          body('country','country can not be null').notEmpty(),
          body('photo','photo can not be null').notEmpty(),
        ]
      }
      case 'updateInjuredAnimal' : {
        return[
          body('injuriyDetail','name must be atleast 8 character').optional().isLength({ min: 8 }),
        ]
      }
    }
  }

  
  // const storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, file.originalname)
  //   }
  // })
  // export const upload = multer({storage:storage});

  