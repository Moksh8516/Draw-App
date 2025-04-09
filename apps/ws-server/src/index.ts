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

// handle Message
ws.on("message",async(message)=>{
  let parsedData;
  if(typeof message !== "string"){
    parsedData = JSON.parse(message.toString())
  }else{
    parsedData = JSON.parse(message)
  }
  // switch case
  switch (parsedData.type) {
    case "join":{
      const user = users.find(x => x.ws === ws)
      if(!user){
        return;
      }
      user?.rooms.push(parsedData.roomId)
      break;
    }  
    case "chat":{
      // find room
      const roomId = parsedData.roomId;
      const message = parsedData.message;
       await prismaClient.chat.create({
        data:{
          roomId: Number(roomId),
          message,
          userId
        }
       })

       users.forEach((user)=>{
        if(user.rooms.includes(userId)){
          user.ws.send(JSON.stringify({
            type:"chat",
            message:message,
            roomId
          }))
        }
       })
      break;
    }
    case "leave":{
      const user = users.find(x => x.ws === ws);
      if(!user){
        return;
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.room)
    }
      break;
  
    default:
      console.log('Unknown message type');
  }
})

// handle disconnect
ws.on("close",()=>{
  console.log("Disconnected from server")
})

// handle Error
ws.onerror=(err)=>{
console.log("Error occuried", err)
}
})
