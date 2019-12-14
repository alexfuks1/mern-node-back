const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fs = require('fs');
dotenv.config();


mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true})
.then(()=>{
    console.log("DB connected!");
});
mongoose.connection.on('error',err=>{
    console.log(`DB connection error${err.message}`);
})

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.get('/api',(req,res)=>{
    fs.readFile('docs/apiDocs.json',(err,data)=>{
        if(err){
            return res.status(400).json({error:err});
        }
        const docs = JSON.parse(data);
        res.json(docs);
    })
})

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cors());
app.use(cookieParser());
app.use("/",postRoutes);
app.use("/",authRoutes);
app.use("/",userRoutes);
app.use(function(err,req,res,next){
    if(err.name === "UnauthorizedError"){
        res.status(401).json({
            error:"Unauthorized!"
        })
    }
})

const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log(`A node.js Api listen toport${port}`)
});
