import express, { request, response }  from "express";
const router=express.Router();

router.post("/new",async (req,response,next)=>{
    const a=req.body.value*req.body.value;
    response.status(200).json({
        message:"Api triggered",
        result:a
    })
})
module.exports=router;