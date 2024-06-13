import prisma from "@/db";
import type { User } from "@prisma/client";

const createTrip = async (user: User) => {
    const trip = prisma.trip.create({
        data: {
            userId: user.id,
            title: 'Trip for Itinerary Test',
            description: 'This is a test trip for the itinerary test',
            destination: 'Test City',
            startDate: new Date('2022-12-01'),
            endDate: new Date('2022-12-10'),
        }
    });

    return trip
};

export default createTrip;