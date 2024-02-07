import { model, Schema } from "mongoose";

const MediaSchema = new Schema(
  {
    nomFichier: String,
    lienFichier: String,
    idUtilisateur:String,
    user:String,
    titre : String,
    desc : String
  },
  { timestamps: true }
);



export default model("Media", MediaSchema);