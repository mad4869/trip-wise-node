import e, { Router } from "express";
import { PrismaClient, type Expense } from "@prisma/client";

type UserQuery = { userId: string, tripId: string, itineraryId: string, activityId: string }
type NewExpenseInput = Omit<Expense, "id" | "createdAt" | "updatedAt"> & {
    userId: string,
    tripId: string,
    itineraryId: string
};
type ExistingExpenseInput = Partial<Omit<NewExpenseInput, 'userId'>> & {
    userId: string,
    tripId: string,
    itineraryId: string,
    activityId: string
};

const expensesRouter = Router();
const prisma = new PrismaClient();

/**
 * GET /expenses/:id
 * Get an expense by id
 * @param id - the id of the expense
 * @property userId - the id of the user
 * @property tripId - the id of the trip
 * @property itineraryId - the id of the itinerary
 * @property activityId - the id of the activity
 * @returns the expense
 * @throws 404 - Expense not found
 * @throws 403 - Unauthorized
 * @throws 500 - Internal server error
 * @example GET /expenses/1
 * {
 *  "success": true,
 *  "data": {
 *   "id": 1,
 *   "name": "Lunch",
 *   "cost": 10.5,
 *   "activityId": 1,
 *   "itineraryId": 1,
 *   "tripId": 1,
 *   "userId": 1,
 *   "createdAt": "2021-08-01T00:00:00.000Z",
 *   "updatedAt": "2021-08-01T00:00:00.000Z"
 * }
 */

