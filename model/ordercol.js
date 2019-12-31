
const mongooes=require('mongoose')



const order=new mongooes.Schema({
        
        product:{type:mongooes.Schema.Types.ObjectId,ref:'product',required:true},
        quentity:{type:Number,default:1},

});


module.exports=mongooes.model('order',order);