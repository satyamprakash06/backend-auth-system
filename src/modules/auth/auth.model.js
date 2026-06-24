import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        maxlength:50,
        required:[true, "name is required"]
    },

     email:{
        type:String,
        trim:true,
        required:[true, "Email is required"],
        unique:true,
        lowercase:true
    },
    password:{
        type: String,
        required:[true, "password id required"],
        minlength:8,
        select:false,

    },
    role:{
        type: String,
        enum:["customer", "seller", "admin"],
        default:"customer",
    },
    isVerified:{
        type:Boolean,
        default:false
    },

    avatar:{
        type:String,
        default:false
    },


    verificationToken:{type:String, select:false},
    refreshToken:{type:String, select:false},
    resetPasswordToken:{type:String, select:false},
    resetPasswordExpires:{type:Date, select:false},
},{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function(clearTextPassword){
    return await bcrypt.compare(clearTextPassword, this.password)
};



export default mongoose.model("User", userSchema)