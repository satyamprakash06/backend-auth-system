import {Router} from "express";
import * as controller from "./auth.controller.js";
import validate from "../../common/middleware/validation.middleware.js";
import RegisterDto from "./dto/register.dto.js"
import loginDto from "./dto/login.dto.js"
import ForgotPasswordDto from "./dto/forgetPassword.dto.js"
import { authenticate } from "./auth.middleware.js";
import { upload } from "../../common/middleware/multer.middleware.js";

const router = Router()

router.post("/register", validate(RegisterDto), controller.register)

router.post("/login", validate(loginDto), controller.login)

router.post("/forgetpassword", validate(ForgotPasswordDto), controller.forgetPassword)

router.get("/getme", authenticate, controller.getme)

router.post("/logout", authenticate, controller.logout)

router.post("/refresh", controller.refresh)

router.get("/verify/:token", controller.verifyEmail)

router.post("/avatar", authenticate, upload.single("avatar"), controller.uploadAvatar)


export default router