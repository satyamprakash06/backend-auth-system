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


export {register, login, logout, getme}