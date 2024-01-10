import UserModel from "../model/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator'



/**middlewear for verify user */
export async function verifyUser(req,res,next){
    try {
        const {username} = req.method == 'GET' ? req.query : req.body;

        //check the user existance
        let exist = await UserModel.findOne({username});
        if(!exist) return res.status(404).send({error: "Can't find User"});
        next()
    } catch (error) {
        return res.status(404).send({error: "Authenticate Error"});
    }
}


/** POST : http://localhost:8080/api/register 
 * @param :{
    "username": example123,
    password: admin123,
    email: excap@gmail.com,
    firstName: bill,
    lastname: william,
    mobile: 8009860560,
    address : apt 342 , kulas light gwenborh,
    profile: ""
 * }
*/

export async function register(req,res){
    try {
        const {username, password, profile, email} = req.body;
        // console.log({username, password, profile, email});
        //check the existing username
        const existUsername = new Promise((resolve, reject)=> {
            
            UserModel.findOne({username}).then((user)=>{
                if(user) {
                    reject({ error : "Please use unique username"});
                }
                resolve()                
            }).catch(()=>{
                reject();
            })
        });
        //check the existing email
        const existEmail = new Promise((resolve, reject)=> {
            UserModel.findOne({email}).then((user)=>{
                if(user) {
                    reject({ error : "Please use unique email"});
                }
                resolve() ;     
            }).catch(()=>{
                reject();
            })
        });

        Promise.all([existEmail, existUsername])
               .then(()=>{
                    if(password){
                        bcrypt.hash(password,10)
                              .then(hashedpassword => {
                                const user = new UserModel({
                                    username,
                                    password:hashedpassword,
                                    profile: profile || '',
                                    email
                                })

                                // return save result as a response
                                user.save()
                                    .then(result=> res.status(201).send({msg:"User Register Successfully"}))
                                    .catch(error=> res.status(500).send(error))

                              }).catch(error=>{
                                return ses.status(500).send({
                                    error: "Enable to hashed password"
                                })
                              })
                    }
               }).catch(error => {
                    return res.status(500).send({error})
               })

    } catch (error) {
        console.log({error})
        return res.status(500).json(error)
    }
}


/** POST : http://localhost:8080/api/login
 * @param:{
    "username":"emaple123",
    "password":"admin123"
 * }
*/
export async function login(req,res){
    const {username , password} = req.body;

    try {
        UserModel.findOne({username})
                 .then(user=>{
                    bcrypt.compare(password, user.password)
                          .then(passwordCheck=>{
                           
                            if(!passwordCheck) return res.status(401).send({error:"Don't have password"})
                            
                            // create jwt token
                            const token = jwt.sign({
                                            userId: user._id,
                                            username:user.username
                                        },process.env.SECRET_KEY,{expiresIn : "24h"});
                            return res.status(200).send({
                                msg:"Login Succesfull",
                                username:user.username,
                                token
                            })
                          })
                          .catch(error=>{
                            return res.status(401).send({error: "Password does not Match"})
                          })
                 })
                 .catch(error=>{
                    return res.status(404).send({error: "Username not found"})
                 })
    } catch (error) {
        return res.status(500).send({error})
    }
}

/** GET : http://localhost:8080/api/user/example123
 * @param:{
    "username":"emaple123",
    "password":"admin123"
 * }
*/
export async function getUser(req,res){
    const {username } = req.params;

    try {
        if(!username) return res.status(501).send({error: "Invalid Username"});
        UserModel.findOne({username})
                 .then(user=>{
                    if(!user) return res.status(400).send({error: "Could't find the User"});
                        /**remove password from user */
                        /**mongoose return unnecessary data with object so convert it to jSOn */
                    const {password, ...rest} = Object.assign({},user.toJSON());
                    return res.status(201).send(rest);
                 })
                 .catch(error=>{
                    return res.status(500).send({error})
                 })
        
    } catch (error) {
        return res.status(404).send({error: "Cannot find UserData"});
    }
}


/**PUT  http://localhost:8080/api/updateUser
 * @param :{
    "id":"<userid>"
    }
    body:{
        firstName:'',
        address:'', 
        profile:''
    }
*/
export async function updateUser(req,res){
    try {
        const {userId} = req.user;
      
        if(userId){
            const body = req.body;
           
            // update the data
            UserModel.updateOne({_id:userId},body)
                .then(()=>{
                    return res.status(201).send({msg: "Record Updated"});
                })
                .catch(err=>{
                    return res.status(401).send({error:"User not Found...!"});
                })             
         
        }else{
            return res.status(401).send({error:"User not Found...!"});
        }
    } catch (error) {
        return res.status(401).send({error:"User Not Found"});
    }
}

/** GET : http://localhost:8080/api/generateOTP*/
export async function generateOTP(req,res){
    req.app.locals.OTP = await otpGenerator.generate(6,{lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    res.status(201).send({code: req.app.locals.OTP})
}

/** GET : http://localhost:8080/api/verifyOTP*/
export async function verifyOTP(req,res){
    const {code} = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null;  // reset the OTP VALUE
        req.app.locals.resetSession = true; // start the session for reset password
        return res.status(201).send({msg: 'Verify Successfully'});
    }
    return res.status(400).send({error : "Invalid OTP"});
}

/**Succesfully redirect the user when OTP is valid */
/**GET : http://localhost:8080/api/creareResetSession*/ 

export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
        return res.status(201).send({flag: req.app.locals.resetSession});
    }
    return res.status(440).send({error:"Session expired!"})
}

/**update the password when we have valid session */
/**PUT : http://localhost:8080/api/resetPassword*/ 
export async function resetPassword(req,res){
    try {
        if(!req.app.locals.resetSession) return res.status(440).send({error: "Session expired!"});
        const {username, password} = req.body;
        try {
            UserModel.findOne({username})
                .then(user=>{
                    bcrypt.hash(password,10)
                        .then(hashedpassword=>{
                        
                            UserModel.updateOne({username},{password:hashedpassword})
                                .then(()=>{
                                    req.app.locals.resetSession = false;
                                    return res.status(201).send({msg: "record Updated"})
                            }).catch(error=>{
                                return res.status(500).send({
                                    error: "Enable to hashed password"
                                })
                            })
                        })
                        .catch(e=>{
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                })
                .catch(error=>{
                    return res.status(404).send({error: "Username not Found"});
                })
        } catch (error) {
            return res.status(404)
        }

    } catch (error) {
        return res.status(401).status(401).send({error})
    }   
}

