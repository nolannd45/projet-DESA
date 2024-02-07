import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import login from "./controlers/login.js";
import webtoken from "./middleware/webtoken.js";
import createUser from "./controlers/user/createUser.js";
import deleteUser from "./controlers/user/deleteUser.js";
import updateUser from "./controlers/user/updateUser.js";
import { readUser } from "./controlers/user/readUser.js";
import { readMedia } from "./controlers/media/readMedia.js";
import createMedia from "./controlers/media/createMedia.js";
import updateMedia from "./controlers/media/updateMedia.js";
import delMedia from "./controlers/media/delMedia.js";
import filesPayloadExists from "./middleware/filesPayloadExists.js";
import fileExtLimiter from "./middleware/fileExtLimiter.js";
import fileSizeLimiter from "./middleware/fileSizeLimiter.js";
import "dotenv/config";
import fileUpload from 'express-fileupload';

const app = express();
const mongodbUri = process.env.MONGODB_URI;

//const db = new MongoClient(mongodbUri);

mongoose
  .connect(mongodbUri)
  .then(() => console.log("Connection à la base de données OK"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("API en écoute sur le port 3000");
});

app.get("/media/read", readMedia);
app.post("/media/create", [webtoken, fileUpload({createParentPath: true}), filesPayloadExists, fileExtLimiter(['.mkv', '.mp4', '.png', '.jpg']), fileSizeLimiter], createMedia);
app.put("/media/update/:id", webtoken, updateMedia);
app.delete("/media/delete/:id", delMedia);

app.post("/user/create", createUser);
app.delete("/user/delete/:id", webtoken, deleteUser);
app.put("/user/update/:id", webtoken, updateUser);
app.post("/user/read", readUser);

app.post("/login", login);



export { app };
