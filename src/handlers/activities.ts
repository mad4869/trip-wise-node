import prisma from "@/db";
import type { Response } from "express";
import type { Activity } from "@prisma/client";
import type { AuthRequest } from "@/middleware/auth";

type CreateActivityInput = Omit<Activity, "id" | "startTime" | "endTime" | "createdAt" | "updatedAt"> & {
    startTime: string,
    endTime: string
};
type UpdateActivityInput = Partial<Omit<CreateActivityInput, 'itineraryId'>> & { itineraryId: string };

export const getActivity = async (req: AuthRequest, res: Response) => {
    const activityId = req.params.id;
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    try {
        const activity = await prisma.activity.findUnique({
            where: {
                id: activityId
            },
            include: {
                itinerary: {
                    select: {
                        trip: {
                            select: {
                                userId: true
                            }
                        },
                        tripId: true
                    }
                }
            }
        });

        if (!activity) {
            res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        } else if (activity.itinerary.trip.userId !== loggedInUserId) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view this activity"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Activity successfully retrieved",
                data: activity
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

export const getActivities = async (req: AuthRequest, res: Response) => {
    const itineraryId = req.params.itineraryId;
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    try {
        const activities = await prisma.activity.findMany({
            where: {
                itineraryId: itineraryId
            },
            include: {
                itinerary: {
                    select: {
                        trip: {
                            select: {
                                userId: true
                            }
                        },
                        tripId: true
                    }
                }
            }
        });

        if (activities.some(activity => activity.itinerary.trip.userId !== loggedInUserId)) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view these activities"
            });
        }

        res.status(200).json({
            success: true,
            message: "Activities successfully retrieved",
            data: activities
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const createActivity = async (req: AuthRequest, res: Response) => {
    const loggedInUserId = req.auth?.id;
    const {
        itineraryId,
        title,
        description,
        location,
        startTime,
        endTime,
        category,
        detail
    } = req.body as CreateActivityInput;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    if (startTimeObj > endTimeObj) {
        return res.status(400).json({
            success: false,
            message: "Start time cannot be later than end time"
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
        } else if (itinerary.trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to create activity for this itinerary"
            });
        }

        const newActivity = await prisma.activity.create({
            data: {
                title,
                description,
                location,
                startTime: startTimeObj,
                endTime: endTimeObj,
                category,
                detail: detail ?? undefined,
                itineraryId
            }
        });

        res.status(201).json({
            success: true,
            message: "Activity successfully created",
            data: newActivity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateActivity = async (req: AuthRequest, res: Response) => {
    const activityId = req.params.id;
    const loggedInUserId = req.auth?.id;
    const {
        itineraryId,
        title,
        description,
        location,
        startTime,
        endTime,
        category,
        detail
    } = req.body as UpdateActivityInput;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    const startTimeObj = startTime ? new Date(startTime) : undefined;
    const endTimeObj = endTime ? new Date(endTime) : undefined;

    if (startTimeObj && endTimeObj && startTimeObj > endTimeObj) {
        return res.status(400).json({
            success: false,
            message: "Start time cannot be later than end time"
        });
    }

    try {
        const activity = await prisma.activity.findUnique({
            where: {
                id: activityId
            },
            include: {
                itinerary: {
                    select: {
                        trip: {
                            select: {
                                userId: true
                            }
                        },
                        tripId: true
                    }
                }
            }
        });

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        } else if (activity.itinerary.trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to update this activity"
            });
        } else if ((startTimeObj && startTimeObj > activity.endTime) || (endTimeObj && endTimeObj < activity.startTime)) {
            return res.status(400).json({
                success: false,
                message: "Start time and end time must be within the original range"
            });
        }

        await prisma.activity.update({
            where: {
                id: activityId
            },
            data: {
                title: title || activity.title,
                description: description || activity.description,
                location: location || activity.location,
                startTime: startTimeObj || activity.startTime,
                endTime: endTimeObj || activity.endTime,
                category: category || activity.category,
                detail: detail || activity.detail || undefined
            }
        });

        res.status(200).json({
            success: true,
            message: "Activity successfully updated",
            data: activity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const deleteActivity = async (req: AuthRequest, res: Response) => {
    const activityId = req.params.id;
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    try {
        const activity = await prisma.activity.findUnique({
            where: {
                id: activityId
            },
            include: {
                itinerary: {
                    select: {
                        trip: {
                            select: {
                                userId: true
                            }
                        }
                    }
                }
            }
        });

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found"
            });
        } else if (activity.itinerary.trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to delete this activity"
            });
        }

        await prisma.activity.delete({
            where: {
                id: activityId
            }
        });

        res.status(200).json({
            success: true,
            message: "Activity deleted successfully",
            data: activity
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}