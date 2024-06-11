import prisma from "@/db";
import type { Response } from "express";
import type { Trip } from "@prisma/client";
import type { AuthRequest } from "@/middleware/auth";

type CreateTripInput = Omit<Trip, "id" | "createdAt" | "updatedAt">;
type UpdateTripInput = Partial<Omit<CreateTripInput, 'userId'>> & { userId: string };

export const getTrip = async (req: AuthRequest, res: Response) => {
    const tripId = req.params.id;
    const loggedInUserId = req.auth?.id;

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
        } else if (trip.userId !== loggedInUserId) {
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
};

export const createTrip = async (req: AuthRequest, res: Response) => {
    const { userId, title, description, destination, startDate, endDate } = req.body as CreateTripInput;

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
}

export const updateTrip = async (req: AuthRequest, res: Response) => {
    const tripId = req.params.id;
    const { userId, title, description, destination, startDate, endDate } = req.body as UpdateTripInput;

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
}

export const deleteTrip = async (req: AuthRequest, res: Response) => {
    const tripId = req.params.id;
    const loggedInUserId = req.auth?.id;

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
}