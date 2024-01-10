import jwt from "jsonwebtoken";
import ENV from '../config.js'
export async function Auth(req,res,next){
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodetoken = await jwt.verify(token, ENV.SECRET_KEY);
        req.user = decodetoken;
        next();
      
    } catch (error) {
        res.status(401).json({error: "Authentication Failed"})
    }
}

export function localVariables (req,res,next){
    req.app.locals = {
        OTP : null,
        resetSession : false
    }
    next()
}