import { Router } from "express";
import {userPremium, changeRol} from "../controllers/users.controller.js";
import { passportCall } from "../middleware/passportCall.js";

const router = Router()

router.put('/premium/:uid', passportCall('jwt'), userPremium);
router.get('/premium', passportCall('jwt'), changeRol);



export default router;