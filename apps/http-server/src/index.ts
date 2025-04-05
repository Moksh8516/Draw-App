import express, { Request, Response } from "express";
import {JWT_SECRET} from "@drawapp/backend-common/config";
const app = express();
app.get("/",(req:Request, res:Response)=>{
  res.send("Hello World!"+JWT_SECRET);
})
app.listen(4000)