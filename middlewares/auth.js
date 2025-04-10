const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");
//auth
exports.auth=async (req,res,next)=>{
    try {
        //extract token
        const token=req.cookies.token 
                     || req.bosy.token 
                     || req.header("Authorization").replace("Bearer ","");
        //if token missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }
        //verify the token
        try {
            const decode=await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        } catch (error) {
            console.log(err)
            return res.status(401).json({
                success:false,
                message:"Token is Invalid",
            })
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong ,While verifying the token",

        });
    }
}
//isStudent
exports.isStudent=async (req,res,next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for students"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User Role is not Matching",
        }); 
    }
}

//isInstructor
exports.isInstructor=async (req,res,next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Instructor"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User Role is not Matching",
        }); 
    }
}


//isAdmin
exports.isAdmin=async (req,res,next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected Route for Admin"
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User Role is not Matching",
        }); 
    }
}
