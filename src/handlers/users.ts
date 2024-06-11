import prisma from "@/db";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import type { Response } from "express";
import type { AuthRequest } from "@/middleware/auth";

type UpdateUserInput = Partial<Omit<User, "id" | "passwordHash" | "createdAt" | "updatedAt">>;
type DeleteUserInput = { password: string };

export const getUser = async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;
    const loggedInUserId = req.auth?.id;

    if (userId !== loggedInUserId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized to access this route"
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            const { passwordHash, ...userData } = user;
            res.status(200).json({
                success: true,
                message: "User successfully retrieved",
                data: userData
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateUser = async (req: AuthRequest, res: Response) => {
    const userId = req.params.id
    const loggedInUserId = req.auth?.id;

    if (userId !== loggedInUserId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized to access this route"
        });
    }

    const { name, email, phoneNumber, profilePictureURL } = req.body as UpdateUserInput;

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

        const { passwordHash, ...userData } = user;
        res.status(200).json({
            success: true,
            message: "User successfully updated",
            data: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    const userId = req.params.id;
    const loggedInUserId = req.auth?.id;

    if (userId !== loggedInUserId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized to access this route"
        });
    }

    const { password } = req.body as DeleteUserInput;

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

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });
        }

        await prisma.user.delete({
            where: {
                id: userId
            }
        });

        res.status(200).json({
            success: true,
            message: "User successfully deleted",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};