const Section=require("../models/Section");
const Course=require("../models/Course");

exports.createSection=async (req,res)=>{
    try {
        //fetch the data
        const {sectionName,courseId}=req.body;
        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success:false,
                message:"All field Required",
            });
        }
        //create section
        const newSection=await Section.create({sectionName});
        //update course with section objectId
        const updatedCourseDetails=await Course.findByIdAndUpdate(
                                            courseId,
                                            {
                                                $push:{
                                                    courseContent:newSection._id,
                                                }
                                            },
                                            {new:true}
                                        )
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection",
                                            }
                                        });
        return res.status(200).json({
            success:true,
            message:"section created Successfully",
            updatedCourseDetails,
        });
         
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create section,please try again",
            error:error.message
        });
    }
}

//section ko update karna hai
exports.updateSection=async (req,res)=>{
    try {
        //data input
        const {sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(401).json({
                success:false,
                message:"All field required",
            })
        }
        //update data
        const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true });
        //return response
        return res.status(200).json({
            success:true,
            message:"section updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to update section,please try again",
            error:error.message
        });
    }
};

//delete the section
exports.deleteSection=async (req,res)=>{
    try {
        //fetch the data // get ID-->assuming that we are sending Id in params
        const {sectionId}=req.params;
        //validate 
        if(!sectionId){
            return res.status(401).json({
                success:false,
                message:"All field required",
            })
        }
        const section=await Section.findById(sectionId);
        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found",
            })
        }
        //remove the sectionId from course.courseContent
        await Course.findByIdAndUpdate(
            section.sectionId,
            {
                $pull:{
                    courseContent:sectionId,
                }
            }
        );
        //delete the section
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"section deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to delete section,please try again",
            error:error.message
        });
    }
}