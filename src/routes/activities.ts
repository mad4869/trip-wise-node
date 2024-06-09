import { Router } from "express";
import { PrismaClient, type Activity } from "@prisma/client";

const activitiesRouter = Router();
const prisma = new PrismaClient();

activitiesRouter.get("/activity:id", (req, res) => {
    res.send("Hello World");
});
activitiesRouter.post("/activity", (req, res) => {
    res.send("Hello World");
});
activitiesRouter.put("/activity:id", (req, res) => {
    res.send("Hello World");
});
activitiesRouter.delete("/activity:id", (req, res) => {
    res.send("Hello World");
});

export default activitiesRouter;