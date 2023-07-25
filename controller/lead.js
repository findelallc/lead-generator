import express, { request, response }  from "express";
import util from "../helper/util";
import leadGenerator from  "../model/lead";
const router=express.Router();

router.post("/new",async (req,response,next)=>{
   let request={
    name:req.body.name,
    email:req.body.email,
    contactNo:req.body.contactNo,
    country:req.body.country,
    description:req.body.description,
    status:true
   };
   const validatorkeys=Object.keys(request);
   if(!util.validateRequest(request,validatorkeys)){
        util.sendResponse(response,'',{
            message:"validation fail ",
            code:400
        })
   }
   else{
        leadGenerator(request).save().then(()=>{
            util.sendResponse(response,'',{
                message:"lead added successfully ",
                code:200
            })
        })
        // response.status(200).json({
        //     message:"Api triggered",
        //     result:a
        // })
    }
})
module.exports=router;