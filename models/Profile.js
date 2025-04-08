const mongoose=require("mongoose");

require("dotenv").config();

const profileSchema=new mongoose.Schema({
    gender:{
        type:String,
        required:true
    } ,
    dateOfBirth:{
        type:String,
        required:true,
    },
    about:{
        typr:String,
        trim:true
    },
    contactNumber:{
        type:Number,
        trim:true
    }
});


module.exports=mongoose.model("Profile",profileSchema);