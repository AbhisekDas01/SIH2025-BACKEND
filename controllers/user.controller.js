import jwt from 'jsonwebtoken'
import { JWT_EXPIRES_IN, JWT_SECRET } from '../configs/env.config.js'
import APIError from '../utils/customError.util.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

const generateToken = (userId) => {

    return jwt.sign(
        {userId},
        JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
    )
}

//register user
export const  registerUser = async (req , res)  => {

    const {
        FirstName,
        middleName,
        lastName,
        AadhaarNumber,
        EmailId,
        PhoneNumber,
        DateOfBirth,
        Gender,
        Address,
        password,
        Role,
    } = req.body;

    if (!FirstName || !AadhaarNumber || !EmailId || !PhoneNumber || !password){
        throw new APIError("All the fields are required" , 403);
    }

    //check if the email adhaar already exists
    const existingUser = await User.findOne({EmailId , AadhaarNumber});

    if(existingUser){

        throw new APIError("Email or adhaar no already exists" , 403);
    }
    const user = new User({
        FirstName,
        middleName: middleName?.trim() || "",
        lastName: lastName?.trim() || "",
        AadhaarNumber,
        EmailId,
        PhoneNumber,
        DateOfBirth: DateOfBirth? new Date(DateOfBirth) : undefined,
        Gender: Gender || "Prefer not to say",
        Address: {
            Village: Address?.Village?.trim() || "",
            District: Address?.District?.trim() || "",
            State: Address?.State?.trim() || "",
            PinCode: Address?.PinCode?.trim() || "",
            Country: Address?.Country?.trim() || "India"
        },
        password,
        Role: Role || "COMMUNITY_USER"
    });

    await user.save();

    const token = generateToken(user._id.toString());

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token: token,
    })
}

//login user
export const loginUser = async (req, res) => {
    const { AadhaarNumber, password } = req.body;

    if (!AadhaarNumber || !password) {
        throw new APIError('Aadhaar and password are required', 400);
    }

    // find user by Aadhaar
    const user = await User.findOne({ AadhaarNumber });
    if (!user) {
        throw new APIError('Invalid Aadhaar or password', 401);
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new APIError('Invalid Aadhaar or password', 401);
    }


    // generate token
    const token = generateToken(user._id.toString());


    return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            token,
            tokenExpiry: JWT_EXPIRES_IN
        }
    });
};

//get user data
export const getUserData = async (req ,res ) => {

    const userId = req.user?.userId;

    if(!userId){
        throw new APIError("Please login first!" , 401);
    }

    //fetch user 
    const user = await User.findById(userId).select("-password");

    return res.json({
        success: true,
        message: 'User retrieved successfully',
        user
    })


}