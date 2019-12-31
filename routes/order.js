const express=require('express')
const route=express.Router();

const theauth=require('../middelware/check')
const order=require('../model/ordercol')
const product=require('../model/productcol')


route.get('/',async(req,res)=>{

    const find=await order.find()
    .then((data)=>{
        const ans={
            count:data.length,
            order:data
          
      
        }
        res.status(200).json({ message:ans});
    
    })
    .catch((err)=>{res.status(404).json({ message:err});})
    
    

})
route.post('/',theauth,async(req,res)=>{


    product.findById(req.body.productid)
    .then((products)=>{
        if(!products){
            return res.json({message:"id not found"})
        }
        const obj={
            quentity:req.body.quentity,
            product:req.body.productid
        }
        const insert=new order(obj)
        return insert.save()
    }).then(data=>{
        const ans={
            count:data.length,
            product:data,
            details:{
                url:'http://localhost:4000/order/'+data.id
            }
      
        }
        res.status(200).json({ message:ans});
    
    })
    .catch((err)=>{res.status(404).json({ message:err});});
    

})

route.get('/:id',async(req,res)=>{

    var id=req.params.id;
    const find=await order.findById(id,' quentity product')
    .then((data)=>{
        if(data){
        res.status(200).json({ message:data});
        }
        else{
            res.status(404).json({ message:"not valid id"});
        }
    })
    .catch((err)=>{res.status(404).json({ message:err});})

})
route.delete('/:id',theauth,async(req,res)=>{

    var id=req.params.id;
    console.log("delete")
    const del=await order.findByIdAndDelete(id)
    res.status(200).json({ message:"product delete byid",delete:del});

})




module.exports=route;
