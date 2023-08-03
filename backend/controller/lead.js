import express, { response } from "express";
import util from "../helper/util";
import leadGenerator from  "../model/lead";
const router = express.Router();

// NEW LEAD DATA
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

// UPDATE LEAD DATA
router.patch("/update",async (request,response,next)=>{
 let object={
    uid:request.body.uid,
    name:request.body.name,
    email:request.body.email,
    contactNo:request.body.contactNo,
    country:request.body.country,
    description:request.body.description,
    status:request.body.status || true
 };
 const validatorkeys = Object.keys(object);
 if(!util.validateRequest(object, validatorkeys)){
      util.sendResponse(response, '', {
          message: "validation fail",
          code: 400
      })
 }
 else{
    leadGenerator.findOneAndUpdate(
        { uid:object.uid },
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

// GET ALL LEADS
router.get("/list", async (req, res, next) => {
    let query = [];
    let checkParams = Object.keys(req.query);
    checkParams.forEach(function(key) {
        query = query.length ? query :  [];
        if(req.query[key].length > 2) {
            query.push({
                [key]: { 
                    $regex: req.query[key], 
                    $options: 'i' 
                }
            });
        }
    });
    leadGenerator.find(query.length ? {$and: query} : {}).then(response => {
        util.sendResponse(res, response, {
            message: "Leads fetched successfully.",
            code: 200
        });
    }).catch(error => {
        util.sendResponse(res, error, {
            message: "Internal Server error.",
            code: 500
        });
    });
});

// Delete api
router.delete("/remove", async (req, res, next) => {
    let instance = {
        identifier : req.query.uid
    }
    const validator = Object.keys(instance);
    if(!util.validateRequest(instance, validator)){
        util.sendResponse(response, '', {
            message: "validation fail",
            code: 400
        })
    }
    else{
        leadGenerator.deleteOne({
            uid : instance.identifier
        }).then(response=>{
            if (response.deletedCount){
                util.sendResponse(res, response, {
                    message: "Lead deleted successfully.",
                    code: 200
                });  
            }
            else{
                util.sendResponse(res, response, {
                    message: "No Lead with this id found.",
                    code: 204
                });    
            }
        }).catch(error=>{
            util.sendResponse(res, error, {
                message: "Internal Server error.",
                code: 500
            });
        })
    }
})

module.exports=router;