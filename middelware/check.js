const jwt=require('jsonwebtoken')

module.exports=(req,res,next)=>
{
    try{
        const token=req.headers.authorization;
        console.log(token)
    const decode=jwt.verify(token,'secret')
    req.datas=decode
    next()
    }
    catch(err)
    {
        res.json({err:err})
    }

}