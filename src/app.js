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





// file upload using multer

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext)
  }
})

const upload = multer({storage, limits:{
  fileSize:1024*1024*2
},
 fileFilter:(req, res, cb)=>{
  const allowed =["image/png","image/jpeg", "application/pdf"]
  if(allowed.includes(file.mimetype)){
    cb(null, true)
  }
  else{
    cb(new Error("file type not Supported"), false)
  } 
 }
});

app.post("/upload", upload.single("files"), (req, res) => {
    console.log(req.files);
    ApiResponse.ok(res, "files Uploded");
})



app.use("api/auth", authRoute);

export default app