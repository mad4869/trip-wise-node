import { PrismaClient, type ActivityCategory } from '@prisma/client'
import { fakerID_ID as faker, simpleFaker } from '@faker-js/faker'

const prisma = new PrismaClient()

const users = Array.from({ length: 10 }, (_, __) => ({
    id: simpleFaker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    passwordHash: faker.internet.password(),
    profilePictureURL: faker.image.avatar(),
    phoneNumber: faker.phone.number(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
}))

const trips = Array.from({ length: 10 }, (_, i) => ({
    id: simpleFaker.string.uuid(),
    userId: users[i].id,
    title: faker.lorem.sentence({ min: 1, max: 20 }),
    description: faker.lorem.paragraph(),
    destination: faker.location.city(),
    startDate: faker.date.soon(),
    endDate: faker.date.future(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
}))

const itineraries = Array.from({ length: 10 }, (_, i) => ({
    id: simpleFaker.string.uuid(),
    tripId: trips[i].id,
    date: faker.date.soon(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
}))

const activities = Array.from({ length: 10 }, (_, i) => ({
    id: simpleFaker.string.uuid(),
    itineraryId: itineraries[i].id,
    title: faker.lorem.sentence({ min: 1, max: 20 }),
    description: faker.lorem.paragraph(),
    location: faker.location.nearbyGPSCoordinate().join(','),
    startTime: faker.date.soon(),
    endTime: faker.date.future(),
    category: faker.helpers.shuffle(['ACCOMMODATION', 'FOOD', 'TRANSPORT', 'SIGHTSEEING', 'SHOPPING', 'OTHER'])[0] as ActivityCategory,
    detail: { [faker.lorem.word()]: faker.lorem.sentence() },
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
}))

const expenses = Array.from({ length: 10 }, (_, i) => ({
    id: simpleFaker.string.uuid(),
    activityId: activities[i].id,
    title: faker.lorem.sentence({ min: 1, max: 20 }),
    description: faker.lorem.paragraph(),
    amount: parseInt(faker.finance.amount({ min: 10_000, max: 5_000_000 })),
    currency: faker.finance.currencyCode(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
}))

const reminders = Array.from({ length: 10 }, (_, i) => ({
    id: simpleFaker.string.uuid(),
    userId: users[i].id,
    tripId: trips[i].id,
    message: faker.lorem.sentence({ min: 1, max: 20 }),
    time: faker.date.soon(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
}))

async function main() {
    await prisma.user.createMany({
        data: users
    })

    await prisma.trip.createMany({
        data: trips
    })

    await prisma.itinerary.createMany({
        data: itineraries
    })

    await prisma.activity.createMany({
        data: activities
    })

    await prisma.expense.createMany({
        data: expenses
    })

    await prisma.reminder.createMany({
        data: reminders
    })
}

main()
    .then(async () => {
        console.log('Seed completed')
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })