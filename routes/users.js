const express=require('express')
const route=express.Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const user=require('../model/auth')



route.post('/signup',async(req,res)=>{
   
    console.log("signup")
  
   
    try{

        user.find({email:req.body.email}).then((doc)=>
        {
            if(doc.length >=1){
               return res.status(409).json({message:"same email exist"})
            }
            else
            {
                bcrypt.hash(req.body.password,10,async(err,hash)=>{
                    if(err){
                    res.status(500).json({error:err})
                }
                else{
                    const obj={
                        email:req.body.email,
                      password:hash
                    }      
                    const insert= await new user(obj).save().then((result) => {
                                res.status(200).json({result:result})
                            }).catch((err) => {
                                res.status(404).json({error:err})
                            });
                            
                }
                })
             
            
            }
        })
    }
    catch(err){
            console.log("err"+err)
    }
    console.log("inserted")

})


route.delete('/:userid',async(req,res)=>
{
        var userid=req.params.userid;
        const del=await user.deleteOne({_id:userid}).then((data)=>
        {
                res.status(200).json({message:data})
        }).catch((err)=>{
            console.log(err)
        })
        
            
        
        
})


route.post('/login',(req,res)=>
{
    var email=req.body.email
    const check= user.find({email:email})
    .then((data)=>
    {
        if(data.length < 1)
        {
            return res.status(401).json({message:"not an valied email"}) 
        }
        else{
            
               bcrypt.compare(req.body.password,data[0].password,(errs,bol)=>
               {
                   if(errs){
                   return res.status(402).json({message:errs})
                    }

                    if(bol)
                    {
                        const token=jwt.sign(
                            {email:data[0].email,
                            id:data[0]._id
                             },
                            'secret',
                            {
                                expiresIn:"1h"
                            }
                            
                        );

                        return res.status(200).json({message:token})
                    }
                     res.status(404).json({message:"check your password"})
               })

        }
    })
    .catch((err)=>
    {
        res.status(404).json({message:err})
    })


})

module.exports=route;