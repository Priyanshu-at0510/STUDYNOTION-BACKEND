const express=require("express");
const router=express.Router();

const{
    updateProfile,
    deleteAccount,
    getAllUserDetails
}=require("../controllers/Profile");

const {auth}=require("../middlewares/auth")
//router 
router.delete("/deleteProfile",auth,deleteAccount);
router.put("/updateProfile",auth,updateProfile);
router.get("/getUserDetails",auth,getAllUserDetails);

module.exports=router;