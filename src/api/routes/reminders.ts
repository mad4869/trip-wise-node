import { Router } from "express";
import { createReminder, deleteReminder, getReminder, getReminders, updateReminder } from "@/handlers/reminders";

const remindersRouter = Router();

/**
 * GET /reminders/:id
 * Get a reminder by ID
 * @param id - reminder ID
 * @returns {Object} - Success message, reminder data
 * @throws {400} - Invalid input
 * @throws {404} - Reminder not found
 * @example GET /reminders/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Reminder successfully retrieved",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "userId": "123e4567-e89b-12d3-a456-426614174000",
 *      "tripId": "123e4567-e89b-12d3-a456-426614174000",
 *      "message": "Reminder message",
 *      "time": "2021-09-01T00:00:00.000Z",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 * }
 */

remindersRouter.get("/:id", getReminder);

/**
 * GET /reminders/users/:userId
 * Get all reminders for a user
 * @returns {Object} - Success message, reminders data
 * @throws {400} - Invalid input
 * @throws {404} - Reminders not found
 * @example GET /reminders/
 * {
 *  "success": true,
 *  "message": "Reminders successfully retrieved",
 *  "data": [
 *      {
 *          "id": "123e4567-e89b-12d3-a456-426614174000",
 *          "userId": "123e4567-e89b-12d3-a456-426614174000",
 *          "tripId": "123e4567-e89b-12d3-a456-426614174000",
 *          "message": "Reminder message",
 *          "time": "2021-09-01T00:00:00.000Z",
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"
 *      }
 * ]
 */

remindersRouter.get("/", getReminders)

/**
 * POST /reminders
 * Create a new reminder
 * @body userId - User ID
 * @body tripId - Trip ID
 * @body message - Reminder message
 * @body time - Reminder time
 * @returns {Object} - Success message, reminder data
 * @throws {400} - Invalid input
 * @throws {404} - Trip not found
 * @example POST /reminders
 * {
 *  "success": true,
 *  "message": "Reminder successfully created",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "userId": "123e4567-e89b-12d3-a456-426614174000",
 *      "tripId": "123e4567-e89b-12d3-a456-426614174000",
 *      "message": "Reminder message",
 *      "time": "2021-09-01T00:00:00.000Z",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 *  }
 * }
 */

remindersRouter.post("/", createReminder);

/**
 * PUT /reminders/:id
 * Update a reminder by ID
 * @param id - Reminder ID
 * @body tripId - Trip ID
 * @body message - Reminder message
 * @body time - Reminder time
 * @returns {Object} - Success message, updated reminder data
 * @throws {400} - Invalid input
 * @throws {404} - Reminder not found
 * @example PUT /reminders/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Reminder successfully updated",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "userId": "123e4567-e89b-12d3-a456-426614174000",
 *      "tripId": "123e4567-e89b-12d3-a456-426614174000",
 *      "message": "Updated reminder message",
 *      "time": "2021-09-01T00:00:00.000Z",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 *  }
 * }
 */

remindersRouter.put("/:id", updateReminder);

/**
 * DELETE /reminders/:id
 * Delete a reminder by ID
 * @param id - Reminder ID
 * @returns {Object} - Success message
 * @throws {400} - Invalid input
 * @throws {404} - Reminder not found
 * @example DELETE /reminders/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Reminder successfully deleted"
 * }
 */

remindersRouter.delete("/:id", deleteReminder);



export default remindersRouter;