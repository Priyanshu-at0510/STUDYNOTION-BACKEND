const express=require("express");
const router=express.Router();

//controller se instance le liye
const {
    login,
    signup,
    sendOtp,
    changePassword
}=require("../controllers/Auth");

const {
    resetPasswordToken,
    resetPassword
}=require("../controllers/ResetPassword");

const {auth}=require("../middlewares/auth");

//authentication route

//Route for login
router.post("/login",login);
//route for signup
router.post("/signup",signup);
//route for sending otp to the user email
router.post("/sendOtp",sendOtp);
//rote for changing the password
router.post("/changepassword",changePassword);

//reset password route
router.post("/reset-password-token",resetPasswordToken);
router.post("/reset-password",resetPassword);

module.exports=router;

