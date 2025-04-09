import { Router } from "express";
import { chats, createRoom, fetchRoom, siginUp, signIn } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
const router:Router = Router();

router.post("/signup", siginUp);
router.post("/signin", signIn);
router.post("/room", verifyJWT, createRoom);
router.post("/room/:slug", verifyJWT, fetchRoom);
router.post("/room/:roomId", verifyJWT, chats);

export default router;