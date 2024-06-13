import prisma from '@/db'
import type { Response } from "express";
import type { Itinerary } from "@prisma/client";
import type { AuthRequest } from '@/middleware/auth';

export type CreateItineraryInput = {
    [K in keyof Omit<Itinerary, "id" | "createdAt" | "updatedAt">]: string
}
export type UpdateItineraryInput = CreateItineraryInput

export const getItinerary = async (req: AuthRequest, res: Response) => {
    const itineraryId = req.params.id;
    const loggedInUserId = req.auth?.id;

    try {
        const itinerary = await prisma.itinerary.findUnique({
            where: {
                id: itineraryId
            },
            include: {
                trip: {
                    select: {
                        userId: true,
                    }
                }
            }
        });

        if (!itinerary) {
            res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        } else if (itinerary.trip.userId !== loggedInUserId) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view this itinerary"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Itinerary successfully retrieved",
                data: itinerary
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

export const getItineraries = async (req: AuthRequest, res: Response) => {
    const tripId = req.params.tripId;
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    try {
        const itineraries = await prisma.itinerary.findMany({
            where: {
                tripId: tripId
            },
            include: {
                trip: {
                    select: {
                        userId: true,
                    }
                }
            }
        });

        if (itineraries.some(itinerary => itinerary.trip.userId !== loggedInUserId)) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to view these itineraries"
            });
        }

        res.status(200).json({
            success: true,
            message: "Itineraries successfully retrieved",
            data: itineraries
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const createItinerary = async (req: AuthRequest, res: Response) => {
    const loggedInUserId = req.auth?.id;
    const { tripId, date } = req.body as CreateItineraryInput

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
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
                message: "User not authorized to create an itinerary for this trip"
            });
        }

        const newItinerary = await prisma.itinerary.create({
            data: {
                tripId,
                date: new Date(date)
            }
        });

        res.status(201).json({
            success: true,
            message: "Itinerary successfully created",
            data: newItinerary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateItinerary = async (req: AuthRequest, res: Response) => {
    const itineraryId = req.params.id;
    const loggedInUserId = req.auth?.id;
    const { tripId, date } = req.body as UpdateItineraryInput;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    try {
        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId
            }
        });
        const itinerary = await prisma.itinerary.findUnique({
            where: {
                id: itineraryId
            },
            include: {
                trip: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!trip || !itinerary) {
            return res.status(404).json({
                success: false,
                message: "Trip or Itinerary not found"
            });
        } else if (itinerary.trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to update this itinerary"
            });
        }

        await prisma.itinerary.update({
            where: {
                id: itineraryId
            },
            data: {
                date: new Date(date)
            }
        });

        res.status(200).json({
            success: true,
            message: "Itinerary successfully updated",
            data: itinerary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const deleteItinerary = async (req: AuthRequest, res: Response) => {
    const itineraryId = req.params.id;
    const loggedInUserId = req.auth?.id;

    try {
        const itinerary = await prisma.itinerary.findUnique({
            where: {
                id: itineraryId
            },
            include: {
                trip: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (!itinerary) {
            return res.status(404).json({
                success: false,
                message: "Itinerary not found"
            });
        } else if (itinerary.trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to delete this itinerary"
            });
        }

        await prisma.itinerary.delete({
            where: {
                id: itineraryId
            }
        });

        res.status(200).json({
            success: true,
            message: "Itinerary successfully deleted",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}