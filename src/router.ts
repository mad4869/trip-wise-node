import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

/**
 * User routes
*/
import usersRouter from "./routes/users";

router.use('/users', usersRouter(prisma));

/**
 * Trip routes
 */

import tripsRouter from "./routes/trips";

router.use('/trips', tripsRouter(prisma));

/**
 * Itinerary routes
 */

import itinerariesRouter from "./routes/itineraries";

router.use('/itineraries', itinerariesRouter(prisma));

/**
 * Activity routes
 */

import activitiesRouter from "./routes/activities";

router.use('/activities', activitiesRouter(prisma));

/**
 * Expense routes
 */

import expensesRouter from "./routes/expenses";

router.use('/expenses', expensesRouter(prisma));

/**
 * Reminder routes
 */

import remindersRouter from "./routes/reminders";

router.use('/reminders', remindersRouter(prisma));

export default router;