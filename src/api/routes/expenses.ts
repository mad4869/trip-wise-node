import { Router } from "express";
import { body, param } from "express-validator";
import { createExpense, deleteExpense, getExpense, getExpenses, updateExpense } from "@/handlers/expenses";
import { inputErrorMiddleware } from "@/middleware/errors";

const expensesRouter = Router();

/**
 * GET /expenses/:id
 * Get an expense by ID
 * @param id - Expense ID
 * @returns {Object} - Success message, expense data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {404} - Expense not found
 * @example GET /expenses/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Expense successfully retrieved",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "activityId": "123e4567-e89b-12d3-a456-426614174000",
 *      "title": "Lunch",
 *      "description": "Lunch",
 *      "amount": 10.00,
 *      "currency": "USD",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 * }
 */

expensesRouter.get("/:id",
    param('id')
        .isUUID().withMessage("Invalid expense ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid expense ID"),
    inputErrorMiddleware,
    getExpense
);

/**
 * GET /expenses/activities/:activityId
 * Get all expenses for an activity
 * @param activityId - Activity ID
 * @returns {Object} - Success message, expenses data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {404} - Expenses not found
 * @example GET /expenses/activities/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Expenses successfully retrieved",
 *  "data": [
 *      {
 *          "id": "123e4567-e89b-12d3-a456-426614174000",
 *          "activityId": "123e4567-e89b-12d3-a456-426614174000",
 *          "title": "Lunch",
 *          "description": "Lunch",
 *          "amount": 10.00,
 *          "currency": "USD",
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"
 *      }
 *  ]
 */

expensesRouter.get("/activities/:activityId",
    param('activityId')
        .isUUID().withMessage("Invalid activity ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid activity ID"),
    inputErrorMiddleware,
    getExpenses
);

/**
 * POST /expenses
 * Create a new expense
 * @param activityId - Activity ID
 * @body title - Expense title
 * @body description - Expense description
 * @body amount - Expense amount
 * @body currency - Expense currency
 * @returns {Object} - Success message, expense data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @example POST /expenses
 * {
 *  "success": true,
 *  "message": "Expense successfully created",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "activityId": "123e4567-e89b-12d3-a456-426614174000",
 *      "title": "Lunch",
 *      "description": "Lunch",
 *      "amount": 10.00,
 *      "currency": "USD",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 *  }
 */

expensesRouter.post("/",
    body('activityId')
        .isUUID().withMessage("Invalid activity ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid activity ID"),
    body('title')
        .isString().withMessage("Title must be a string")
        .isLength({ min: 1 }).withMessage("Title is required"),
    body('description')
        .isString().withMessage("Description must be a string")
        .optional(),
    body('amount')
        .isAlphanumeric().withMessage("Amount must be a number")
        .isLength({ min: 1 }).withMessage("Amount is required"),
    body('currency')
        .isString().withMessage("Currency must be a string")
        .isLength({ min: 1 }).withMessage("Currency is required"),
    inputErrorMiddleware,
    createExpense
);

/**
 * PUT /expenses/:id
 * Update an expense
 * @param id - Expense ID
 * @body title - Expense title
 * @body description - Expense description
 * @body amount - Expense amount
 * @body currency - Expense currency
 * @returns {Object} - Success message, updated expense data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {404} - Expense not found
 * @example PUT /expenses/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Expense successfully updated",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "activityId": "123e4567-e89b-12d3-a456-426614174000",
 *      "title": "Dinner",
 *      "description": "Dinner",
 *      "amount": 20.00,
 *      "currency": "USD",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-02T00:00:00.000Z"
 *  }
 */

expensesRouter.put("/:id",
    param('id')
        .isUUID().withMessage("Invalid expense ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid expense ID"),
    body('title')
        .isString().withMessage("Title must be a string")
        .optional(),
    body('description')
        .isString().withMessage("Description must be a string")
        .optional(),
    body('amount')
        .isAlphanumeric().withMessage("Amount must be a number")
        .optional(),
    body('currency')
        .isString().withMessage("Currency must be a string")
        .optional(),
    inputErrorMiddleware,
    updateExpense
);

/**
 * DELETE /expenses/:id
 * Delete an expense
 * @param id - Expense ID
 * @returns {Object} - Success message
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {404} - Expense not found
 * @example DELETE /expenses/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Expense successfully deleted"
 * }
 */

expensesRouter.delete("/:id",
    param('id')
        .isUUID().withMessage("Invalid expense ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid expense ID"),
    inputErrorMiddleware,
    deleteExpense
);



export default expensesRouter;