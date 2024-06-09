import bcrypt from "bcrypt";
import { Router } from "express";
import { PrismaClient, type User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type NewUserInput = Omit<User, "id" | "passwordHash" | "createdAt" | "updatedAt"> & {
    password: string,
    confirmPassword: string
};
type ExistingUserInput = Partial<Omit<User, "id" | "passwordHash" | "createdAt" | "updatedAt">>;

const usersRouter = Router();
const prisma = new PrismaClient();

usersRouter.get("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: `User with ID ${userId} is found`,
                data: user
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

usersRouter.post("/", async (req, res) => {
    const { name, email, password, confirmPassword, phoneNumber, profilePictureURL } = req.body as NewUserInput;

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
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                phoneNumber,
                profilePictureURL
            }
        });

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

usersRouter.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const { name, email, phoneNumber, profilePictureURL } = req.body as ExistingUserInput;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: name || user.name,
                email: email || user.email,
                phoneNumber: phoneNumber || user.phoneNumber,
                profilePictureURL: profilePictureURL || user.profilePictureURL
            }
        });

        res.status(200).json({
            success: true,
            message: `User with ID ${userId} is updated`,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

usersRouter.delete("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await prisma.user.delete({
            where: {
                id: userId
            }
        });

        res.status(200).json({
            success: true,
            message: `User with ID ${userId} is deleted`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default usersRouter;