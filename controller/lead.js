import express, { response } from "express";
import util from "../helper/util";
import leadGenerator from  "../model/lead";
const router = express.Router();

router.post("/new", async (req,response,next)=>{
   let request={
        name:req.body.name,
        uid:parseInt(Date.now()/1000),
        email:req.body.email,
        contactNo:req.body.contactNo,
        country:req.body.country,
        description:req.body.description,
        status:true
   };
   const validatorkeys = Object.keys(request);
   if(!util.validateRequest(request, validatorkeys)){
        util.sendResponse(response, '', {
            message: "validation fail",
            code: 400
        })
   }
   else{
        leadGenerator(request).save().then((result)=>{
            util.sendResponse(response, result, {
                message:"lead added successfully",
                code:201
            })
        })
    }
});

router.patch("/update",async (request,response,next)=>{
 let object={
    identifier:request.body.uid,
    name:request.body.name,
    email:request.body.email,
    contactNo:request.body.contactNo,
    country:request.body.country,
    description:request.body.description,
    status:request.body.status
 };
 const validatorkeys = Object.keys(object);
 if(!util.validateRequest(object, validatorkeys)){
      util.sendResponse(response, '', {
          message: "validation fail",
          code: 400
      })
 }
 else{
    console.log(object.identifier)
    leadGenerator.findOneAndUpdate(
        { uid:object.identifier },
        {
            status:object.status,
            name:object.name,
            email:object.email,
            contactNo:object.contactNo,
            country:object.country,
            description:object.description
        }
    ).then(result=>{
        if(result&&Object.keys(result).length){
            util.sendResponse(response, '', {
                message: "lead updated successfully",
                code: 200
            })  
        }
        else{
            util.sendResponse(response, {}, {
                message: "request not exist",
                code: 404
            }) 
        }
    }).catch(error=>{
        util.sendResponse(response, error, {
            message: "internal server error",
            code: 500
        })   
    })
    
 }
})

module.exports=router;