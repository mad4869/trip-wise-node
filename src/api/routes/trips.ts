import prisma from "@/db";
import { Router } from "express";
import { type Trip } from "@prisma/client";

type UserQuery = { userId: string }
type NewTripInput = Omit<Trip, "id" | "createdAt" | "updatedAt">;
type ExistingTripInput = Partial<Omit<NewTripInput, 'userId'>> & { userId: string };

const tripsRouter = Router();

tripsRouter.get("/:id", async (req, res) => {
    const tripId = req.params.id;
    const { userId } = req.body as UserQuery;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    try {
        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId
            }
        });

        if (!trip) {
            res.status(404).json({
                success: false,
                message: "Trip not found"
            });
        } else if (trip.userId !== userId) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view this trip"
            })
        } else {
            res.status(200).json({
                success: true,
                message: `Trip with ID ${tripId} is found`,
                data: trip
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

tripsRouter.post("/", async (req, res) => {
    const { userId, title, description, destination, startDate, endDate } = req.body as NewTripInput

    if (!userId || !title || !destination || !startDate || !endDate) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (startDate > endDate) {
        return res.status(400).json({
            success: false,
            message: "Start date must be before end date"
        });
    }

    try {
        const newTrip = await prisma.trip.create({
            data: {
                userId,
                title,
                description,
                destination,
                startDate,
                endDate
            }
        });

        res.status(201).json({
            success: true,
            message: "Trip created successfully",
            data: newTrip
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

tripsRouter.put("/:id", async (req, res) => {
    const tripId = req.params.id;
    const { userId, title, description, destination, startDate, endDate } = req.body as ExistingTripInput;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

    if (startDate && endDate && startDate > endDate) {
        return res.status(400).json({
            success: false,
            message: "Start date must be before end date"
        });
    }

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
        } else if (trip.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to update this trip"
            });
        } else if ((startDate && startDate > trip.endDate) || (endDate && endDate < trip.startDate)) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date must be within the original range"
            });
        }

        await prisma.trip.update({
            where: {
                id: tripId
            },
            data: {
                title: title || trip.title,
                description: description || trip.description,
                destination: destination || trip.destination,
                startDate: startDate || trip.startDate,
                endDate: endDate || trip.endDate
            }
        });

        res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            data: trip
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

tripsRouter.delete("/:id", async (req, res) => {
    const tripId = req.params.id;

    const { userId } = req.body as UserQuery;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is required"
        });
    }

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
        } else if (trip.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to delete this trip"
            });
        }

        await prisma.trip.delete({
            where: {
                id: tripId
            }
        });

        res.status(200).json({
            success: true,
            message: "Trip deleted successfully",
            data: trip
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default tripsRouter;