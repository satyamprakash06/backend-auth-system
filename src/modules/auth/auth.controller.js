import * as authservice from "./auth.service.js"
import ApiResponse from "../../common/utils/api-response.js"


const register = async (req, res)=>{
    const user = await authservice.register(req.body)
    ApiResponse.created(res, "Registration Success", user)
}

const login = async(req, res)=>{
  const {user, accessToken, refreshToken} =  await authservice.login(req.body);
  res.cookie("refreshToken", refreshToken,{
    httpOnly:true,
    secure:true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken,{
    httpOnly:true,
    secure:true,
    maxAge: 15 * 60 * 1000
  })

  ApiResponse.ok(res, "Login Successful",{user, accessToken})

}

const logout = async (req, res)=>{
  await authservice.logout(req.user.id);
  res.clearCookie("refreshToken", "accessToken");

  ApiResponse.ok(res, "Logout Successful");
}

const getme = async (req, res)=>{
  const user = await authservice.getme(req.user.id)
  ApiResponse.ok(res, "User Profile", user);
}

const forgetPassword = async (req, res)=>{
      await authservice.forgetPassword(req.body.email);
      ApiResponse.ok(res, "If this email exists you will receive a reset link")
}


const refresh = async (req, res) => {
    const token = req.cookies.refreshToken

    const { accessToken, refreshToken } = await authservice.refresh(token)

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    })

     res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000             // 15 minutes
    })

    ApiResponse.ok(res, "Token refreshed successfully", { accessToken })
  }

  const verifyEmail = async (req, res) => {
    const { token } = req.params

    await authservice.verifyEmail(token)

    ApiResponse.ok(res, "Email verified successfully. You can now login.")
}



export {register, login, logout, getme, forgetPassword, refresh, verifyEmail}