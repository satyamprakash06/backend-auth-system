import express from "express"
import authRoute from "./modules/auth/auth.route.js"
import cookieParser from "cookie-parser"
import multer from "multer";
import ApiResponse from "./common/utils/api-response.js";
import path from "path"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/auth", authRoute);

export default app