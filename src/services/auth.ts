import { getDb } from "#database"
import { compare, hash } from "bcrypt"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import createError from "http-errors"
// import { LoginData } from "#controllers/auth"
// LoginData.pick["email"]
export async function getUser(loginData: { name: string, password: string }) {
    const db = await getDb()
    const allUsers = await db.query("SELECT * FROM users")
    console.log("all users", allUsers);
    const dbUsers = await db.query("SELECT * FROM users WHERE name = ?", [loginData.name])
    db.end()

    if (dbUsers.length === 0) {
        throw createError(StatusCodes.UNAUTHORIZED)
    }
    const dbUser = dbUsers[0]
    if (!(await compare(loginData.password, dbUser.passwordHash))) {
        throw createError(StatusCodes.UNAUTHORIZED)
    }
    return dbUser
}
export async function createAccessToken(loginData: { name: string }): Promise<string> {

    const accesstoken = jwt.sign({ user: { name: loginData.name } }, process.env.JWT_SECRET!, { expiresIn: "1min" })
    return accesstoken
}

export async function createRefreshToken(user: { name: string }): Promise<string> {
    const refreshtoken = jwt.sign({ user: { name: user.name } }, process.env.JWT_SECRET!, { expiresIn: "30d" })
    return refreshtoken
}

export async function createUser(name: string, password: string, avatar?: string): Promise<void> {
    const db = await getDb()
    await db.query("INSERT INTO users (name, passwordHash, avatar) VALUES (?, ?, ?)", [name, await hash(password, 10), avatar])
    db.end()
}