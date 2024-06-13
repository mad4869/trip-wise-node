import request from 'supertest';
import login, { type UserTest } from './utils/loginTest';
import cleanup from './utils/cleanupTest';
import type { Trip, User } from '@prisma/client'
import type { CreateTripInput, UpdateTripInput } from '@/handlers/trips';

describe('Trips handling', () => {
    const userTest: UserTest = {
        name: 'User for Trip Test',
        email: 'user@trips.com',
        phoneNumber: '1234567890',
        profilePictureURL: 'https://example.com/image.jpg',
    };
    let createdUser: User;
    let createdUserToken: string;
    let trip: Trip;

    beforeAll(async () => {
        const { user, token } = await login(userTest);
        createdUser = user;
        createdUserToken = token;
    });

    afterAll(async () => {
        await cleanup(createdUser);
    });

    it('should create a new trip for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/trips')
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                title: 'Trip Test',
                description: 'Trip Description',
                destination: 'Test Destination',
                startDate: '2022-12-01',
                endDate: '2022-12-10',
            } satisfies CreateTripInput);

        trip = response.body.data;

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: trip.id,
            userId: trip.userId,
            title: trip.title,
            description: trip.description,
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            createdAt: trip.createdAt,
            updatedAt: trip.updatedAt,
        } satisfies Trip);
    });

    it('should get all trips for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get('/api/trips')
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should get a trip by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/trips/${trip.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: trip.id,
            userId: trip.userId,
            title: trip.title,
            description: trip.description,
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            createdAt: trip.createdAt,
            updatedAt: trip.updatedAt,
        } satisfies Trip);
    });

    it('should update a trip by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .put(`/api/trips/${trip.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                title: 'Trip Test Updated',
                description: 'Trip Description Updated',
                destination: 'Test Destination Updated',
                startDate: '2022-12-01',
                endDate: '2022-12-10',
            } satisfies UpdateTripInput);

        trip = response.body.data;

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: trip.id,
            userId: trip.userId,
            title: trip.title,
            description: trip.description,
            destination: trip.destination,
            startDate: trip.startDate,
            endDate: trip.endDate,
            createdAt: trip.createdAt,
            updatedAt: trip.updatedAt,
        } satisfies Trip);
    });

    it('should delete a trip by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .delete(`/api/trips/${trip.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});