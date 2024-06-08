import bcrypt from "bcrypt";
import { Router } from "express";
import type { User, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type NewUserInput = Omit<User, "passwordHash"> & { password: string, confirmPassword: string };
type ExistingUserInput = Omit<User, "passwordHash">;

const router = Router();

const usersRouter = (prisma: PrismaClient) => {
    router.get("/:id", async (req, res) => {
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

    router.post("/", async (req, res) => {
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

    router.put("/:id", async (req, res) => {
        const userId = req.params.id;

        const { name, email, phoneNumber, profilePictureURL } = req.body as ExistingUserInput;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        try {
            const targetUser = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!targetUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        try {
            const user = await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    name,
                    email,
                    phoneNumber,
                    profilePictureURL
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

    router.delete("/:id", async (req, res) => {
        const userId = req.params.id;

        try {
            const targetUser = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!targetUser) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }

        try {
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

    return router;
}

export default usersRouter;