import { Router } from "express";
import { body, param } from "express-validator";
import { createActivity, deleteActivity, getActivities, getActivity, updateActivity } from '@/handlers/activities';

const activitiesRouter = Router();

/**
 * GET /activities/:id
 * Get an activity by ID
 * @param id - Activity ID
 * @returns {Object} - Success message, activity data
 * @throws {400} - Invalid input
 * @throws {404} - Activity not found
 * @example GET /activities/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Activity successfully retrieved",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "itineraryId": "123e4567-e89b-12d3-a456-426614174000",
 *      "title": "Activity Title",
 *      "description": "Activity Description",
 *      "location": "Activity Location",
 *      "startTime": "2021-09-01T00:00:00.000Z",
 *      "endTime": "2021-09-01T00:00:00.000Z",
 *      "category": "Sightseeing",
 *      "details": {
 *          "key": "value"
 *      },
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 *      }
 *  }
 */

activitiesRouter.get("/:id",
    param('id')
        .isUUID().withMessage("Invalid activity ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid activity ID"),
    getActivity
);

/**
 * GET /activities/itineraries/:itineraryId
 * Get all activities for an itinerary
 * @param itineraryId - Itinerary ID
 * @returns {Object} - Success message, activities data
 * @throws {400} - Invalid input
 * @throws {404} - Activities not found
 * @example GET /activities/itineraries/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Activities successfully retrieved",
 *  "data": [
 *      {
 *          "id": "123e4567-e89b-12d3-a456-426614174000",
 *          "itineraryId": "123e4567-e89
 *          "title": "Activity Title",
 *          "description": "Activity Description",
 *          "location": "Activity Location",
 *          "startTime": "2021-09-01T00:00:00.000Z",
 *          "endTime": "2021-09-01T00:00:00.000Z",
 *          "category": "Sightseeing",
 *          "details": {
 *              "key": "value"
 *          },
 *          "createdAt": "2021-09-01T00:00:00.000Z",
 *          "updatedAt": "2021-09-01T00:00:00.000Z"
 *      }
 *  ]
 * }
 */

activitiesRouter.get('/itineraries/:itineraryId',
    param('itineraryId')
        .isUUID().withMessage("Invalid itinerary ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid itinerary ID"),
    getActivities
);

/**
 * POST /activities
 * Create a new activity
 * @body itineraryId - Itinerary ID
 * @body title - Activity title
 * @body description - Activity description
 * @body location - Activity location
 * @body startTime - Activity start time
 * @body endTime - Activity end time
 * @body category - Activity category
 * @body details - Activity details
 * @returns {Object} - Success message, activity data
 * @throws {400} - Invalid input
 * @throws {500} - Internal server error
 * @example POST /activities
 * {
 *  "success": true,
 *  "message": "Activity successfully created",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "itineraryId": "123e4567-e89b-12d3-a456-426614174000",
 *      "title": "Activity Title",
 *      "description": "Activity Description",
 *      "location": "Activity Location",
 *      "startTime": "2021-09-01T00:00:00.000Z",
 *      "endTime": "2021-09-01T00:00:00.000Z",
 *      "category": "Sightseeing",
 *      "details": {
 *          "key": "value"
 *      },
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 *  }
 */

activitiesRouter.post("/",
    body('itineraryId')
        .isUUID().withMessage("Invalid itinerary ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid itinerary ID"),
    body('title')
        .isString().withMessage("Title must be a string")
        .isLength({ min: 1 }).withMessage("Title is required"),
    body('description')
        .isString().withMessage("Description must be a string")
        .optional(),
    body('location')
        .isString().withMessage("Location must be a string")
        .isLength({ min: 1 }).withMessage("Location is required"),
    body('startTime')
        .isISO8601().withMessage("Invalid start time"),
    body('endTime')
        .isISO8601().withMessage("Invalid end time"),
    body('category')
        .isString().withMessage("Category must be a string")
        .isLength({ min: 1 }).withMessage("Category is required")
        .isIn(['SIGHTSEEING', 'FOOD', 'ACCOMMODATION', 'SHOPPING', 'TRANSPORT', 'OTHER']).withMessage("Invalid category"),
    body('details')
        .isObject().withMessage("Details must be an object"),
    createActivity
);

/**
 * PUT /activities/:id
 * Update an activity by ID
 * @param id - Activity ID
 * @body itineraryId - Itinerary ID
 * @body title - Activity title
 * @body description - Activity description
 * @body location - Activity location
 * @body startTime - Activity start time
 * @body endTime - Activity end time
 * @body category - Activity category
 * @body details - Activity details
 * @returns {Object} - Success message, updated activity data
 * @throws {400} - Invalid input
 * @throws {404} - Activity not found
 * @throws {500} - Internal server error
 * @example PUT /activities/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Activity successfully updated",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "itineraryId": "123e4567-e89b-12d3-a456-426614174000",
 *      "title": "Activity Title",
 *      "description": "Activity Description",
 *      "location": "Activity Location",
 *      "startTime": "2021-09-01T00:00:00.000Z",
 *      "endTime": "2021-09-01T00:00:00.000Z",
 *      "category": "Sightseeing",
 *      "details": {
 *          "key": "value"
 *      },
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 *  }
 */

activitiesRouter.put("/:id",
    param('id')
        .isUUID().withMessage("Invalid activity ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid activity ID"),
    body('itineraryId')
        .isUUID().withMessage("Invalid itinerary ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid itinerary ID"),
    body('title')
        .isString().withMessage("Title must be a string")
        .optional(),
    body('description')
        .isString().withMessage("Description must be a string")
        .optional(),
    body('location')
        .isString().withMessage("Location must be a string")
        .optional(),
    body('startTime')
        .isISO8601().withMessage("Invalid start time")
        .optional(),
    body('endTime')
        .isISO8601().withMessage("Invalid end time")
        .optional(),
    body('category')
        .isString().withMessage("Category must be a string")
        .isIn(['SIGHTSEEING', 'FOOD', 'ACCOMMODATION', 'SHOPPING', 'TRANSPORT', 'OTHER']).withMessage("Invalid category")
        .optional(),
    body('details')
        .isObject().withMessage("Details must be an object")
        .optional(),
    updateActivity
);

/**
 * DELETE /activities/:id
 * Delete an activity by ID
 * @param id - Activity ID
 * @returns {Object} - Success message
 * @throws {400} - Invalid input
 * @throws {404} - Activity not found
 * @throws {500} - Internal server error
 * @example DELETE /activities/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "Activity successfully deleted"
 * }
 */

activitiesRouter.delete("/:id",
    param('id')
        .isUUID().withMessage("Invalid activity ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid activity ID"),
    deleteActivity
);

export default activitiesRouter;