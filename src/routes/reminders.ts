import { Router } from "express";
import { PrismaClient, type Reminder } from "@prisma/client";

type UserQuery = { userId: string, tripId: string }
type NewReminderInput = Omit<Reminder, "id" | "createdAt" | "updatedAt">
type ExistingReminderInput = Partial<Omit<NewReminderInput, "userId" | "tripId">> & { userId: string, tripId: string }

const remindersRouter = Router();
const prisma = new PrismaClient();

/**
 * GET /reminders/:id
 * Get a reminder by ID
 * @param id - The ID of the reminder
 * @property {string} userId - The ID of the user
 * @property {string} tripId - The ID of the trip
 * @returns {Reminder} - The reminder object
 * @throws {404} - If the reminder is not found
 * @throws {403} - If the user is not authorized to view the reminder
 * @throws {500} - If there is an internal server error
 * @example
 * GET /reminders/1
 * {
 *  "success": true,
 *  "message": "Reminder with ID 1 is found",
 *  "data": {
 *      "id": 1,
 *      "userId": "1",
 *      "tripId": "1",
 *      "title": "Buy sunscreen",
 *      "description": "Don't forget to buy sunscreen",
 *      "date": "2021-08-01T00:00:00.000Z",
 *      "createdAt": "2021-07-31T00:00:00.000Z",
 *      "updatedAt": "2021-07-31T00:00:00.000Z"
 * }
 */

remindersRouter.get("/:id", async (req, res) => {
    const reminderId = req.params.id;
    const { userId, tripId } = req.body as UserQuery;

    if (!userId || !tripId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        })
    }

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
        } else if (reminder.userId !== userId || reminder.tripId !== tripId) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view this reminder"
            });
        } else {
            res.status(200).json({
                success: true,
                message: `Reminder with ID ${reminderId} is found`,
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
});

/**
 * POST /reminders
 * Create a new reminder
 * @property {string} userId - The ID of the user
 * @property {string} tripId - The ID of the trip
 * @property {string} message - The reminder message
 * @property {Date} time - The time to send the reminder
 * @returns {Reminder} - The reminder object
 * @throws {400} - If any required fields are missing
 * @throws {500} - If there is an internal server error
 * @example
 * POST /reminders
 * {
 *  "userId": "1",
 *  "tripId": "1",
 *  "message": "Don't forget to buy sunscreen",
 *  "time": "2021-08-01T00:00:00.000Z"
 *  "createdAt": "2021-07-31T00:00:00.000Z",
 *  "updatedAt": "2021-07-31T00:00:00.000Z"
 * }
 */

remindersRouter.post("/", async (req, res) => {
    const { userId, tripId, message, time } = req.body as NewReminderInput;

    if (!userId || !tripId || !message || !time) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const newReminder = await prisma.reminder.create({
            data: {
                userId,
                tripId,
                message,
                time
            }
        });

        res.status(201).json({
            success: true,
            message: "Reminder created",
            data: newReminder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

/**
 * PUT /reminders/:id
 * Update a reminder
 * @param id - The ID of the reminder
 * @property {string} userId - The ID of the user
 * @property {string} tripId - The ID of the trip
 * @property {string} message - The reminder message
 * @property {Date} time - The time to send the reminder
 * @returns {Reminder} - The updated reminder object
 * @throws {400} - If any required fields are missing
 * @throws {404} - If the reminder is not found
 * @throws {403} - If the user is not authorized to update the reminder
 * @throws {500} - If there is an internal server error
 * @example
 * PUT /reminders/1
 * {
 *  "userId": "1",
 *  "tripId": "1",
 *  "message": "Don't forget to buy sunscreen",
 *  "time": "2021-08-01T00:00:00.000Z",
 *  "createdAt": "2021-07-31T00:00:00.000Z",
 *  "updatedAt": "2021-07-31T00:00:00.000Z"
 * }
 */

remindersRouter.put("/:id", async (req, res) => {
    const reminderId = req.params.id;
    const { userId, tripId, message, time } = req.body as ExistingReminderInput;

    if (!userId || !tripId) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

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
        } else if (reminder.userId !== userId || reminder.tripId !== tripId) {
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
                time: time || reminder.time
            }
        });

        res.status(200).json({
            success: true,
            message: "Reminder updated",
            data: reminder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

/**
 * DELETE /reminders/:id
 * Delete a reminder
 * @param id - The ID of the reminder
 * @property {string} userId - The ID of the user
 * @property {string} tripId - The ID of the trip
 * @returns {Reminder} - The deleted reminder object
 * @throws {400} - If any required fields are missing
 * @throws {404} - If the reminder is not found
 * @throws {403} - If the user is not authorized to delete the reminder
 * @throws {500} - If there is an internal server error
 * @example
 * DELETE /reminders/1
 * {
 *  "userId": "1",
 *  "tripId": "1"
 *  "message": "Don't forget to buy sunscreen",
 *  "time": "2021-08-01T00:00:00.000Z",
 *  "createdAt": "2021-07-31T00:00:00.000Z",
 *  "updatedAt": "2021-07-31T00:00:00.000Z
 * }
 */

remindersRouter.delete("/:id", async (req, res) => {
    const reminderId = req.params.id;
    const { userId, tripId } = req.body as UserQuery;

    if (!userId || !tripId) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

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
        } else if (reminder.userId !== userId || reminder.tripId !== tripId) {
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
            message: "Reminder deleted",
            data: reminder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default remindersRouter;