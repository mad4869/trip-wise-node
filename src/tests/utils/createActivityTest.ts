import prisma from "@/db";
import type { Itinerary } from "@prisma/client";

const createActivity = async (itinerary: Itinerary) => {
    const activity = prisma.activity.create({
        data: {
            itineraryId: itinerary.id,
            title: 'Activity Title',
            description: 'Activity Description',
            location: '17.9527,-166.4422',
            startTime: new Date('2021-09-01T00:00:00.000Z'),
            endTime: new Date('2021-09-01T00:00:00.000Z'),
            category: 'ACCOMMODATION',
            detail: {
                key: 'value'
            }
        }
    });

    return activity
};

export default createActivity;