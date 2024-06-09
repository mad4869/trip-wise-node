import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

type AuthPayload = { id: string, email: string }
type AuthRequest = Request & { auth?: AuthPayload };

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({
            message: "Unauthorized user not allowed to access this route."
        });
    }

    const token = bearer.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized user not allowed to access this route."
        });
    }

    try {
        const payload = jwt.verify(bearer, process.env.JWT_SECRET as string);
        req.auth = payload as AuthPayload

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: "Unauthorized user not allowed to access this route."
        });
    }
}

export default authMiddleware;