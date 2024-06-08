import { Router } from "express";
import type { Activity, PrismaClient } from "@prisma/client";

const router = Router();

const activitiesRouter = (prisma: PrismaClient) => {
    router.get("/activity:id", (req, res) => {
        res.send("Hello World");
    });
    router.post("/activity", (req, res) => {
        res.send("Hello World");
    });
    router.put("/activity:id", (req, res) => {
        res.send("Hello World");
    });
    router.delete("/activity:id", (req, res) => {
        res.send("Hello World");
    });

    return router;
};

export default activitiesRouter;