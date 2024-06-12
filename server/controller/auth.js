const User = require('../models/user');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const registerUser = async (req, res) => {
    try {
      const { name, email, password, phoneno } = req.body;
  
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({
          success: false,
          msg: "User already exists"
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        phoneno,
      });
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        data: newUser
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to register user",
        error: error.message
      });
    }
  };
  
const loginUser = async(req, res) =>{
    try{
        const { email,password } = req.body;
        const user = await User.findOne({ where: { email: email } });
        if(!user){
            return res.status(400).json({
                success:false,
                msg:"User not found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                msg:"Invalid email & password"
            })
        }
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            token:token
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Failed to login user",
            error: error.message
        });
    }
}


const logoutUser = (req, res) => {
    try{
        req.user = null;
        res.status(200).json({
            success:true,
            msg:"User logged out successfully"
        })
    }catch(error){
        return res.status(500).json({
            success: false,
            msg: "Failed to logout user",
            error: error.message
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser
}