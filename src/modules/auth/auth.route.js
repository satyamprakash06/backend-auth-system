import {Router} from "express";
import * as controller from "./auth.controller.js";
import validate from "../../common/middleware/validation.middleware.js";
import RegisterDto from "./dto/register.dto.js"
import loginDto from "./dto/login.dto.js"
import { authenticate } from "./auth.middleware.js";

const router = Router()

router.post("/register", validate(RegisterDto), controller.register)

router.post("/login", validate(loginDto), controller.login)

router.get("/getme", authenticate, controller.getme)

router.post("/logout", authenticate, controller.logout)


export default router