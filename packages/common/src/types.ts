import {string, z} from "zod";

export const createUserSchema = z.object({
  username:string().min(3).max(50),
  password: string().min(8).optional(),
  fullName : string().min(3).optional(),
  email: string().email(),
  photo: string().optional()
});

export const signInSchema = z.object({
username: string().min(3).max(50),
password: string().min(8)
});

export const createRoomSchema = z.object({
  roomName : string().min(3).max(30)
});