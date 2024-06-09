import { Router } from "express";

const apiRouter = Router();

/**
 * User routes
*/

import usersRouter from "./routes/users";

apiRouter.use('/users', usersRouter);

/**
 * Trip routes
 */

import tripsRouter from "./routes/trips";

apiRouter.use('/trips', tripsRouter);

/**
 * Itinerary routes
 */

import itinerariesRouter from "./routes/itineraries";

apiRouter.use('/itineraries', itinerariesRouter);

/**
 * Activity routes
 */

import activitiesRouter from "./routes/activities";

apiRouter.use('/activities', activitiesRouter);

/**
 * Expense routes
 */

import expensesRouter from "./routes/expenses";

apiRouter.use('/expenses', expensesRouter);

/**
 * Reminder routes
 */

import remindersRouter from "./routes/reminders";

apiRouter.use('/reminders', remindersRouter);



export default apiRouter;