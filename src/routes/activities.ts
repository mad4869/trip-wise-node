import { Router } from "express";
import { PrismaClient, type Activity } from "@prisma/client";

type UserQuery = { userId: string, tripId: string, itineraryId: string }
type NewActivityInput = Omit<Activity, "id" | "createdAt" | "updatedAt"> & { userId: string, tripId: string }
type ExistingActivityInput = Partial<Omit<NewActivityInput, 'userId' | 'tripId' | 'itineraryId'>> & {
    userId: string,
    tripId: string,
    itineraryId: string
}

const activitiesRouter = Router();
const prisma = new PrismaClient();

/**
 * GET /activities/:id
 * Get an activity by ID
 * @param id - Activity ID
 * @property {string} userId - User ID
 * @property {string} tripId - Trip ID
 * @property {string} itineraryId - Itinerary ID
 * @returns {Activity} - Activity object
 * @throws {404} - Activity not found
 * @throws {403} - User not authorized to view this activity
 * @throws {500} - Internal server error
 * @example
 * GET /activities/1
 * {
 *    "success": true,
 *    "message": "Activity with ID 1 is found",
 *    "data": {
 *       "id": 1,
 *       "name": "Visit the Eiffel Tower",
 *       "location": "Paris, France",
 *       "date": "2022-01-01",
 *       "time": "09:00:00",
 *       "notes": "Don't forget to bring a camera",
 *       "itineraryId": 1,
 *       "createdAt": "2021-09-01T12:00:00.000Z",
 *       "updatedAt": "2021-09-01T12:00:00.000Z"
 * }
 */

