import { Router } from "express";

const router = Router();

/**
 * User routes
*/

import usersRouter from "./routes/users";

router.use('/users', usersRouter);

/**
 * Trip routes
 */

import tripsRouter from "./routes/trips";

router.use('/trips', tripsRouter);

/**
 * Itinerary routes
 */

import itinerariesRouter from "./routes/itineraries";

router.use('/itineraries', itinerariesRouter);

/**
 * Activity routes
 */

import activitiesRouter from "./routes/activities";

router.use('/activities', activitiesRouter);

/**
 * Expense routes
 */

import expensesRouter from "./routes/expenses";

router.use('/expenses', expensesRouter);

/**
 * Reminder routes
 */

import remindersRouter from "./routes/reminders";

router.use('/reminders', remindersRouter);

export default router;