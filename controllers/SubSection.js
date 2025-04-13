const SubSection=require("../models/SubSection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

require("dotenv").config();
//create subSectio
exports.createSubSection=async (req,res)=>{
    try {
        //fetch the data
        const {title,timeDuration,description,sectionId}=req.body;
        //extract file/video
        const video=req.files.videoFile;
        //validation
        if(!title || !timeDuration || !description || !sectionId || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are Required"
            });
        }
        //upload video to cloudinary
        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create sub-Section
        const subSectionDetails=await SubSection.create(
            {
                title:title,
                timeDuration:timeDuration,
                description:description,
                videoUrl:uploadDetails.secure_url,
            }
        )
        //update the section with this subsection ObjectId
        const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
                                                    {
                                                        $push:{
                                                            subSection:subSectionDetails._id,
                                                        }
                                                    },
                                                    {new:true}
        )
        .populate("SubSection");
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub-Section created successfully",
            updatedSection,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Intrenal error occurs while creating sub-section",
        });
    }

}

//update subsection
exports.updateSubSection=async (req,res)=>{
    try {
        //fetch the data
        const {subSectionId,title,description,timeDuration,video}=req.body;
        //fetch the updated file
        const file=req.files ?req.files.videoFile : null;
        //validation
        if(!title || !timeDuration || !description || !subSectionId || !file){
            return res.status(400).json({
                success:false,
                message:"All fields are Required"
            });
        }
        //upload data
        const uploadDetails=await uploadImageToCloudinary(file,process.env.FOLDER_NAME);
        //update data
        const updatedDetails=await SubSection.findByIdAndUpdate(
            subSectionId,
            {
                title,
                description,
                timeDuration,
                videoUrl:uploadDetails.secure_url,
            },
            {new:true},
        )
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub-Section updated successfully",
            updatedDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Intrenal error occurs while updating sub-section",
        });
    }
}

//delete subSection

exports.deleteSubSection=async (req,res)=>{
    try {
        //fetch the id of subsection
        const {subSectionId}=req.params;
        //validation
        if(!subSectionId){
            return res.status(404).json({
                 success:false,
                message:"valid sub-section Id is  Required"
            });
        }
        //remove the sub-sectionId from section ke content se
        await Section.findByIdAndUpdate(
            {subSection:subSectionId},
            {
                $pull:{
                    subSection:subSectionId,
                }
            }

        )

        //delete the sub-section
        await SubSection.findByIdAndDelete(subSectionId);
        //return response
        return res.status(200).json({
            success:true,
            message:"Sub-Section deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Intrenal error occurs while deleting sub-section",
        });
    }
}