import request from 'supertest';
import cleanup from "./utils/cleanupTest";
import createTrip from "./utils/createTripTest";
import login, { type UserTest } from "./utils/loginTest";
import type { User, Trip, Expense, Reminder } from "@prisma/client";
import type { CreateReminderInput, UpdateReminderInput } from '@/handlers/reminders';

describe('Reminders handling', () => {
    const userTest: UserTest = {
        name: 'User for Reminder Test',
        email: 'user@reminder.com',
        phoneNumber: '1234567890',
        profilePictureURL: 'https://example.com/image.jpg',
    };
    let createdUser: User;
    let createdUserToken: string;
    let createdTrip: Trip;
    let reminder: Reminder;

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

    it('should create a new reminder for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/reminders')
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                tripId: createdTrip.id,
                message: 'Reminder Message',
                time: '2021-09-01T00:00:00.000Z',
            } satisfies CreateReminderInput);

        reminder = response.body.data;

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: reminder.id,
            userId: reminder.userId,
            tripId: reminder.tripId,
            message: reminder.message,
            time: reminder.time,
            createdAt: reminder.createdAt,
            updatedAt: reminder.updatedAt,
        } satisfies Reminder);
    });

    it('should get all reminders for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/reminders`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should get a reminder by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/reminders/${reminder.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: reminder.id,
            userId: reminder.userId,
            tripId: reminder.tripId,
            message: reminder.message,
            time: reminder.time,
            createdAt: reminder.createdAt,
            updatedAt: reminder.updatedAt,
        } satisfies Reminder);
    });

    it('should update a reminder by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .put(`/api/reminders/${reminder.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                tripId: createdTrip.id,
                message: 'Updated Reminder Message',
                time: '2021-09-01T00:00:00.000Z',
            } satisfies UpdateReminderInput);

        reminder = response.body.data;

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: reminder.id,
            userId: reminder.userId,
            tripId: reminder.tripId,
            message: reminder.message,
            time: reminder.time,
            createdAt: reminder.createdAt,
            updatedAt: reminder.updatedAt,
        } satisfies Reminder);
    });

    it('should delete a reminder by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .delete(`/api/reminders/${reminder.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});