 import userSchema  from "../models/user.js"
 import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

 
 export const authRegister = async(req, res, next)=>{
const {password, email , name} = req.body;
const normalizedEmail = email.toLowerCase()
const normalizeName = name.trim();
    try{
const user = await userSchema.findOne({email: normalizedEmail});
if(user !== null){
    return res.status(409).send({ message: "Email in use" })
}
const passwordHash = await bcrypt.hash(password, 10)
console.log('хеш',passwordHash)

const data = await userSchema.create({
    password: passwordHash,
    email: normalizedEmail,
    name:normalizeName
})
 res.status(201).send({ message: "Registration successful" });
    }catch(error){
    next(error)
    }

 }


 export const authLogin = async (req, res, next) =>{
    const {password, email} = req.body;
    const normalizedEmail = email.toLowerCase();

    try{

        const user = await userSchema.findOne({email: normalizedEmail});
        if(user === null){
            return res.status(401).send({message:"Not authorized"});

        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch === false){
             return res.status(401).send({message: "Not authorized"})
        }
        const token = jwt.sign({
            id: user._id
        },
        process.env.JWT_SECRET,
    )
       await userSchema.findByIdAndUpdate(user._id, {token});
       console.log("token", token)
       res.send({token})

    }catch(error){
        next(error) 
    }
 }