import { WebSocketServer, WebSocket } from "ws";
import JWT, { JwtPayload } from "jsonwebtoken";
import {JWT_SECRET} from "@drawapp/backend-common/config";
import {prismaClient} from "@drawapp/db/client";

const checkAuth = (token:string):string|null=>{
  if(!token){
    return null;
  }
const decodeToken = JWT.verify(token,JWT_SECRET) as JwtPayload;
if (!decodeToken || !decodeToken.id) {
  return null;
}
return decodeToken.id
}

interface User{
  ws: WebSocket,
  rooms: string[],
  userId : string,
}

const users: User[] = [];

const wss = new WebSocketServer({port : 8080});
//  setup ws connection
wss.on('connection',(ws,Request )=>{
const url = Request.url;

if(!url){
  return;
}

// check token Params 
const queryParams = new URLSearchParams(url.split("?")[1]);
const token = queryParams.get("token")||"";
const userId = checkAuth(token);

if(userId == null){
  ws.send(JSON.stringify({error:"unauthorized user"}))
  ws.close();
  return;
}

users.push({
  ws:ws,
  rooms: [],
  userId, 
})

// message controller

ws.on("message", async function message (data){
  if(!data){
    return;
  }
  let parsedData = JSON.parse(data as unknown as string);

  if (!parsedData.type) {
    console.log("Invalid message type");
    return;
  }
try {
  
    // ... rest of the code
    switch (parsedData.type) {
      case "join":{
        const user = users.find(x => x.ws === ws);
        if(!user){
          return;
        }
         user.rooms.push(parsedData.roomId);
      }
        break;
  
      case "leave":{
        const user = users.find(x => x.ws === ws);
        if(!user){
          return;
        }
         user.rooms = user.rooms.filter(x => x !== parsedData.roomId)
      }
        break;
  
      case "chat":{
        const roomId = parsedData.payload.roomId;
        const message = parsedData.payload.message;
  
        await prismaClient.chat.create({
          data:{
            message:message,
            roomId:roomId,
            userId:userId
          }
        })
  
        users.forEach((user)=>{
          if(user.rooms.includes(roomId)){
            user.ws.send(JSON.stringify({
              type:"chat",
              payload:{
                message:message,
                roomId,
                userId,
              }
            }))
          }
        })
      }
        break;
    
      default:
      console.log("please provide valid type")
        break;
    }
} catch (err) {
  console.log("Error message :- ", err)
}
       // handle disconnect
ws.on("close",()=>{
  console.log("Disconnected from server")
})

// handle Error
ws.onerror=(err)=>{
console.log("Error occuried", err)
}
})

})
