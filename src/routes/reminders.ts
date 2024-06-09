import { Router } from "express";
import { PrismaClient, type Reminder } from "@prisma/client";

const remindersRouter = Router();
const prisma = new PrismaClient();

remindersRouter.get("/reminder:id", (req, res) => {
    res.send("Hello World");
});
remindersRouter.post("/reminder", (req, res) => {
    res.send("Hello World");
});
remindersRouter.put("/reminder:id", (req, res) => {
    res.send("Hello World");
});
remindersRouter.delete("/reminder:id", (req, res) => {
    res.send("Hello World");
});

export default remindersRouter;