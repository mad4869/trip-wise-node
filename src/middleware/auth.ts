import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export type AuthPayload = { id: string, email: string }
export type AuthRequest = Request & { auth?: AuthPayload };

const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;

    if (!bearer) {
        return res.status(401).json({
            message: "There is no authorization present."
        });
    }

    const token = bearer.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "There is no token provided."
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string, { algorithms: ["HS256"] });
        req.auth = payload as AuthPayload

        next();
    } catch (error) {
        console.error(error);

        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                message: "Token is invalid."
            });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: "Token has expired."
            });
        }

        return res.status(401).json({
            message: "Unauthorized user not allowed to access this route."
        });
    }
}

export default authMiddleware;