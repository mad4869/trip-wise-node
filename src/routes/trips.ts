import { Router } from "express";
import type { Trip, PrismaClient } from "@prisma/client";

const router = Router();

const tripsRouter = (prisma: PrismaClient) => {
    router.get("/trip:id", (req, res) => {
        res.send("Hello World");
    });
    router.post("/trip", (req, res) => {
        res.send("Hello World");
    });
    router.put("/trip:id", (req, res) => {
        res.send("Hello World");
    });
    router.delete("/trip:id", (req, res) => {
        res.send("Hello World");
    });

    return router;
};

export default tripsRouter;