const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,

    }
});

//a function->to send mail
async function sendVerificationEmail(email,otp){
    try {
        const mailResponse=await mailSender(email,"verification email from StudyNotion",otp);
        console.log("Email send successfully",mailResponse);
    } catch (error) {
        console.log("error occur while sending mails :" ,error);
    }
}
//now using the pre middleware
OTPSchema.pre("save",async function(next){  //here we use pre middleware bcs we want to verify its profile before saving the data in DB
    await sendVerificationEmail(this.email,this.otp);
    next();
})
module.exports=mongoose.model("OTP",OTPSchema);
