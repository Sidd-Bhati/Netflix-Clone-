import { User } from "../models/user.model.js"

import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookies } from "../utils/generateToken.js";

export async function signup(req, res) {
    // checking email, password and username
	try {
		const { email, password, username } = req.body;
    if(!email || !password || !username){
        return res.status(400).json({success:false , message:"All fields are required"})
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({success:false , message:"Invalid email"})
    }

    if(password.length < 6 ){
        return res.status(400).json({success:false , message:"Password must be atleast of 6 characters"})
    }
    const existingUserByEmail = await User.findOne({email:email})

    if(existingUserByEmail){
        return res.status(400).json({success:false , message:"Email already exists"})
    }
    const existingUserByUsername = await User.findOne({username:username})

    if(existingUserByUsername){
        return res.status(400).json({success:false , message:"Username already exists"})
    }
    //hashing password
    const salt = await bcryptjs.genSalt(10)
    const hashPassword = await bcryptjs.hash(password,salt)
    
    //generating random profile pic
    const PROFILE_PICS = ["/avatar1.png","/avatar2.png","/avatar3.png"]
    const image = PROFILE_PICS[Math.floor(Math.random()* PROFILE_PICS.length)];

    //creating new user
    const newUser = await User.create({
        email:email,
        password:hashPassword,
        username:username,
        image:image
    })
    
        
    //generating token and setting cookies
    generateTokenAndSetCookies(newUser._id,res)
        await newUser.save()
    //sending response
        res.status(201).json({
            success:true, user:{
            ...newUser._doc,
            password:""
    
        }})
      
   } catch (error) {
    console.log("Error in signUp controller ",error.message);
    res.status(500).json({success:false,message:"Internal server Error"})
   }
}
export async function login(req,res){
    try {
        //checking email and password
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({success:false , message:"All fields are required"})
        }

        const user = await User.findOne({email:email})

        if(!user){
            return res.status(404).json({success:false , message:"Invalid credentials"})
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({success:false , message:"Invalid credentials"})
        }
        //generating token and setting cookies
        generateTokenAndSetCookies(user._id,res);

        //sending response
        res.status(201).json({
            success:true, user:{
            ...user._doc,
            password:""
    
        }})

    } catch (error) {
        console.log("Error in Login controller ",error.message);
    res.status(500).json({success:false,message:"Internal server Error"})
    }
}
export async function logout(req,res){
    //clearing cookies
    try {
        res.clearCookie("jwt-netflix");
        res.status(200).json({success:true, message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller, error.message");
        res.status(500).json({success:false,message:"Internal server Error"})
    }
}
export async function authCheck(req, res) {
	try {
		res.status(200).json({ success: true, user: req.user });
	} catch (error) {
		console.log("Error in authCheck controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}
    