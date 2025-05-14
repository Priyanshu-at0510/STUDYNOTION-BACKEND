const express=require("express");
const router=express.Router();

const {
    login,
    signup,
    sendotp,
    changePassword
}=require("../controllers/Auth");

const {
    resetpasswordToken,
    resetPassword
}=require("../controllers/ResetPassword");

const {auth}=require("../middlewares/auth");

//authentication route

//Route for login
router.post("/login",login);
//route for signup
router.post("/signup",signup);
//route for sending otp to the user email
router.post("/sendotp",sendotp);
//rote for changing the password
router.post("/changepassword",changePassword);

//reset password route
router.post("/reset-password-token",resetpasswordToken);
router.post("/reset-password",resetPassword);

module.exports=router;

