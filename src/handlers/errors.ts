import type { NextFunction, Request, Response } from "express";

export const catchAllErrorHandler = (err: Error, _: Request, res: Response, __: NextFunction) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};