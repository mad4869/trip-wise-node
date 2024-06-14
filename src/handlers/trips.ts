import prisma from "@/db";
import type { Response } from "express";
import type { Trip } from "@prisma/client";
import type { AuthRequest } from "@/middleware/auth";

export type CreateTripInput = {
    [K in keyof Omit<Trip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>]: string
}
export type UpdateTripInput = Partial<Omit<CreateTripInput, 'userId'>>

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
                message: "Trip successfully retrieved",
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

export const getTrips = async (req: AuthRequest, res: Response) => {
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    try {
        const trips = await prisma.trip.findMany({
            where: {
                userId: loggedInUserId
            }
        });

        if (trips.some(trip => trip.userId !== loggedInUserId)) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view these trips"
            });
        }

        res.status(200).json({
            success: true,
            message: "Trips successfully retrieved",
            data: trips
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const createTrip = async (req: AuthRequest, res: Response) => {
    const loggedInUserId = req.auth?.id;
    const { title, description, destination, startDate, endDate } = req.body as CreateTripInput;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDateObj > endDateObj) {
        return res.status(400).json({
            success: false,
            message: "Start date must be before end date"
        });
    }

    try {
        const newTrip = await prisma.trip.create({
            data: {
                userId: loggedInUserId,
                title,
                description,
                destination,
                startDate: startDateObj,
                endDate: endDateObj
            }
        });

        res.status(201).json({
            success: true,
            message: "Trip successfully created",
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
    const loggedInUserId = req.auth?.id;
    const { title, description, destination, startDate, endDate } = req.body as UpdateTripInput;

    const startDateObj = startDate ? new Date(startDate) : undefined;
    const endDateObj = endDate ? new Date(endDate) : undefined;

    if (startDateObj && endDateObj && startDateObj > endDateObj) {
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
        } else if (trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to update this trip"
            });
        } else if ((startDateObj && startDateObj > trip.endDate) || (endDateObj && endDateObj < trip.startDate)) {
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
                startDate: startDateObj || trip.startDate,
                endDate: endDateObj || trip.endDate
            }
        });

        res.status(200).json({
            success: true,
            message: "Trip successfully updated",
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
            message: "Trip successfully deleted",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}