import prisma from '@/db'
import { Router } from "express";
import { type Itinerary } from "@prisma/client";

type UserQuery = { userId: string, tripId: string }
type NewItineraryInput = Omit<Itinerary, "id" | "createdAt" | "updatedAt"> & { userId: string }
type ExistingItineraryInput = Partial<Omit<NewItineraryInput, 'userId' | 'tripId'>> & { userId: string, tripId: string }

const itinerariesRouter = Router();

itinerariesRouter.get("/:id", async (req, res) => {
    const itineraryId = req.params.id;
    const { userId, tripId } = req.body as UserQuery;

    if (!userId || !tripId) {
        return res.status(400).json({
            success: false,
            message: "User ID and Trip ID are required"
        });
    }

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
        } else if (itinerary.trip.userId !== userId || itinerary.tripId !== tripId) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view this itinerary"
            })
        } else {
            res.status(200).json({
                success: true,
                message: `Itinerary with ID ${itineraryId} is found`,
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
});

itinerariesRouter.post("/", async (req, res) => {
    const { userId, tripId, date } = req.body as NewItineraryInput

    if (!userId || !tripId) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        const newItinerary = await prisma.itinerary.create({
            data: {
                tripId,
                date
            }
        });

        res.status(201).json({
            success: true,
            message: "Itinerary created successfully",
            data: newItinerary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

itinerariesRouter.put("/:id", async (req, res) => {
    const itineraryId = req.params.id;
    const { userId, tripId, date } = req.body as ExistingItineraryInput;

    if (!userId || !tripId) {
        return res.status(400).json({
            success: false,
            message: "User ID and Trip ID are required"
        });
    }

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
        } else if (itinerary.trip.userId !== userId || itinerary.tripId !== tripId) {
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
                date: date || itinerary.date
            }
        });

        res.status(200).json({
            success: true,
            message: `Itinerary with ID ${itineraryId} is updated`,
            data: itinerary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

itinerariesRouter.delete("/:id", async (req, res) => {
    const itineraryId = req.params.id;
    const { userId, tripId } = req.body as UserQuery;

    if (!userId || !tripId) {
        return res.status(400).json({
            success: false,
            message: "User ID and Trip ID are required"
        });
    }

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
        } else if (itinerary.trip.userId !== userId || itinerary.tripId !== tripId) {
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
            message: "Itinerary deleted successfully",
            data: itinerary
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default itinerariesRouter;