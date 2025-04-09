import express, { Request, Response } from "express";
import {JWT_SECRET} from "@drawapp/backend-common/config";
const app = express();

app.use(express.json({
  limit:"30kb"
}))

app.use(express.urlencoded({
  extended:true,
}))

import userRoutes from "./routes/index.routes"
app.use("/api/v1/user", userRoutes);

app.get("/",(req:Request, res:Response)=>{
  res.send("Hello World!"+JWT_SECRET);
})

app.listen(4000, ()=>{
  console.log("Server is running on port 4000");
})