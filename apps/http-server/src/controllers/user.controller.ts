import { asyncHandler } from "../utils/asyncHandler";
import {createUserSchema, signInSchema, createRoomSchema} from "@drawapp/common/types"
import {prismaClient} from "@drawapp/DB/client";
import { JWT_SECRET } from "@drawapp/backend-common/config";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const generateToken = (user:any)=>{
  const token = jwt.sign({
      id:user.id,
     username:user.userName,
   },JWT_SECRET);
   return token;
}

export const siginUp = asyncHandler(async(req, res)=>{
const result = createUserSchema.safeParse(req.body);
if(!result.success) {
  const errorMessages = result.error.issues.map((issue) => `${issue.path[0]}: ${issue.message}`);
  res.status(411).json({message: "Input field required", errorMessages});
  return;
}

try {
  const {email, password, username} = result.data;
  const hashedPassword = password ? await bcrypt.hash(password,10): "";
  const user  = await prismaClient.user.create({
    data: {
      userName:username,
      email,
      password : hashedPassword,
    }
  })
  if(!user){
    res.status(500).json({message: "Failed to create user"});
    return;
  }
  res.status(201).json({message:"SignUp user"});
} catch (error) {
  res.status(409).json({message: "username already exist", error});
  return;
}
})

export const signIn = asyncHandler( async(req,res)=>{
  const result =  signInSchema.safeParse(req.body);

  if(!result.success) {
    const errorMessages = result.error.issues.map((issue) => `${issue.path[0]}: ${issue.message}`);
    res.status(411).json({message: "Input field required", errorMessages});
    return;
  }
  const {username, password} = result.data;
  if(!username){
    res.status(411).json({message: "username is required"});
    return;
  }

  const existingUser = await prismaClient.user.findUnique({
    where:{
      userName:username
    },
  })
  if(!existingUser){
    res.status(401).json({message:"Invalid user"});
    return;
  }
  // @ts-ignore
  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if(!isValidPassword){
    res.status(401).json({message: "Invalid password"});
    return;
  }

  let loggedInUser = await prismaClient.user.findFirst({where:{
    userName:username
  },select:{
    id:true,
    userName:true,
    email:true,
    photo:true,
  }});

  const token = generateToken(existingUser)
  res.status(200).json({token, user:loggedInUser, message:"user login"})
})

export const createRoom = asyncHandler(async(req,res)=>{
const result = createRoomSchema.safeParse(req.body)
if(!result.success){
  const errorMessages = result.error.issues.map((issue) => `${issue.path[0]}: ${issue.message}`);
  res.status(411).json({message: "Input field required", errorMessages});
  return;
}
const {roomName} = result.data;
try {
  const room = await prismaClient.room.create({
    data:{
      slug:roomName,
      adminId: req?.userId
    }
  })
  if(!room){
    res.status(500).json({message: "Failed to create room"});
    return;
  }
  res.status(201).json({message: "Room created successfully", room})
} catch (error) {
  res.status(409).json({message:"Room name already exist", error})
}
})

export const fetchRoom = asyncHandler(async(req,res)=>{
  const {roomname} = req.params
  const room = await prismaClient.room.findUnique({
    where:{
      slug:roomname
    }
  })
  if(!room){
    res.status(404).json({message: "Room not found"})
    return;
  }
  res.status(200).json({message:"fetch room data", room})
})

export const chats = asyncHandler(async ( req, res)=>{
  const roomId = Number(req.params.roomId);
  const chatMessage = await prismaClient.chat.findMany({
    where: {
      roomId,
    },
    take:50,
    orderBy:{
      createdAt: "desc"
    }
  })
  if(!chats){
    res.status(404).json({message: "No chats found"});
    return;
  }
  res.status(200).json({message:"fetch all chats", chatMessage})
})