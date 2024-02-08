import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import mongoose from "mongoose";
import login from "./controlers/login.js";
import webtoken from "./middleware/webtoken.js";

import createComment from "./controlers/comments/createComment.js";
import delComment from "./controlers/comments/delComment.js";
import { readComment } from "./controlers/comments/readComment.js";
import updateComment from "./controlers/comments/updateComment.js";

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

app.listen(8080, () => {
  console.log("API en écoute sur le port 8080");
});

app.get("/media/read", readMedia);
app.post("/media/create", [webtoken, fileUpload({createParentPath: true}), filesPayloadExists, fileExtLimiter(['.mkv', '.mp4', '.png', '.jpg']), fileSizeLimiter], createMedia);
app.put("/media/update/:id", webtoken, updateMedia);
app.delete("/media/delete/:id", delMedia);

app.post("/user/create", createUser);
app.delete("/user/delete/:id", webtoken, deleteUser);
app.put("/user/update/:id", webtoken, updateUser);
app.get("/user/read", readUser);

app.post("/comment/create/:id", webtoken, createComment);
app.delete("/comment/delete/:id", webtoken, delComment);
app.put("/comment/update/:id", webtoken, updateComment);
app.get("/comment/read", readComment);

app.post("/login", login);



export { app };
