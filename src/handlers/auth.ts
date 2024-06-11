import prisma from "@/db";

export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    return user;
};

export const registerUser = async (
    name: string,
    email: string,
    passwordHash: string,
) => {
    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            passwordHash,
        }
    });

    return newUser;
};