activitiesRouter.get("/:id", async (req, res) => {
    const activityId = req.params.id;
    const { userId, tripId, itineraryId } = req.body as UserQuery;

    if (!userId || !tripId || !itineraryId) {
        return res.status(400).json({
            success: false,
            message: "User ID, Trip ID, and Itinerary ID are required"
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
        } else if (
            activity.itinerary.trip.userId !== userId ||
            activity.itinerary.tripId !== tripId ||
            activity.itineraryId !== itineraryId
        ) {
            res.status(403).json({
                success: false,
                message: "User not authorized to view this activity"
            })
        } else {
            res.status(200).json({
                success: true,
                message: `Activity with ID ${activityId} is found`,
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
});

/**
 * POST /activities
 * Create a new activity
 * @property {string} userId - User ID
 * @property {string} tripId - Trip ID
 * @property {string} itineraryId - Itinerary ID
 * @property {string} title - Activity title
 * @property {string} description - Activity description
 * @property {string} location - Activity location
 * @property {string} startTime - Activity start time
 * @property {string} endTime - Activity end time
 * @property {string} category - Activity category
 * @property {string} detail - Activity detail
 * @returns {Activity} - New activity object
 * @throws {400} - All fields are required
 * @throws {400} - Start time cannot be later than end time
 * @throws {500} - Internal server error
 * @example
 * POST /activities
 * {
 *   "userId": "1",
 *   "tripId": "1",
 *   "itineraryId": "1",
 *   "title": "Visit the Eiffel Tower",
 *   "description": "Visit the Eiffel Tower",
 *   "location": "Paris, France",
 *   "startTime": "09:00:00",
 *   "endTime": "11:00:00",
 *   "category": "Sightseeing",
 *   "detail": "Don't forget to bring a camera"
 * }
 */

activitiesRouter.post("/", async (req, res) => {
    const {
        userId,
        tripId,
        itineraryId,
        title,
        description,
        location,
        startTime,
        endTime,
        category,
        detail
    } = req.body as NewActivityInput;

    if (!userId || !tripId || !itineraryId || !title || !location || !startTime || !endTime || !category) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (startTime > endTime) {
        return res.status(400).json({
            success: false,
            message: "Start time cannot be later than end time"
        });
    }

    try {
        const newActivity = await prisma.activity.create({
            data: {
                title,
                description,
                location,
                startTime,
                endTime,
                category,
                detail: detail ?? undefined,
                itineraryId
            }
        });

        res.status(201).json({
            success: true,
            message: "Activity created successfully",
            data: newActivity
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
 * PUT /activities/:id
 * Update an activity by ID
 * @param id - Activity ID
 * @property {string} userId - User ID
 * @property {string} tripId - Trip ID
 * @property {string} itineraryId - Itinerary ID
 * @property {string} title - Activity title
 * @property {string} description - Activity description
 * @property {string} location - Activity location
 * @property {string} startTime - Activity start time
 * @property {string} endTime - Activity end time
 * @property {string} category - Activity category
 * @property {string} detail - Activity detail
 * @returns {Activity} - Updated activity object
 * @throws {400} - User ID, Trip ID, and Itinerary ID are required
 * @throws {404} - Activity not found
 * @throws {403} - User not authorized to update this activity
 * @throws {500} - Internal server error
 * @example
 * PUT /activities/1
 * {
 *   "userId": "1",
 *   "tripId": "1",
 *   "itineraryId": "1",
 *   "title": "Visit the Eiffel Tower",
 *   "description": "Visit the Eiffel Tower",
 *   "location": "Paris, France",
 *   "startTime": "09:00:00",
 *   "endTime": "11:00:00",
 *   "category": "Sightseeing",
 *   "detail": "Don't forget to bring a camera"
 * }
 */

activitiesRouter.put("/:id", async (req, res) => {
    const activityId = req.params.id;
    const {
        userId,
        tripId,
        itineraryId,
        title,
        description,
        location,
        startTime,
        endTime,
        category,
        detail
    } = req.body as ExistingActivityInput;

    if (!userId || !tripId || !itineraryId) {
        return res.status(400).json({
            success: false,
            message: "User ID, Trip ID, and Itinerary ID are required"
        });
    }

    if (startTime && endTime && startTime > endTime) {
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
        } else if (
            activity.itinerary.trip.userId !== userId ||
            activity.itinerary.tripId !== tripId ||
            activity.itineraryId !== itineraryId
        ) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to update this activity"
            });
        } else if ((startTime && startTime > activity.endTime) || (endTime && endTime < activity.startTime)) {
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
                startTime: startTime || activity.startTime,
                endTime: endTime || activity.endTime,
                category: category || activity.category,
                detail: detail || activity.detail || undefined
            }
        });

        res.status(200).json({
            success: true,
            message: `Activity with ID ${activityId} is updated`,
            data: activity
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
 * DELETE /activities/:id
 * Delete an activity by ID
 * @param id - Activity ID
 * @property {string} userId - User ID
 * @property {string} tripId - Trip ID
 * @property {string} itineraryId - Itinerary ID
 * @returns {Activity} - Deleted activity object
 * @throws {400} - User ID, Trip ID, and Itinerary ID are required
 * @throws {404} - Activity not found
 * @throws {403} - User not authorized to delete this activity
 * @throws {500} - Internal server error
 * @example
 * DELETE /activities/1
 * {
 *   "success": true,
 *   "message": "Activity deleted successfully",
 *   "data": {
 *      "id": 1,
 *      "name": "Visit the Eiffel Tower",
 *      "location": "Paris, France",
 *      "date": "2022-01-01",
 *      "time": "09:00:00",
 *      "notes": "Don't forget to bring a camera",
 *      "itineraryId": 1,
 *      "createdAt": "2021-09-01T12:00:00.000Z",
 *      "updatedAt": "2021-09-01T12:00:00.000Z"
 * }
 */

activitiesRouter.delete("/:id", async (req, res) => {
    const activityId = req.params.id;
    const { userId, tripId, itineraryId } = req.body as UserQuery;

    if (!userId || !tripId || !itineraryId) {
        return res.status(400).json({
            success: false,
            message: "User ID, Trip ID, and Itinerary ID are required"
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
        } else if (
            activity.itinerary.trip.userId !== userId ||
            activity.itinerary.tripId !== tripId ||
            activity.itineraryId !== itineraryId
        ) {
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
});

export default activitiesRouter;