import { type Request, type Response, type NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export function checkAuth(
    req: Request & { cookies: any },
    res: Response,
    next: NextFunction,
) {
    const accessTokenCookie = req.cookies.accessToken!;

    try {
        const token: any = jwt.verify(accessTokenCookie, process.env.JWT_SECRET!);

        const user = token.user;
        // console.log("session user", user);
        if (!user) {
            res.sendStatus(StatusCodes.UNAUTHORIZED);
            return;
        }
        console.log("valid token, processing request...");

        next();
    } catch (error) {
        console.error("Error:", error);
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }
}

export function checkRefreshToken(
    req: Request & { cookies: any },
    res: Response,
    next: NextFunction,
) {
    const refreshTokenCookie = req.cookies.refreshToken!;
    const token: any = jwt.verify(refreshTokenCookie, process.env.JWT_SECRET!);
    const user = token.user;
    if (!user) {
        res.sendStatus(StatusCodes.UNAUTHORIZED);
        return;
    }
    console.log("valid refresh token, processing request...");

    next();
}