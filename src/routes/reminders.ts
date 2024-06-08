import { Router } from "express";
import type { Reminder, PrismaClient } from "@prisma/client";

const router = Router();

const remindersRouter = (prisma: PrismaClient) => {
    router.get("/reminder:id", (req, res) => {
        res.send("Hello World");
    });
    router.post("/reminder", (req, res) => {
        res.send("Hello World");
    });
    router.put("/reminder:id", (req, res) => {
        res.send("Hello World");
    });
    router.delete("/reminder:id", (req, res) => {
        res.send("Hello World");
    });

    return router;
};

export default remindersRouter;