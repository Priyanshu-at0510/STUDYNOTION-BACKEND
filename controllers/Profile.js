const {Profile}=require("../models/Profile");
const {User}=require("../models/User");

//update profile
exports.updateProfile=async (req,res)=>{
    try {
        //get data
        const {dateOfBirth="",about="",contactNumber,gender}=req.body;
        //get user id
        const id=req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
               success:false,
               message:"All field Required",
            });
        }

        //find profile
        const userDetails= await User.findById(id); //user ki detail me profile ki id padi hai
        const profileId =userDetails.additionalDetails; //yha se profile ki id nikaal lenge
        const profileDetails=await Profile.findById(profileId); //profile id se profile Detail nikaal lenge
        //update profile
        
        profileDetails.dateOfBirth=dateOfBirth;
        profileDetails.contactNumber=contactNumber;
        profileDetails.gender=gender;
        profileDetails.about=about;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:"Profile Details are updated successfully",
            profileDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error while updating the profile"
        })
    }
}

//delete Account
exports.deleteAccount=async  (req,res)=>{
    try {
        //account id fetch karo
        const id=req.user.id;
        //validation
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"User of this ID does not exist on database"
            });
        }
        //delete profile 
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //delete user
        await User.findByIdAndDelete({_id:id});
        //return response
        return req.status(200).json({
            success:true,
            message:"User Account is deleted Successfully",
        });


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error while deleteing the profile"
        })
    }
}

exports.getAllUserDetails=async (req,res)=>{
    try {
        //get id
        const id=req.user.id;

        //validation and get User Details
        const userDetails=await User.findById(id).populate("additionalDetails").exec();
        
        //return response
        return res.status(200).json({
            success:true,
            message:"User Detail fetch successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error while fetching Detail of User"
        });
    }
}