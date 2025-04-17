const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const {mongoose} = require("mongoose");

//capture the payment and initiate the razorpay order
exports.capturePayment=async (req,res)=>{
        //get courseId and UserId
        const {course_id}=req.body;
        const userId=req.user.id;
        //validation
        //valid CourseId,
        if(!course_id){
            return res.status(400).json({
                success:false,
                message:"Please Provide Valid Course ID",
            });
        }
        //valid CourseDetail
        let course;
        try {
            course=await Course.findById(course_id);
            if(!course){
                return res.status(400).json({
                    success:false,
                    message:"Could not found the course",
                })
            }
            //user already pay for the same course
            const uid=new mongoose.Types.ObjectId(userId) //converting the user id into objectId type
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).jaon({
                   success:false,
                   message:"Student is already enrolled"
                });
            }


        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
       
        //order create karo
        const amount=course.price;
        const currency="INR";
        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId:userId,
            }
        };

        try {
            //initiate the payment using razorpay
            const paymentResponse=await instance.orders.create(options);
            console.log(paymentResponse);

            //return response
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currency:paymentResponse.currency,
                amount:paymentResponse.amount,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:"Could not initiate Order",
            });
    }
    
};