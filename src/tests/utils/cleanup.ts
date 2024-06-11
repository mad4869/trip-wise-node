import prisma from "@/db";
import type { Activity, Expense, Itinerary, Reminder, Trip, User } from "@prisma/client";

// type CleanupItem = User | Trip | Itinerary | Activity | Expense | Reminder;

const cleanup = async (user: User) => {
    // await prisma.trip.delete({ where: { id: trip.id } });
    await prisma.user.delete({ where: { id: user.id } });
    // for (const item of items) {
    //     if ('name' in item) {
    //         await prisma.user.delete({ where: { id: item.id } });
    //     } else if ('userId' in item && 'tripId' in item) {
    //         await prisma.reminder.delete({ where: { id: item.id } });
    //     } else if ('tripId' in item) {
    //         await prisma.itinerary.delete({ where: { id: item.id } });
    //     } else if ('itineraryId' in item) {
    //         await prisma.activity.delete({ where: { id: item.id } });
    //     } else if ('activityId' in item) {
    //         await prisma.expense.delete({ where: { id: item.id } });
    //     } else if ('userId' in item) {
    //         await prisma.trip.delete({ where: { id: item.id } });
    //     } else {
    //         throw new Error('Invalid item type');
    //     }
    // }
}

export default cleanup;