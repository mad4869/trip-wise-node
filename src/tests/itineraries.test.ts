import request from "supertest";
import cleanup from "./utils/cleanupTest";
import createTrip from "./utils/createTripTest";
import login, { type UserTest } from "./utils/loginTest";
import type { Itinerary, User, Trip } from "@prisma/client";
import type { CreateItineraryInput, UpdateItineraryInput } from "@/handlers/itineraries";

describe('Itineraries handling', () => {
    const userTest: UserTest = {
        name: 'User for Itinerary Test',
        email: 'user@itinerary.com',
        phoneNumber: '1234567890',
        profilePictureURL: 'https://example.com/image.jpg',
    };
    let createdUser: User;
    let createdUserToken: string;
    let createdTrip: Trip;
    let itinerary: Itinerary;

    beforeAll(async () => {
        const { user, token } = await login(userTest);
        const trip = await createTrip(user);
        createdUser = user;
        createdUserToken = token;
        createdTrip = trip;
    });

    afterAll(async () => {
        await cleanup(createdTrip, createdUser);
    });

    it('should create a new itinerary for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/itineraries')
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                tripId: createdTrip.id,
                date: '2022-12-01',
            } satisfies CreateItineraryInput);

        itinerary = response.body.data;

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: itinerary.id,
            tripId: itinerary.tripId,
            date: itinerary.date,
            createdAt: itinerary.createdAt,
            updatedAt: itinerary.updatedAt,
        } satisfies Itinerary);
    });

    it('should get all itineraries by trip for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/itineraries/trips/${createdTrip.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should get an itinerary by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/itineraries/${itinerary.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: itinerary.id,
            tripId: itinerary.tripId,
            trip: { userId: createdUser.id },
            date: itinerary.date,
            createdAt: itinerary.createdAt,
            updatedAt: itinerary.updatedAt,
        } satisfies Itinerary & { trip: { userId: string } });
    });

    it('should update an itinerary by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .put(`/api/itineraries/${itinerary.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                tripId: createdTrip.id,
                date: '2022-12-02',
            } satisfies UpdateItineraryInput);

        itinerary = response.body.data;

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: itinerary.id,
            tripId: itinerary.tripId,
            trip: { userId: createdUser.id },
            date: itinerary.date,
            createdAt: itinerary.createdAt,
            updatedAt: itinerary.updatedAt,
        } satisfies Itinerary & { trip: { userId: string } });
    });

    it('should delete an itinerary by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .delete(`/api/itineraries/${itinerary.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});