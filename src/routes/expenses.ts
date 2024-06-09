import { Router } from "express";
import { PrismaClient, type Expense } from "@prisma/client";

const expensesRouter = Router();
const prisma = new PrismaClient();

expensesRouter.get("/expense:id", (req, res) => {
    res.send("Hello World");
});
expensesRouter.post("/expense", (req, res) => {
    res.send("Hello World");
});
expensesRouter.put("/expense:id", (req, res) => {
    res.send("Hello World");
});
expensesRouter.delete("/expense:id", (req, res) => {
    res.send("Hello World");
});

export default expensesRouter;