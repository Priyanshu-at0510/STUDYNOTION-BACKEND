const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const bcrypt=require("bcrypt");

//resertPassword token
exports.resetPassword =async (req,res)=>{
   try {
    //fetch the email from req ki body
    const {email}=req.body;
    //check user for this email
    const user=await User.findOne({email});
    //if user is not present
    if(!user){
        return res.status(401).json({
            success:false,
            messgae:"User to this email is not Present"
        });
    }
    //generate token
    const token=crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails=await User.findOneAndUpdate({email:email},{
        token:token,
        resetPasswordExpires:Date.now() + 5*60*1000, 
        
    },{new:true});
    //create url
    const url=`http://localhoat:3000/update-password/${token}`
    //send mail containing the url
    await mailSender(email,
                    "Password Reset Link",
                    `password Reset Link : ${url}`);
    //return response
    return res.status(200).json({
        success:true,
        message:"Email sent for reset password link successfully,please check email and change password"
    })

   } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Something went wrong while sending reset password mail"
    })

   }
}

//reset Password

exports.resetPassword = async (req,res)=>{
    try {
        //fetch the data
        const {token,password,confirmPassword}=req.body;
        //validation
        if(password !== confirmPassword){
            return res.status(401).json({
                success:false,
                message:"both password field did not match"
            });
        }
        //get user details from db using token
        const userDetails=await User.findOne({token:token});
        //if no entry found ->invalid token || token ka time expires
        if(!userDetails){
            return res.status(403).json({
                success:false,
                messgae:"Token invalid"
            });
        }

        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(403).json({
               success:false,
               message:"Token is expired,Please regenerate The Token "
            });
        }
        //hash the password
        const hashedPassword=await bcrypt.hash(password,10);
        //update the password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset successfull"
        });
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            messgae:"Issue while reseting password"
        });
    }
}