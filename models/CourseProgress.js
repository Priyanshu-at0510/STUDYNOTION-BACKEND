const mongoose=require("mongoose");

require("dotenv").config();

const courseProgress=new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    },
    completedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ]
});

module.exports=mongoose.model("courseProgress",courseProgress);