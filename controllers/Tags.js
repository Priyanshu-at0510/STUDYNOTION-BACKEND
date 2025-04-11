const Tag=require("../models/Tags");

//create tag handler function
exports.createTag=async (req,res)=>{
    try {
        //fetch the data from req ki body
        const {name,description}=req.body;
        //validate
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All field required,try again"
            });
        }
        //entry created at database  
        const tagDetails=await Tag.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);
        return res.status(200).json({
            success:true,
            message:"Entry of tag is created successfully at DB"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

//get allTags handler function
exports.showAllTags=async (req,res)=>{
    try {
        const allTags=await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success:true,
            message:"All tags return successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        });
    }
}
