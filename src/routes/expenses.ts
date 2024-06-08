import { Router } from "express";
import type { Expense, PrismaClient } from "@prisma/client";

const router = Router();

const expensesRouter = (prisma: PrismaClient) => {
    router.get("/expense:id", (req, res) => {
        res.send("Hello World");
    });
    router.post("/expense", (req, res) => {
        res.send("Hello World");
    });
    router.put("/expense:id", (req, res) => {
        res.send("Hello World");
    });
    router.delete("/expense:id", (req, res) => {
        res.send("Hello World");
    });

    return router;
};

export default expensesRouter;