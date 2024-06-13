import request from 'supertest';
import login, { type UserTest } from './utils/loginTest';
import type { User } from '@prisma/client';

describe('User handling', () => {
    const userTest: UserTest = {
        name: 'User for User Test',
        email: 'user@users.com',
        phoneNumber: '1234567890',
        profilePictureURL: 'https://example.com/image.jpg',
    };
    let createdUser: User;
    let createdUserPassword: string;
    let createdUserToken: string;

    beforeAll(async () => {
        const { user, password, token } = await login(userTest);
        createdUser = user;
        createdUserPassword = password;
        createdUserToken = token;
    });

    it('should get a user by ID', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/users/${createdUser.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`)

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            phoneNumber: createdUser.phoneNumber,
            profilePictureURL: createdUser.profilePictureURL,
            createdAt: createdUser.createdAt.toISOString(),
            updatedAt: createdUser.updatedAt.toISOString(),
        });
    });

    it('should update a user by ID', async () => {
        const response = await request('http://localhost:3000')
            .put(`/api/users/${createdUser.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({
                name: 'User Test Updated',
                email: 'emailtestupdated@usertestupdated.com',
                phoneNumber: '0987654321',
                profilePictureURL: 'https://example.com/testupdated.jpg',
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            phoneNumber: createdUser.phoneNumber,
            profilePictureURL: createdUser.profilePictureURL,
            createdAt: createdUser.createdAt.toISOString(),
            updatedAt: createdUser.updatedAt.toISOString(),
        });
    });

    it('should delete a user by ID', async () => {
        const response = await request('http://localhost:3000')
            .delete(`/api/users/${createdUser.id}`)
            .set('Authorization', `Bearer ${createdUserToken}`)
            .send({ password: createdUserPassword })

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});