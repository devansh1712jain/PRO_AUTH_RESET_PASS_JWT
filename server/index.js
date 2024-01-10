import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import router from './router/route.js';
import mongoose from 'mongoose';
import  dotenv  from 'dotenv';

dotenv.config();
const app = express();
mongoose.connect('mongodb+srv://admin:admin@cluster0.ab36zfq.mongodb.net/devansh').then(()=>{

    app.listen(process.env.PORT || 8080,()=>{
        console.log("server is connected on port 8080");
    })
    console.log("db is connected")
    
}).catch(()=>{
    console.log("db is not connected")
});


app.use(express.json());
app.use(cors());
app.use(morgan('tiny')); // used to log data
// app.disable('x-powered-by');  // less hackers know about our stack

app.use('/api',router); 

/**HTTPS REQUEST */
app.get('/',(req,res)=>{
    res.status(200).json("Home GET Request")
});
