import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/userRoute.js";
import animalRouter from "./routes/animalRoute.js";
import injuerdAnimalRouter from "./routes/injuredAnimalRoute.js";

dotenv.config();

const app = express();

app.use(fileUpload({
    useTempFiles:true
}))
app.use(cors());
app.use(express.json());


app.use("/api/v1/users", userRouter);
app.use("/api/v1/animals", animalRouter);
app.use("/api/v1/injuredAnimals",injuerdAnimalRouter)

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);

        app.listen(8080, () =>
            console.log("Server started on port http://localhost:8080"),
        );
    } catch (error) {
        console.log(error);
    }
};

startServer();