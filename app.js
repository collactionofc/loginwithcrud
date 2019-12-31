const express = require('express')
const app = express()
const body=require('body-parser')
const morgan=require('morgan')
const mongoose=require('mongoose')



const product=require('./routes/product')
const order=require('./routes/order')
const user=require('./routes/users')

const url="mongodb://localhost:27017/Test"
const port = process.env.PORT || 4000

mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology:true}).then(()=>{console.log("done")}).catch((err)=>{console.log(err)})
app.use(morgan('dev'))
app.use(body.json())
app.use((req,res,next)=>{
        res.header("Access-Control-Allow-Origin","*");
        res.header("Access-Control-Allow-Headers","*");

        if(req.method==='OPTIONS')
        {
            res.header("Access-allow-methods","GET,POST,PATCH,DELETE,PUT")
            return res.status(200).json({});
        }
        next();
})
app.use('/img',express.static('img'))
app.use('/product',product)
app.use('/order',order)
app.use('/user',user)
app.get('/', (req, res) => {
    res.status=200
    res.send('Hello World!')
    })
// app.all('/*',(req,res)=>res.send('page not found'))

app.use((req,res,next)=>{
    var err=new Error("page was Not found")
    err.status=404;
    next(err)
})
app.use((err,req,res,next)=>{
    res.status(err.status=(err.status || 500))
    res.json({"error":err.message})
})



app.listen(port, () => console.log(`http://127.0.0.1:`+port))