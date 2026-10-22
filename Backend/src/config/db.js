import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectToDb()
{
    await mongoose.connect(config.URL)
    .then(()=>console.log("Mongo DB Connected"))
}