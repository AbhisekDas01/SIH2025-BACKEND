import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({

    FirstName: {
        type: String,
        required: [true , "First name is required!"],
        trim: true,
        minlength: [2 , "Name must be atleast of 2 charecters"],
    },
    middleName: {
        type: String,
        trim: true,
        default: ""
    },
    lastName: {
        type: String,
        trim: true,
        default: ""
    },
    AadhaarNumber: {
        type: String,
        required: [true, "Aadhaar number is required!"],
        minlength: [12, "Aadhaar number must be exactly 12 digits"],
        maxlength: [12, "Aadhaar number must be exactly 12 digits"],
        match: [/^\d{12}$/, "Aadhaar number must contain only 12 digits"],
        unique: true,
        trim: true
    },
    EmailId: {
        type: String,
        unique: true,
        required: [true , "Email is required!"],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Please enter a valid email"]
    },
    PhoneNumber: {
        type: Number,
        required: [true , "Mobile number is required!"],
        
    },
    DateOfBirth: {
        type: Date,
        validate: {
            validator: function(value) {
                return value < new Date();
            },
            message: "Date of birth cannot be in the future"
        }
    },
    Gender: {
        type: String,
        enum: ["Male", "Female", "Other", "Prefer not to say"],
        default: "Prefer not to say"
    },
    Address: {
        Village: { type: String, trim: true },
        District: { type: String, trim: true },
        State: { type: String, trim: true },
        PinCode: { 
            type: String, 
            match: [/^\d{6}$/, "Please enter a valid 6-digit pin code"]
        },
        Country: { type: String, default: "India" }
    },
    password: {
        type: String,
        required: [true , "Password required"]
    },
    Role: {
        type: String,
        enum: [
            "ASHA_WORKER",
            "COMMUNITY_VOLUNTEER",
            "COMMUNITY_USER",
            "WATER_QUALITY_TESTER",
            "PHC_STAFF"
        ],
        default: "COMMUNITY_USER"
    }
} , {timestamps: true});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

const User = mongoose.model("User" , userSchema);

export default User;