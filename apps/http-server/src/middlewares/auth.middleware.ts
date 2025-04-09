import { JWT_SECRET } from "@drawapp/backend-common/config";
import { NextFunction, Request, Response } from "express";
import  JWT, { JwtPayload }  from "jsonwebtoken";
declare global{
  namespace Express {
    interface Request{
      userId:string
    }
  }
}

const verifyJWT = (req:Request, res:Response, next:NextFunction) => {
const token = req.headers["authorization"]?.replace("Bearer ", "");
if(!token){
  res.status(422).json({message:"token not found"});
  return;
}
const decodeToken = JWT.verify(token, JWT_SECRET)as JwtPayload;
if(!decodeToken || !decodeToken.id){
  res.status(403).json({message:"invalid token"});
  return;
}
req.userId = decodeToken?.id;
next();
}

export {verifyJWT};