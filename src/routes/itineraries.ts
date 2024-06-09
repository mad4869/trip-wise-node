import { Router } from "express";
import { PrismaClient, type Itinerary } from "@prisma/client";

const itinerariesRouter = Router();
const prisma = new PrismaClient();

itinerariesRouter.get("/itinerary:id", (req, res) => {
    res.send("Hello World");
});
itinerariesRouter.post("/itinerary", (req, res) => {
    res.send("Hello World");
});
itinerariesRouter.put("/itinerary:id", (req, res) => {
    res.send("Hello World");
});
itinerariesRouter.delete("/itinerary:id", (req, res) => {
    res.send("Hello World");
});

export default itinerariesRouter;