const express=require('express')
const route=express.Router();
const multer=require('multer')
const theauth=require('../middelware/check')

const store=multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,'./img/')
    },
    filename:function(req,file,cb){
        var dat=Date.now();
        console.log(dat)
        cb(null,dat +file.originalname)
    }
})
const filefilter=(req,file,cb)=>{
    if(file.mimetype=='image/jpeg'||file.mimetype=='image/jpg'||file.mimetype=='image/png')
    {
    cb(null,true)
    }
    else{
        cb(null,false)
    }
}

const upload=multer({ storage:store,limits:{
    fileSize:1024*1024*2},fileFilter:filefilter})

const products=require('../model/productcol')



route.get('/',async(req,res)=>{

    const find=await products.find()
    .select("name price productimg")
    .then((data)=>{
        const ans={
            count:data.length,
            product:data,

          
      
        }
        res.status(200).json({ message:ans});
    
    })
    .catch((err)=>{res.status(404).json({ message:err});})
    
    

})

route.post('/',theauth,upload.single('productimage'),async(req,res)=>{
   
    console.log(req.file)
  
   
    try{
        const obj={
        
            name:req.body.name,
            price:req.body.price,
            productimg:req.file.path
        
        }
        const insert= await new products(obj).save()
        .then((data)=>{
            const ans={
                count:data.length,
                product:data,
                details:{
                    url:'http://localhost:4000/product/'+data.id
                }
          
            }
            res.status(200).json({ message:ans});
        
        })
        .catch((err)=>{res.status(404).json({ message:err});})
        // console.log(insert)
        // const post=await products.create(obj).then((doc)=>{console.log(doc)}).catch((err)=>{console.log(err)})
    // const post=await insert.save()
    // console.log("post"+insert)
    res.status(200).json({ "message":insert});
    
    }
    catch(err){
            console.log("err"+err)
    }
    console.log("inserted")

})

route.get('/:id',async(req,res)=>{
    var id=req.params.id;
    const find=await products.findById(id,'name price productimg')
    .then((data)=>{
        if(data){
        res.status(200).json({ message:data});
        }
        else{
            res.status(404).json({ message:"not valid id"});
        }
    })
    .catch((err)=>{res.status(404).json({ message:err});})

    res.status(200).json({ message:find});
    

})

route.patch('/:id',theauth,async(req,res)=>{
    var id=req.params.id;
    console.log("update")
    const updates={};
    for(const op of req.body)
    {
            updates[op.uname]=op.value;
            
    }
    const update=products.update({_id:id},{$set:updates})
    .then((data)=>{
     res.status(200).json({ message:"product patch byid",ans:data});
    })
    .catch((err)=>{res.status(404).json({ message:err});})
})

route.delete('/:id',theauth,async(req,res)=>{
    var id=req.params.id;
    console.log("delete")
    const del=await products.findByIdAndDelete(id)
    res.status(200).json({ message:"product delete byid",delete:del});

})


module.exports=route;
