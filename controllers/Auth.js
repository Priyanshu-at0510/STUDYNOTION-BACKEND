const User=require("../models/User");
const OTP=require("../models/OTP");
const Profile=require("../models/Profile");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();
//sendOTP
exports.sendOtp=async (req,res)=>{
   try {
    //fetch email from req ki body
    const {email}=req.body;
    //check if user already exist
    const checkUserPresent=await User.findOne({email});
    //if user already exists then return a response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"user already exists"
        });
    }
    //generate otp
    var otp=otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        specialChars: false,
        digits:true,
        lowerCaseAlphabets:false
    });
    console.log("otp generated :",otp);

    //check unique otp or not
    let result=await OTP.findOne({otp:otp});
    //if otp is found in database then generate new otp again
    while(result){
        otp=otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            specialChars: false,
            digits:true,
            lowerCaseAlphabets:false
        });
        result=await OTP.findOne({otp:otp});
    }
    const otpPayload={email,otp};
    //create an entry for otp
    const otpBody =await OTP.create(otpPayload);
    console.log(otpBody);
    
    //return response successfully 
    res.status(201).json({
        success:true,
        message:"OTP send successfully",
        otp,
    });
    
   } catch (error) {
     console.log(error);
     return res.status(500).json({
        success:false,
        message:error.message,
     })
   }
};


//signup
exports.signup=async (req,res)=>{
    try {
        //fetch the deta from req ki body
        const {
            firstName,
            lastName,
            email,
            accountType,
            password,
            confirmPassword,
            contactNumeber,
            otp
        }=req.body;
        //validate kar lenge
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required",
            })
        }
        //2 password ko match kar lenge
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword value does not match,please verify again"
            });
        }
        //check user already exist
        const checkUserPresent=await User.findOne({email});
        //if user alrdy exist then say him/her to login ,not signup
        if(checkUserPresent){
            return res.status(400).json({
                success:false,
                message:"User is Already registered,please Login"
            });
        }
        //find the most recent otp
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        //validate otp
        if(recentOtp.length == 0){
            //OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP not found"
            });
        }else if(otp !== recentOtp.otp){
            //otp not matched
            return res.status(400).json({
                success:false,
                messgae:"OTP not matched",
            });
        }
        //hash the password 
        const hashedPassword=await bcrypt.hash(password,10);
        
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        });

        //entry created on db
        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumeber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName }`,
        });

        //return response
        return res.status(200).json({
            success:true,
            message:"User is registered successfully",
            user,
        })

          
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User can not be Registered,Please Try again"
        })
    }
}

//login
exports.login=async (req,res)=>{
    try {
        //fetch the data from req. ki body
        const {email,password}=req.body;
        //validate
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"please fill all the required detail"
            });
        }
        //check user is exist or not 
        const user=await User.findOne({email}).populate("additionalDetails");
        //if user is not present
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Please SignUp,user is not registered"
            });
        }
        //validate the password
        if(await bcrypt.compare(password,user.password)){
          const payload={
            email:user.email,
            id:user._id,
            accountType:user.accountType
          }
          //generate the jwt token
          const token=jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:"2h",
          })
          user.token=token;
          user.password=undefined;
          //create cookie and send response
          const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true
          }
          res.cookie("token", token, options).status(200).json({
          success:true,
          token,
          user,
          message:"Logged in Successfully"
        });
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is Incorrect"
            });
        }
        

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure,please verify again"
        })
    }
}


//change password
exports.changePassword=async (req,res)=>{
    try {
        
    } catch (error) {
        
    }
}
