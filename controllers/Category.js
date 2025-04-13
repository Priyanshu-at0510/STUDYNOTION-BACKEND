const Category=require("../models/Category");

//create tag handler function
exports.createCategory=async (req,res)=>{
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
        const categoryDetails=await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);
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
exports.showAllCategory=async (req,res)=>{
    try {
        const allTags=await Category.find({},{name:true,description:true});
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
