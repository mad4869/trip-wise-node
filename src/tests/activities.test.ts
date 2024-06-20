import request from 'supertest';
import cleanup from "./utils/cleanupTest";
import createTrip from "./utils/createTripTest";
import createItinerary from "./utils/createItineraryTest";
import login, { type UserTest } from "./utils/loginTest";
import type { Itinerary, User, Trip, Activity } from "@prisma/client";
import type { CreateActivityInput, UpdateActivityInput } from "@/handlers/activities";

describe('Activities handling', () => {
    const userTest: UserTest = {
        name: 'User for Activity Test',
        email: 'user@activity.com',
        phoneNumber: '1234567890',
        profilePictureURL: 'https://example.com/image.jpg',
    };
    let createdUser: User;
    let createdUserToken: string;
    let createdTrip: Trip;
    let createdItinerary: Itinerary;
    let activity: Activity;

    beforeAll(async () => {
        const { user, token } = await login(userTest);
        const trip = await createTrip(user);
        const itinerary = await createItinerary(trip);
        createdUser = user;
        createdUserToken = token;
        createdTrip = trip;
        createdItinerary = itinerary;
    });

    afterAll(async () => {
        await cleanup(createdItinerary, createdTrip, createdUser);
    });

    it('should create a new activity for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/activities')
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                itineraryId: createdItinerary.id,
                title: 'Activity Title',
                description: 'Activity Description',
                location: '17.9527,-166.4422',
                startTime: '2021-09-01T00:00:00.000Z',
                endTime: '2021-09-01T00:00:00.000Z',
                category: 'ACCOMMODATION',
                detail: {
                    key: 'value'
                }
            } satisfies CreateActivityInput);

        activity = response.body.data;

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: activity.id,
            itineraryId: activity.itineraryId,
            title: activity.title,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime,
            endTime: activity.endTime,
            category: activity.category,
            detail: activity.detail,
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt,
        } satisfies Activity);
    });

    it('should get all activities by itinerary for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/activities/itineraries/${createdItinerary.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should get an activity by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/activities/${activity.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: activity.id,
            itineraryId: activity.itineraryId,
            itinerary: { trip: { userId: createdUser.id }, tripId: createdTrip.id },
            title: activity.title,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime,
            endTime: activity.endTime,
            category: activity.category,
            detail: activity.detail,
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt,
        } satisfies Activity & { itinerary: { trip: { userId: string }, tripId: string } });
    });

    it('should update an activity by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .put(`/api/activities/${activity.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                itineraryId: createdItinerary.id,
                title: 'Updated Activity Title',
                description: 'Updated Activity Description',
                location: '17.9527,-166.4422',
                startTime: '2021-09-01T00:00:00.000Z',
                endTime: '2021-09-01T00:00:00.000Z',
                category: 'TRANSPORT',
                detail: {
                    key: 'value'
                }
            } satisfies UpdateActivityInput);

        activity = response.body.data;

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: activity.id,
            itineraryId: activity.itineraryId,
            itinerary: { trip: { userId: createdUser.id }, tripId: createdTrip.id },
            title: activity.title,
            description: activity.description,
            location: activity.location,
            startTime: activity.startTime,
            endTime: activity.endTime,
            category: activity.category,
            detail: activity.detail,
            createdAt: activity.createdAt,
            updatedAt: activity.updatedAt,
        } satisfies Activity & { itinerary: { trip: { userId: string }, tripId: string } });
    });

    it('should delete an activity by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .delete(`/api/activities/${activity.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});