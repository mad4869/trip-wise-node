import prisma from "@/db";
import type { Response } from "express";
import { type Reminder } from "@prisma/client";
import type { AuthRequest } from "@/middleware/auth";

export type CreateReminderInput = {
    [K in keyof Omit<Reminder, "id" | "userId" | "createdAt" | "updatedAt">]: string
}
type UpdateReminderInput = Partial<Omit<CreateReminderInput, "tripId">> & { tripId: string }

export const getReminder = async (req: AuthRequest, res: Response) => {
    const reminderId = req.params.id;
    const loggedInUserId = req.auth?.id;

    try {
        const reminder = await prisma.reminder.findUnique({
            where: {
                id: reminderId
            },
        })

        if (!reminder) {
            res.status(404).json({
                success: false,
                message: "Reminder not found"
            });
        } else if (reminder.userId !== loggedInUserId) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view this reminder"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Reminder successfully retrieved",
                data: reminder
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

export const getReminders = async (req: AuthRequest, res: Response) => {
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    try {
        const reminders = await prisma.reminder.findMany({
            where: {
                userId: loggedInUserId
            }
        });

        res.status(200).json({
            success: true,
            message: "Reminders successfully retrieved",
            data: reminders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const createReminder = async (req: AuthRequest, res: Response) => {
    const loggedInUserId = req.auth?.id;
    const { tripId, message, time } = req.body as CreateReminderInput;

    try {
        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId
            }
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        } else if (trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to create a reminder for this trip"
            });
        }

        const newReminder = await prisma.reminder.create({
            data: {
                userId: loggedInUserId,
                tripId,
                message,
                time: new Date(time)
            }
        });

        res.status(201).json({
            success: true,
            message: "Reminder successfully created",
            data: newReminder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateReminder = async (req: AuthRequest, res: Response) => {
    const reminderId = req.params.id;
    const loggedInUserId = req.auth?.id;
    const { tripId, message, time } = req.body as UpdateReminderInput;

    try {
        const reminder = await prisma.reminder.findUnique({
            where: {
                id: reminderId
            }
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found"
            });
        } else if (reminder.userId !== loggedInUserId || reminder.tripId !== tripId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to update this reminder"
            });
        }

        await prisma.reminder.update({
            where: {
                id: reminderId
            },
            data: {
                message: message || reminder.message,
                time: time ? new Date(time) : reminder.time
            }
        });

        res.status(200).json({
            success: true,
            message: "Reminder successfully updated",
            data: reminder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const deleteReminder = async (req: AuthRequest, res: Response) => {
    const reminderId = req.params.id;
    const loggedInUserId = req.auth?.id;

    try {
        const reminder = await prisma.reminder.findUnique({
            where: {
                id: reminderId
            }
        });

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: "Reminder not found"
            });
        } else if (reminder.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to delete this reminder"
            });
        }

        await prisma.reminder.delete({
            where: {
                id: reminderId
            }
        });

        res.status(200).json({
            success: true,
            message: "Reminder successfully deleted",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}