import { Router } from "express";
import { param } from "express-validator";
import { createItinerary, deleteItinerary, getItineraries, getItinerary, updateItinerary } from "@/handlers/itineraries";

const itinerariesRouter = Router();

/**
 * GET /itineraries/:id
 * Get an itinerary by ID
 * @param id - Itinerary ID
 * @returns {Object} - Success message, itinerary data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - Itinerary not found
 * @throws {500} - Internal server error
 * @example GET /itineraries/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Itinerary successfully retrieved",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "tripId": "123e4567-e89b-12d3-a456-426614174000",
 *      "date": "2021-09-01T00:00:00.000Z",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 * }
 */

itinerariesRouter.get("/:id",
    param('id')
        .isUUID().withMessage("Invalid itinerary ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid itinerary ID"),
    getItinerary
);

/**
 * GET /itineraries/trips/:tripId
 * Get all itineraries for a trip
 * @param tripId - Trip ID
 * @returns {Object} - Success message, itineraries data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - Itineraries not found
 * @throws {500} - Internal server error
 * @example GET /itineraries/trips/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Itineraries successfully retrieved",
 *  "data": [
 *      {
 *          "id": "123e4567-e89b-12d3-a456-426614174000",
 *          "tripId": "123e4567-e89b-12d3-a456-426614174000",
 *          "date": "2021-09-01T00:00:00.000Z",
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"
 *      }
 *  ]
 * }
 */

itinerariesRouter.get("/trips/:tripId", getItineraries);

/**
 * POST /itineraries
 * Create a new itinerary
 * @body tripId - Trip ID
 * @body date - Itinerary date
 * @returns {Object} - Success message, new itinerary data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - Trip not found
 * @throws {500} - Internal server error
 * @example POST /itineraries
 * {
 *  "success": true,
 *  "message": "Itinerary successfully created",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "tripId": "123e4567-e89b-12d3-a456-426614174000",
 *      "date": "2021-09-01T00:00:00.000Z",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 * }
 */

itinerariesRouter.post("/", createItinerary);

/**
 * PUT /itineraries/:id
 * Update an itinerary by ID
 * @param id - Itinerary ID
 * @body tripId - Trip ID
 * @body date - Itinerary date
 * @returns {Object} - Success message, updated itinerary data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - Itinerary not found
 * @throws {500} - Internal server error
 * @example PUT /itineraries/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Itinerary successfully updated",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "tripId": "123e4567-e89b-12d3-a456-426614174000",
 *      "date": "2021-09-01T00:00:00.000Z",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 * }
 */

itinerariesRouter.put("/:id", updateItinerary);

/**
 * DELETE /itineraries/:id
 * Delete an itinerary by ID
 * @param id - Itinerary ID
 * @returns {Object} - Success message
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - Itinerary not found
 * @throws {500} - Internal server error
 * @example DELETE /itineraries/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Itinerary successfully deleted"
 * }
 */

itinerariesRouter.delete("/:id", deleteItinerary);



export default itinerariesRouter;