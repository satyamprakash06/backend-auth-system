import ApiError from "../../common/utils/api-error.js"
import {generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken} from "../../common/utils/jwt.utils.js"
import User from "./auth.model.js"
import {sendMail, sendVerificationEmail} from "../../common/config/email.js"
import crypto from "crypto"


const hashToken = (token)=>crypto.createHash("sha256").update(token).digest("hex");

const register = async ({name, email, password, role}) =>{
    const existing = await User.findOne({email})

    if(existing) throw ApiError.conflict("Email already Exist");

    const {rawToken, hashedToken} = generateResetToken()

    const user = await User.create({
        name,
        email,
        password,
        role,
        verificationToken:hashedToken
    })

    // TODO: send an email to user with token: resetPasswordToken

    try {
        await sendVerificationEmail(email, rawToken);
    }catch(error){
        console.error(error)
    }

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.verificationToken

    return userObj
}

const login = async ({email, password}) =>{
    const user = await User.findOne({email}).select("+password")

    if(! user) throw ApiError.unauthorized("Invalid Email or password")

        // somehow i will check password

        const isMatch = await user.comparePassword(password);
        if(!isMatch) throw ApiError.unauthorized("Invalid email or password");

    if(! user.isVerified){
        throw ApiError.forbidden("please verify your email before login");
    }
    
    const accessToken = generateAccessToken({id:user._id, role:user.role});
    const refreshToken = generateRefreshToken({id:user._id})

    // save into db

    user.refreshToken = hashToken(refreshToken)
    await user.save({validateBeforeSave:false})

    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    return{user:userObj, accessToken, refreshToken}
    }

const refresh = async (token)=>{
    if(!token) throw ApiError.unauthorized("Refresh token missing")
    
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if(!user) throw ApiError.unauthorized("User Not Found");
    if(user.refreshToken !== hashToken(token)) throw ApiError.unauthorized("Invalid Refresh Token");

    const accessToken = generateAccessToken({id:user._id, role:user.role});
    const refreshToken = generateRefreshToken({id:user._id})


    user.refreshToken = hashToken(refreshToken)
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}

}

const logout = async (userId)=>{
    await User.findByIdAndUpdate(userId, {refreshToken:null})
}

const forgetPassword = async (email)=>{
    const user = await User.findOne({email});
    if(!user) throw ApiError.notFound("Not Account With that Email");

    const {rawToken, hashedToken} = generateResetToken()
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() +15*60*1000

    await user.save({validateBeforeSave:false});

    // TODO: send reset email with rawToken

    return{message: "Reset link sent to your email"}

}

const getme = async (userId)=>{
    const user = await User.findById(userId)
    if(!user) throw ApiError.notFound("user not Available")
    return user;
};

const verifyEmail = async (token) =>{
    const hashedToken = hashToken(token);
    const user = await User.findOne({verificationToken:hashedToken}).select("+verificationToken");
    if(!user) throw ApiError.notFound("user not found");
    user.isVerified = true;
    user.verificationToken= undefined;
    await user.save({validateBeforeSave:false});
    return user;
};


export {register, login, refresh, logout, forgetPassword, getme, verifyEmail}
