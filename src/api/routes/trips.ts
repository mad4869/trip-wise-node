import { Router } from "express";
import { body, param } from "express-validator";
import { inputErrorMiddleware } from "@/middleware/errors";
import { createTrip, deleteTrip, getTrip, getTrips, updateTrip } from "@/handlers/trips";

const tripsRouter = Router();

/**
 * GET /trips/:id
 * Get a trip by ID
 * @param id - Trip ID
 * @returns {Object} - Success message, trip data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - Trip not found
 * @throws {500} - Internal server error
 * @example GET /trips/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Trip successfully retrieved",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "name": "Trip Name",
 *      "description": "Trip Description",
 *      "destination": "Trip Destination",
 *      "startDate": "2021-09-01T00:00:00.000Z",
 *      "endDate": "2021-09-10T00:00:00.000Z",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 * }
 */

tripsRouter.get("/:id",
    param('id')
        .isUUID().withMessage("Invalid trip ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid trip ID"),
    inputErrorMiddleware,
    getTrip
);

/**
 * GET /trips
 * Get all trips for the logged in user
 * @returns {Object} - Success message, trips data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {500} - Internal server error
 * @example GET /trips
 * {
 *  "success": true,
 *  "message": "Trips successfully retrieved",
 *  "data": [
 *      {
 *          "id": "123e4567-e89b-12d3-a456-426614174000",
 *          "userId": "123e4567-e89b-12d3-a456-426614174000",
 *          "title": "Trip Name",
 *          "description": "Trip Description",
 *          "destination": "Trip Destination",
 *          "startDate": "2021-09-01T00:00:00.000Z",
 *          "endDate": "2021-09-10T00:00:00.000Z",
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"
 *      }
 *  ]
 */

tripsRouter.get("/", getTrips);

/**
 * POST /trips
 * Create a new trip
 * @body title - Trip title
 * @body description - Trip description
 * @body destination - Trip destination
 * @body startDate - Trip start date
 * @body endDate - Trip end date
 * @returns {Object} - Success message, created trip data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {500} - Internal server error
 * @example POST /trips
 * {
 *  success: true,
 *  message: "Trip successfully created",
 *  data: {
 *      id: "123e4567-e89b-12d3-a456-426614174000",
 *      userId: "123e4567-e89b-12d3-a456-426614174000",
 *      title: "Trip Name",
 *      description: "Trip Description",
 *      destination: "Trip Destination",
 *      startDate: "2021-09-01T00:00:00.000Z",
 *      endDate: "2021-09-10T00:00:00.000Z",
 *      createdAt: "2021-09-01T00:00:00.000Z",
 *      updatedAt: "2021-09-01T00:00:00.000Z"
 * }
 */

tripsRouter.post("/",
    body('title')
        .isString().withMessage("Title must be string")
        .isLength({ min: 1 }).withMessage("Title is required"),
    body('description')
        .isString().withMessage("Description must be string")
        .optional(),
    body('destination')
        .isString().withMessage("Destination must be string")
        .isLength({ min: 1 }).withMessage("Destination is required"),
    body('startDate')
        .isISO8601().withMessage("Start date must be a valid date"),
    body('endDate')
        .isISO8601().withMessage("End date must be a valid date"),
    inputErrorMiddleware,
    createTrip
);

/**
 * PUT /trips/:id
 * Update a trip by ID
 * @param id - Trip ID
 * @body title - Trip title
 * @body description - Trip description
 * @body destination - Trip destination
 * @body startDate - Trip start date
 * @body endDate - Trip end date
 * @returns {Object} - Success message, updated trip data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - Trip not found
 * @throws {500} - Internal server error
 * @example PUT /trips/123e4567-e89b-12d3-a456-426614174000
 * {
 *  success: true,
 *  message: "Trip successfully updated",
 *  data: {
 *      id: "123e4567-e89b-12d3-a456-426614174000",
 *      userId: "123e4567-e89b-12d3-a456-426614174000",
 *      title: "Trip Name",
 *      description: "Trip Description",
 *      destination: "Trip Destination",
 *      startDate: "2021-09-01T00:00:00.000Z",
 *      endDate: "2021-09-10T00:00:00.000Z",
 *      createdAt: "2021-09-01T00:00:00.000Z",
 *      updatedAt: "2021-09-01T00:00:00.000Z"
 * }
 */

tripsRouter.put("/:id",
    param('id')
        .isUUID().withMessage("Invalid trip ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid trip ID"),
    body('title')
        .isString().withMessage("Title must be string")
        .optional(),
    body('description')
        .isString().withMessage("Description must be string")
        .optional(),
    body('destination')
        .isString().withMessage("Destination must be string")
        .optional(),
    body('startDate')
        .isISO8601().withMessage("Start date must be a valid date")
        .optional(),
    body('endDate')
        .isISO8601().withMessage("End date must be a valid date")
        .optional(),
    inputErrorMiddleware,
    updateTrip
);

/**
 * DELETE /trips/:id
 * Delete a trip by ID
 * @param id - Trip ID
 * @returns {Object} - Success message
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - Trip not found
 * @throws {500} - Internal server error
 * @example DELETE /trips/123e4567-e89b-12d3-a456-426614174000
 * {
 *  success: true,
 *  message: "Trip successfully deleted"
 * }
 */

tripsRouter.delete("/:id",
    param('id')
        .isUUID().withMessage("Invalid trip ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid trip ID"),
    inputErrorMiddleware,
    deleteTrip
);



export default tripsRouter;