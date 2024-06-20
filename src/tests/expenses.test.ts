import request from 'supertest';
import cleanup from "./utils/cleanupTest";
import createTrip from "./utils/createTripTest";
import createItinerary from "./utils/createItineraryTest";
import createActivity from './utils/createActivityTest';
import login, { type UserTest } from "./utils/loginTest";
import type { Itinerary, User, Trip, Activity, Expense } from "@prisma/client";
import type { CreateExpenseInput, UpdateExpenseInput } from '@/handlers/expenses';

describe('Expenses handling', () => {
    const userTest: UserTest = {
        name: 'User for Expense Test',
        email: 'user@expense.com',
        phoneNumber: '1234567890',
        profilePictureURL: 'https://example.com/image.jpg',
    };
    let createdUser: User;
    let createdUserToken: string;
    let createdTrip: Trip;
    let createdItinerary: Itinerary;
    let createdActivity: Activity;
    let expense: Expense;

    beforeAll(async () => {
        const { user, token } = await login(userTest);
        const trip = await createTrip(user);
        const itinerary = await createItinerary(trip);
        const activity = await createActivity(itinerary);
        createdUser = user;
        createdUserToken = token;
        createdTrip = trip;
        createdItinerary = itinerary;
        createdActivity = activity;
    });

    afterAll(async () => {
        await cleanup(createdActivity, createdItinerary, createdTrip, createdUser);
    });

    it('should create a new expense for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .post('/api/expenses')
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                activityId: createdActivity.id,
                title: 'Expense Title',
                description: 'Expense Description',
                amount: '100',
                currency: 'USD',
            } satisfies CreateExpenseInput);

        expense = response.body.data;

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: expense.id,
            activityId: createdActivity.id,
            title: expense.title,
            description: expense.description,
            amount: expense.amount,
            currency: expense.currency,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
        } satisfies Expense);
    });

    it('should get all expenses by activity for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/expenses/activities/${createdActivity.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should get an expense by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/expenses/${expense.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: expense.id,
            activityId: createdActivity.id,
            activity: { itinerary: { trip: { userId: createdUser.id }, tripId: createdTrip.id }, itineraryId: createdItinerary.id },
            title: expense.title,
            description: expense.description,
            amount: expense.amount,
            currency: expense.currency,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
        } satisfies Expense &
            { activity: { itinerary: { trip: { userId: string }, tripId: string }, itineraryId: string } });
    });

    it('should update an expense by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .put(`/api/expenses/${expense.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                activityId: createdActivity.id,
                title: 'Updated Expense Title',
                description: 'Updated Expense Description',
                amount: '200',
                currency: 'USD',
            } satisfies UpdateExpenseInput);

        expense = response.body.data;

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: expense.id,
            activityId: createdActivity.id,
            activity: { itinerary: { trip: { userId: createdUser.id }, tripId: createdTrip.id }, itineraryId: createdItinerary.id },
            title: expense.title,
            description: expense.description,
            amount: expense.amount,
            currency: expense.currency,
            createdAt: expense.createdAt,
            updatedAt: expense.updatedAt,
        } satisfies Expense &
            { activity: { itinerary: { trip: { userId: string }, tripId: string }, itineraryId: string } });
    });

    it('should delete an activity by id for a logged in user', async () => {
        const response = await request('http://localhost:3000')
            .delete(`/api/expenses/${expense.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});