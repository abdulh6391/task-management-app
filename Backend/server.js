import app from "./src/app.js"
import { connectToDb } from "./src/config/db.js";

connectToDb()

app.listen(process.env.PORT,()=>console.log("Server Started"));