import { Router } from "express";
import type { Itinerary, PrismaClient } from "@prisma/client";

const router = Router();

const itinerariesRouter = (prisma: PrismaClient) => {
    router.get("/itinerary:id", (req, res) => {
        res.send("Hello World");
    });
    router.post("/itinerary", (req, res) => {
        res.send("Hello World");
    });
    router.put("/itinerary:id", (req, res) => {
        res.send("Hello World");
    });
    router.delete("/itinerary:id", (req, res) => {
        res.send("Hello World");
    });

    return router;
};

export default itinerariesRouter;