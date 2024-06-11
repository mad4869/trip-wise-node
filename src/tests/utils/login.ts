import prisma from "@/db";
import bcrypt from 'bcrypt';
import request from 'supertest';
import type { User } from "@prisma/client";

export type UserTest = Omit<User, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt'>;

const login = async (userTest: UserTest) => {
    const password = 'passwordtest';
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name: userTest.name || 'User Test',
            email: userTest.email || 'usertest@email.com',
            passwordHash,
            phoneNumber: userTest.phoneNumber || '1234567890',
            profilePictureURL: userTest.profilePictureURL || 'https://example.com/image.jpg',
        },
    });

    const { body: { data: { token } } } = await request('http://localhost:3000').post('/auth/login').send({
        email: user.email,
        password,
    }).expect(200);

    return { user, password, token };
};

export default login;