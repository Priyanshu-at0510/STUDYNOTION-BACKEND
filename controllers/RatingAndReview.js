const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const User=require("../models/User");
const { default: mongoose } = require("mongoose");

//createRating
exports.createRating=async(req,res)=>{
    try {
        //get user id
        const userId=req.user.id;
        //fetch data from reqBody
        const {rating,review,courseId}=req.body;
        //check if user is enrolled or not
        const CourseDeatils=await Course.findOne(
                                        {_id:courseId,
                                        studentsEnrolled:{$elemMatch:{$eq:userId}},
                                    });
        //validate
        if(!CourseDeatils){
            return res.status(400).json({
                success:false,
                message:"Student is not enrolled in course"
            })
        }
        //check if user already reviewed the class
        const alreadyReviewed=await RatingAndReview.findOne({
                                      user:userId,
                                      course:courseId,
                                    });
       
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"student is already reviewed this course",
            });
        }
        //create rating and review
        const ratingReview=await RatingAndReview.create({
                                      rating,review,
                                      course:courseId,
                                      user:userId
        })
        //update course with this rating/review
        const updatedCourseDetails=await Course.findByIdAndUpdate({_id:courseId},
                                    {
                                        $push:{
                                           ratingAndReviews:ratingReview._id,
                                        }
                                    },
                                {new:true});
        console.log(updatedCourseDetails); 
        //return response
        return res.status(200).json({
            success:true,
            message:`rating and review successfully ${ratingReview}`,
            ratingReview,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//getAverageRating
exports.getAverageRating=async (req,res)=>{
    try {
        //get course Id
        const {courseId}=req.body;
        //calculate average rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course: mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating" },
                }       
            }
        ])
        //return rating
        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }
        //if no rating review exists
        return res.status(200).json({
               success:true,
               message:"Average Rating is 0 ,no rating given till now",
               averageRating:0,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


//getAllRating