import { NextFunction, Request, Response } from "express"

export const asyncHandler = (requiredFn:(req:Request,res:Response,next:NextFunction)=>Promise<void>)=>{
return (req:Request,res:Response,next:NextFunction)=>{
  Promise.resolve(requiredFn(req,res,next)).catch(err => next(err))
}
}