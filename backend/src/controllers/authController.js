import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../lib/utils.js";


const signup=async (req,res)=>{
    const {email,password,username}=req.body;

    try{
    if(!email || !password || !username){
    res.status(400).json({message:"Email and Password are required"});
    return;
    }
    
    // Check if MongoDB is connected
    const mongoose = (await import("mongoose")).default;
    if (mongoose.connection.readyState !== 1) {
        // MongoDB not connected - return success without saving (for development)
        console.log("⚠️  MongoDB not connected. Signup skipped (auth disabled).");
        res.status(201).json({
            id: "temp-id",
            email: email,
            username: username,
            message: "Auth disabled - MongoDB not connected"
        });
        return;
    }

    const user=await User.findOne({email});
    if(user){
    res.status(400).json({message:"User already exists"});
    return;
    }
    const hashedPassword=await bcrypt.hash(password,10);

    const newUser=new User({email,password:hashedPassword,username});

   if(newUser){
    generateToken(newUser._id, res);
     await newUser.save();
   
    res.status(201).json({id:newUser._id,email:newUser.email,username:newUser.username});
   }
    else{
        res.status(400).json({message:"Invalid user data"});
    }
}
catch(err){
    console.error("Signup error:", err);
    res.status(500).json({message:"Error", error: err.message});
}
};

const login=async (req,res)=>{
    const {email,password}=req.body;
    try{
    // Check if MongoDB is connected
    const mongoose = (await import("mongoose")).default;
    if (mongoose.connection.readyState !== 1) {
        // MongoDB not connected - return success without validation (for development)
        console.log("⚠️  MongoDB not connected. Login skipped (auth disabled).");
        res.status(200).json({
            id: "temp-id",
            email: email,
            username: "User",
            message: "Auth disabled - MongoDB not connected"
        });
        return;
    }

    const user=await User.findOne({email}); 
    if(user && (await bcrypt.compare(password,user.password))){
        generateToken(user._id,res);
        res.status(200).json({id:user._id,email:user.email,username:user.username});
    }   
    else{
        res.status(401).json({message:"Invalid email or password"});
    }
    }
    catch(err){
        console.error("Login error:", err);
        res.status(500).json({message:"Error", error: err.message});
    }
};
export {signup,login};