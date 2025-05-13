const Course=require("../models/Course");
const Category=require("../models/Category");
const User=require("../models/User");
const uploadImageToCloudinary=require("../utils/imageUploader");

//create course handler function
exports.createCourse= async (req,res) => {
    try {
        //fetch the data
        const {courseName,courseDescription,whatYouWillLearn,price,category,tag:_tag}=req.body;
        //fetch the thumnail
        const thumbnail=req.files.thumbnailImg;
        const tag=JSON.parse(_tag);
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail || !tag.length){
            return res.status(400).json({
                success:false,
                message:"All fields required ,please fill all of them"
            });
        }
        //check for instructor
        const userId =req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log(instructorDetails);
        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Details not found",
            })
        }
        //TODO:verify that userId and instructorDetail._id are same or different

        //check given tag is valid or not
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Tag Details not found",
            });
        }
        //upload image to cloudinary
        const thumnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag,
            category:categoryDetails._id,
            thumbnail:thumnailImage.secure_url,
        });
        //add course entry into  user schema of instructor
        await User.findByIdAndUpdate(  
            { _id:instructorDetails._id} , //yha se hume user ki id mil jaigi
                                          // hum chahte hain ki us user ke andar course ke array me iski id store karna chahte hain\
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true}
        );

        //update the Category schema
        await Category.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    category:newCourse._id,
                }
            },
            {new:true}
        );

        return res.status(200).json({
            success:true,
            message:"New course created successfully,",
            data:newCourse,
        });




    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create Course",
            error:error.message,
        })
    }
};
 


//fetch all curses || get all course handler function
exports.getAllCourses=async (req,res)=>{
    try {
        
        const allCourses=await Course.find({},{courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnrolled:true,
                                                })
                                                .populate("instructor")
                                                .exec(); 
        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfully",
            data:allCourses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to get All course",
            error:error.message,
        })
    }
}

//get courseDetails
exports.getCourseDeatils=async (req,res)=>{
    try {
        //get Id
        const {courseId}=req.body;
        //find course detail
        const courseDetails=await courseId.find(
                                    {_id:courseId})
                                    .populate(
                                        {
                                            Path:"instructor",
                                            populate:{
                                                path:"additional Details",
                                            }
                                        }
                                    )
                                    .populate("category")
                                    .populate("ratingAndReviews")
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection"
                                        }
                                    })
                                    .exec();
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not found the course with courseId ${courseId}`,
            })
        }
        //return response
        return res.status(200).json({
            success:true,
            message:"course details fetch successfully",
            data:courseDetails,
        })
        
    } catch (error) {
        console.error(error);
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}