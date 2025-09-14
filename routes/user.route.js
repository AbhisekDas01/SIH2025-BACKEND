import express from 'express'
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import { getUserData, loginUser, registerUser } from '../controllers/user.controller.js';
import authenticateUser from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/register' , asyncHandler(registerUser));
userRouter.post('/login' , asyncHandler(loginUser));
userRouter.get('/get-user' , authenticateUser, asyncHandler(getUserData));

export default userRouter;