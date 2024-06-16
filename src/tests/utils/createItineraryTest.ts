import prisma from "@/db";
import type { Trip } from "@prisma/client";

const createItinerary = async (trip: Trip) => {
    const itinerary = prisma.itinerary.create({
        data: {
            tripId: trip.id,
            date: new Date('2022-12-01'),
        }
    });

    return itinerary
};

export default createItinerary;