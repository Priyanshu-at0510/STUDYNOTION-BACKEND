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
        console.log("Inside show all category");
        const allCategory=await Category.find({},{name:true,description:true});
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

//category Page Detail
exports.categoryPageDetails=async (req,res)=>{
    try {
        const {categoryId}=req.body;
        console.log("printing Category Id :",categoryId);
        const selectCategory=await Category.findById(categoryId)
        .populate({
            path:"courses",
            match:{status:"publisher"},
            populate: "ratingAndReviews",
        })
        .exec();
        //validation->if category is not found
        if(!selectCategory){
            console.log("category Not Found");
            return res.status(404).json({
               success:false,
               message:"Category is not found",
            });
        }
        //if category is found but there is not course on that category
        if(selectCategory.courses.length === 0){
            console.log("No course found on the selected category");
            return res.status(404).json({
                success:false,
                message:"No course Found on Selected Category",
            });
        }
        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
            _id: { $ne: categoryId },
        })
        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            ._id
        )
            .populate({
            path: "courses",
            match: { status: "Published" },
            })
            .exec()
            //console.log("Different COURSE", differentCategory)
        // Get top-selling courses across all categories
        const allCategories = await Category.find()
            .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
                path: "instructor",
            },
            })
            .exec()
        const allCourses = allCategories.flatMap((category) => category.courses)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)
        // console.log("mostSellingCourses COURSE", mostSellingCourses)
        res.status(200).json({
            success: true,
            data: {
            selectedCategory,
            differentCategory,
            mostSellingCourses,
            },
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        });
    }
}