expensesRouter.get("/:id", async (req, res) => {
    const expenseId = req.params.id;
    const { userId, tripId, itineraryId, activityId } = req.body as UserQuery;

    if (!userId || !tripId || !itineraryId || !activityId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        })
    }

    try {
        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            },
            include: {
                activity: {
                    select: {
                        itinerary: {
                            select: {
                                trip: {
                                    select: {
                                        userId: true
                                    }
                                },
                                tripId: true
                            }
                        },
                        itineraryId: true
                    }
                }
            }
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        } else if (
            expense.activity.itinerary.trip.userId !== userId ||
            expense.activity.itinerary.tripId !== tripId ||
            expense.activity.itineraryId !== itineraryId ||
            expense.activityId !== activityId
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        } else {
            return res.status(200).json({
                success: true,
                data: expense
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

/**
 * POST /expenses
 * Create a new expense
 * @property userId - the id of the user
 * @property tripId - the id of the trip
 * @property itineraryId - the id of the itinerary
 * @property activityId - the id of the activity
 * @property title - the title of the expense
 * @property description - the description of the expense
 * @property amount - the amount of the expense
 * @property currency - the currency of the expense
 * @returns the created expense
 * @throws 400 - Missing required fields
 * @throws 400 - Amount cannot be negative
 * @throws 500 - Internal server error
 * @example POST /expenses
 * {
 *  "userId": 1,
 *  "tripId": 1,
 *  "itineraryId": 1,
 *  "activityId": 1,
 *  "title": "Lunch",
 *  "description": "Lunch at McDonald's",
 *  "amount": 10.5,
 *  "currency": "USD",
 *  "createdAt": "2021-08-01T00:00:00.000Z",
 *  "updatedAt": "2021-08-01T00:00:00.000Z"
 * }
 */

expensesRouter.post("/", async (req, res) => {
    const { userId, tripId, itineraryId, activityId, title, description, amount, currency } = req.body as NewExpenseInput;

    if (!userId || !tripId || !itineraryId || !activityId || !title || !amount || !currency) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    if (amount < 0) {
        return res.status(400).json({
            success: false,
            message: "Amount cannot be negative"
        });
    }

    try {
        const expense = await prisma.expense.create({
            data: {
                title,
                description,
                amount,
                currency,
                activityId,
            }
        });

        return res.status(201).json({
            success: true,
            message: "Expense created",
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

/**
 * PUT /expenses/:id
 * Update an expense
 * @param id - the id of the expense
 * @property userId - the id of the user
 * @property tripId - the id of the trip
 * @property itineraryId - the id of the itinerary
 * @property activityId - the id of the activity
 * @property title - the title of the expense
 * @property description - the description of the expense
 * @property amount - the amount of the expense
 * @property currency - the currency of the expense
 * @returns the updated expense
 * @throws 400 - Missing required fields
 * @throws 400 - Amount cannot be negative
 * @throws 404 - Expense not found
 * @throws 403 - Unauthorized
 * @throws 500 - Internal server error
 * @example PUT /expenses/1
 * {
 *  "userId": 1,
 *  "tripId": 1,
 *  "itineraryId": 1,
 *  "activityId": 1,
 *  "title": "Dinner",
 *  "description": "Dinner at KFC",
 *  "amount": 15.5,
 *  "currency": "USD",
 *  "createdAt": "2021-08-01T00:00:00.000Z",
 *  "updatedAt": "2021-08-01T00:00:00.000Z"
 * }
 */

expensesRouter.put("/:id", async (req, res) => {
    const expenseId = req.params.id;
    const {
        userId,
        tripId,
        itineraryId,
        activityId,
        title,
        description,
        amount,
        currency
    } = req.body as ExistingExpenseInput;

    if (!userId || !tripId || !itineraryId || !activityId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    if (amount && amount < 0) {
        return res.status(400).json({
            success: false,
            message: "Amount cannot be negative"
        });
    }

    try {
        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            },
            include: {
                activity: {
                    select: {
                        itinerary: {
                            select: {
                                trip: {
                                    select: {
                                        userId: true
                                    }
                                },
                                tripId: true
                            }
                        },
                        itineraryId: true
                    }
                }
            }
        })

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        } else if (
            expense.activity.itinerary.trip.userId !== userId ||
            expense.activity.itinerary.tripId !== tripId ||
            expense.activity.itineraryId !== itineraryId ||
            expense.activityId !== activityId
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense updated",
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

/**
 * DELETE /expenses/:id
 * Delete an expense
 * @param id - the id of the expense
 * @property userId - the id of the user
 * @property tripId - the id of the trip
 * @property itineraryId - the id of the itinerary
 * @property activityId - the id of the activity
 * @returns the deleted expense
 * @throws 400 - Missing required fields
 * @throws 404 - Expense not found
 * @throws 403 - Unauthorized
 * @throws 500 - Internal server error
 * @example DELETE /expenses/1
 * {
 *  "success": true,
 *  "message": "Expense deleted",
 *  "data": {
 *      "id": 1,
 *      "title": "Lunch",
 *      "description": "Lunch at McDonald's",
 *      "cost": 10.5,
 *      "activityId": 1,
 *      "itineraryId": 1,
 *      "tripId": 1,
 *      "userId": 1,
 *      "createdAt": "2021-08-01T00:00:00.000Z",
 *      "updatedAt": "2021-08-01T00:00:00.000Z"
 * }
 */

expensesRouter.delete("/:id", async (req, res) => {
    const expenseId = req.params.id;
    const { userId, tripId, itineraryId, activityId } = req.body as UserQuery;

    if (!userId || !tripId || !itineraryId || !activityId) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
    }

    try {
        const expense = await prisma.expense.findUnique({
            where: {
                id: expenseId
            },
            include: {
                activity: {
                    select: {
                        itinerary: {
                            select: {
                                trip: {
                                    select: {
                                        userId: true
                                    }
                                },
                                tripId: true
                            }
                        },
                        itineraryId: true
                    }
                }
            }
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        } else if (
            expense.activity.itinerary.trip.userId !== userId ||
            expense.activity.itinerary.tripId !== tripId ||
            expense.activity.itineraryId !== itineraryId ||
            expense.activityId !== activityId
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        prisma.expense.delete({
            where: {
                id: expenseId
            }
        });

        return res.status(200).json({
            success: true,
            message: "Expense deleted",
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});

export default expensesRouter;