import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from "express";
import { getUserByEmail, registerUser } from '../handlers/users';
import type { User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

type LoginInput = { email: string, password: string };
type RegisterInput = { name: string, email: string, password: string, confirmPassword: string };

const authRouter = Router();

const createToken = (user: User) => {
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string);

    return token;
};

const verifyPassword = (password: string, passwordHash: string) => {
    return bcrypt.compareSync(password, passwordHash);
};

authRouter.post("/register", async (req, res) => {
    const { name, email, password, confirmPassword } = req.body as RegisterInput;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match"
        });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const newUser = await registerUser(name, email, passwordHash);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
        });
    } catch (error) {
        console.error(error);

        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002' && (error.meta?.target as string[])?.includes('email')) {
                return res.status(400).json({
                    success: false,
                    message: "Email already exists"
                });
            }
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body as LoginInput;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const user = await getUserByEmail(email)

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    const isPasswordValid = verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: "Invalid password"
        });
    }

    const token = createToken(user);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            token
        }
    });
})


export default authRouter;