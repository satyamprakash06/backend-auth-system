import multer from "multer";
import path from "path"
import fs from "fs";


if (!fs.existsSync("public/uploads")) {
  fs.mkdirSync("public/uploads", { recursive: true });
}

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


const fileFilter = (req, file, cb)=>{
  const allowed =["image/png","image/jpeg", "image/gig", "image/webp"]
  if(allowed.includes(file.mimetype)){
    cb(null, true)
  }
  else{
    cb(new Error("file type not Supported"), false)
  } 
 }

 export const upload = multer({
    storage,
     limits:{fileSize:1024*1024*2},
     fileFilter:fileFilter
});
