import asyncHandler from "./asyncHandler.middleware.js";
import jwt from "jsonwebtoken";
import APIError from "../utils/customError.util.js";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../configs/env.config.js";

const authenticateUser = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) throw new APIError("No token provided. Authorization denied", 401);

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) throw new APIError("User not found", 401);

    req.user = { userId: user._id.toString(), role: user.Role };
    next();
});

export default authenticateUser;