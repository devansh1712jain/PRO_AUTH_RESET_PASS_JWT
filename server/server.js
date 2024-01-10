import express from 'express';
import cors from 'cors';
import morgan from 'morgan'
import router from './router/route.js';
import mongoose from 'mongoose';
import ENV from './config.js';
mongoose.connect(ENV.MONGO_URL).then(()=>{

    app.listen(8080,()=>{
        console.log("server is connected on port 8080");
    })
    console.log("db is connected")
    
}).catch(()=>{
    console.log("db is not connected")
});

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny')); // used to log data
// app.disable('x-powered-by');  // less hackers know about our stack

app.use('/api',router); 
const port = 8080;
/**HTTPS REQUEST */
app.get('/',(req,res)=>{
    res.status(200).json("Home GET Request")
});

    // api coming here will neet /api first then routed
/**Start server only we have have valid connection */

// .then(()=>{
//     try {
//         app.listen(port,()=>{
//             console.log(`Server connected to https://localhost:${port}`);
//         })
//     } catch (error) {
//         console.log('Cannot connect to the server')
//     }
// }).catch(error =>{
//     console.log("Invalid database connection")
// })

