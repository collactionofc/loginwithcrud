
const mongooes=require('mongoose')



const check=new mongooes.Schema({
        
        
        email:{type:String,
                required:true,
                createIndexes:true,
                match:/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
                },
        password:{type:String,required:true}
});


module.exports=mongooes.model('user',check);