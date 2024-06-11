import prisma from '@/db'
import bcrypt from 'bcrypt';
import request from 'supertest';
import type { User } from '@prisma/client';

describe('User handling', () => {
    let user: User;
    let userToken: string;
    const passwordHash = bcrypt.hashSync('passwordtest', 10);

    beforeAll(async () => {
        user = await prisma.user.create({
            data: {
                name: 'User Test',
                email: 'emailtest@usertest.com',
                passwordHash,
                phoneNumber: '1234567890',
                profilePictureURL: 'https://example.com/test.jpg',
            },
        });

        const { body: { data: { token } } } = await request('http://localhost:3000').post('/auth/login').send({
            email: user.email,
            password: 'passwordtest',
        }).expect(200);

        userToken = token;
    });

    afterAll(async () => {
        await prisma.user.delete({
            where: {
                id: user.id,
            },
        });
    });

    it('should get a user by ID', async () => {
        const response = await request('http://localhost:3000')
            .get(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${userToken}`)

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePictureURL: user.profilePictureURL,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        });
    });

    it('should update a user by ID', async () => {
        const response = await request('http://localhost:3000')
            .put(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                name: 'User Test Updated',
                email: 'emailtestupdated@usertestupdated.com',
                phoneNumber: '0987654321',
                profilePictureURL: 'https://example.com/testupdated.jpg',
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toEqual({
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profilePictureURL: user.profilePictureURL,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        });
    });

    it('should delete a user by ID', async () => {
        const response = await request('http://localhost:3000')
            .delete(`/api/users/${user.id}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});