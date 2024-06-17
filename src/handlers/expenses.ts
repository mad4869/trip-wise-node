import prisma from "@/db";
import type { Response } from "express";
import type { Expense } from "@prisma/client";
import type { AuthRequest } from "@/middleware/auth";

export type CreateExpenseInput = {
    [K in keyof Omit<Expense, "id" | "createdAt" | "updatedAt">]: string
}
export type UpdateExpenseInput = Partial<Omit<CreateExpenseInput, 'activityId'>> & { activityId: string }

export const getExpense = async (req: AuthRequest, res: Response) => {
    const expenseId = req.params.id;
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
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
        } else if (expense.activity.itinerary.trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to view this expense"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Expense successfully retrieved",
                data: expense
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getExpenses = async (req: AuthRequest, res: Response) => {
    const activityId = req.params.activityId;
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
        });
    }

    try {
        const expenses = await prisma.expense.findMany({
            where: {
                activityId: activityId
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
                                }
                            }
                        }
                    }
                }
            }
        });

        if (expenses.some(expense => expense.activity.itinerary.trip.userId !== loggedInUserId)) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to view these expenses"
            });
        }

        res.status(200).json({
            success: true,
            message: "Expenses successfully retrieved",
            data: expenses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const createExpense = async (req: AuthRequest, res: Response) => {
    const loggedInUserId = req.auth?.id;
    const {
        activityId,
        title,
        description,
        amount,
        currency
    } = req.body as CreateExpenseInput;

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
                message: "User not authorized to create an expense for this activity"
            });
        }

        const newExpense = await prisma.expense.create({
            data: {
                title,
                description,
                amount: parseInt(amount),
                currency,
                activityId,
            }
        });

        res.status(201).json({
            success: true,
            message: "Expense successfully created",
            data: newExpense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const updateExpense = async (req: AuthRequest, res: Response) => {
    const expenseId = req.params.id;
    const loggedInUserId = req.auth?.id;
    const {
        activityId,
        title,
        description,
        amount,
        currency
    } = req.body as UpdateExpenseInput;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
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
        } else if (expense.activity.itinerary.trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to update this expense"
            });
        }

        await prisma.expense.update({
            where: {
                id: expenseId
            },
            data: {
                title: title || expense.title,
                description: description || expense.description,
                amount: amount ? parseInt(amount) : expense.amount,
                currency: currency || expense.currency,
            }
        });

        return res.status(200).json({
            success: true,
            message: "Expense successfully updated",
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const deleteExpense = async (req: AuthRequest, res: Response) => {
    const expenseId = req.params.id;
    const loggedInUserId = req.auth?.id;

    if (!loggedInUserId) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized user"
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
        } else if (expense.activity.itinerary.trip.userId !== loggedInUserId) {
            return res.status(403).json({
                success: false,
                message: "User not authorized to delete this expense"
            });
        }

        await prisma.expense.delete({
            where: {
                id: expenseId
            }
        });

        res.status(200).json({
            success: true,
            message: "Expense successfully deleted",
            data: expense
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}