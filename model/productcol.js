
const mongooes=require('mongoose')



const pro=new mongooes.Schema({
        
        name:String,
        price:Number,
        productimg:{type:String,required:true}
});


module.exports=mongooes.model('product',pro);