import { validationResult } from 'express-validator'
import type { NextFunction, Request, Response } from 'express';

export const inputErrorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: errors.array()
        });
    }

    next();
}