import prisma from "@/db";
import { Router } from "express";
import { check, validationResult } from 'express-validator';
import { getUserById } from "@/handlers/users";
import { type User } from "@prisma/client";

type ExistingUserInput = Partial<Omit<User, "id" | "passwordHash" | "createdAt" | "updatedAt">>;

const usersRouter = Router();

usersRouter.get("/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await getUserById(userId)

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

usersRouter.put("/:id", check(['id', 'name', 'email', 'phoneNumber', 'profilePictureURL']), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: errors.array()
        });
    }

    const userId = req.params?.id
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