import { createAccessToken, createRefreshToken, createUser, getUser } from "#services/auth";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { LoginData, RegisterData } from "../models.ts";

export async function login(req: Request, res: Response) {
    try {
        const loginData: LoginData = req.body //LoginData.assert(req.body)
        console.log("login data", loginData);

        const dbUser = await getUser(loginData)
        console.log("dbUser", dbUser);
        const accesstoken = await createAccessToken({ name: loginData.name })
        res.cookie("accessToken", accesstoken, { httpOnly: true, maxAge: 1000 * 60 * 10 })
        const refreshToken = await createRefreshToken({ name: loginData.name })
        res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 })
        res.status(StatusCodes.OK).json({ name: dbUser.name, avatar: dbUser.avatar })
    }
    catch (err) {
        console.log("err", err);
        throw err
    }
}
//ici
export async function logout(req: Request, res: Response) {
    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")
    res.sendStatus(StatusCodes.OK)
}

export async function refresh(req: Request, res: Response) {
    const oldTokenString = req.cookies.accessToken
    const oldToken = jwt.decode(oldTokenString)
    console.log("old token", oldToken);
    const accesstoken = await createAccessToken((oldToken as any).user)
    res.cookie("accessToken", accesstoken, { httpOnly: true, maxAge: 1000 * 60 * 10 })
    const refreshtoken = await createRefreshToken((oldToken as any).user)
    res.cookie("refreshToken", refreshtoken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 })
    res.sendStatus(StatusCodes.OK)
}


export async function register(req: Request, res: Response) {
    const json = req.body
    console.log("json", json.data);

    const data: RegisterData = JSON.parse(json.data)
    if (data.password != data.confirmPassword) {
        throw new Error("Passwords do not match")
    }
    console.log("register data", data);
    console.log("req file", req.file);
    const avatarUrl = req.file ? req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename : undefined;
    await createUser(data.name, data.password, avatarUrl)
    res.sendStatus(StatusCodes.CREATED)
}