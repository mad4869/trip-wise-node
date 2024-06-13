import { Router } from "express";
import { body, param } from "express-validator";
import { inputErrorMiddleware } from "@/middleware/errors";
import { deleteUser, getUser, updateUser } from "@/handlers/users";

const usersRouter = Router();

/**
 * GET /users/:id
 * Get a user by ID
 * @param id - User ID
 * @returns {Object} - Success message, user data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - User not found
 * @throws {500} - Internal server error
 * @example GET /users/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "User successfully retrieved",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "name": "John Doe",
 *      "email": "johndoe@email.com",
 *      "phoneNumber": "1234567890",
 *      "profilePictureURL": "https://example.com/profile.jpg",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-01T00:00:00.000Z"
 *  }
 * }
 */

usersRouter.get("/:id",
    param('id')
        .isUUID().withMessage("Invalid user ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid user ID"),
    inputErrorMiddleware,
    getUser
);

/**
 * PUT /users/:id
 * Update a user by ID
 * @param id - User ID
 * @body name - User name
 * @body email - User email
 * @body phoneNumber - User phone number
 * @body profilePictureURL - User profile picture URL
 * @returns {Object} - Success message, updated user data
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - User not found
 * @throws {500} - Internal server error
 * @example PUT /users/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "User successfully updated",
 *  "data": {
 *      "id": "123e4567-e89b-12d3-a456-426614174000",
 *      "name": "Jane Doe",
 *      "email": "janedoe@email.com",
 *      "phoneNumber": "0987654321",
 *      "profilePictureURL": "https://example.com/janedoe.jpg",
 *      "createdAt": "2021-09-01T00:00:00.000Z",
 *      "updatedAt": "2021-09-02T00:00:00.000Z"
 *  }
 * }
 */

usersRouter.put("/:id",
    param('id')
        .isUUID().withMessage("Invalid user ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid user ID"),
    body('name')
        .isString().withMessage("Name must be a string")
        .optional(),
    body('email')
        .isEmail().withMessage("Email must be a valid address")
        .optional(),
    body('phoneNumber')
        .isString().withMessage("Phone number must be a string")
        .optional(),
    body('profilePictureURL')
        .isString().withMessage("Profile picture URL must be a string")
        .optional(),
    inputErrorMiddleware,
    updateUser
);

/**
 * DELETE /users/:id
 * Delete a user by ID
 * @param id - User ID
 * @body password - User password
 * @returns {Object} - Success message
 * @throws {400} - Invalid input
 * @throws {401} - Unauthorized user
 * @throws {403} - Forbidden user
 * @throws {404} - User not found
 * @throws {500} - Internal server error
 * @example DELETE /users/123e4567-e89b-12d3-a456-426614174000
 * {
 *  "success": true,
 *  "message": "User successfully deleted"
 * }
 */

usersRouter.delete("/:id",
    param('id')
        .isUUID().withMessage("Invalid user ID")
        .isLength({ min: 36, max: 36 }).withMessage("Invalid user ID"),
    body('password')
        .isString().withMessage("Password must be a string")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
    inputErrorMiddleware,
    deleteUser
);



export default usersRouter;