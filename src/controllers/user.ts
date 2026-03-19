import { loadUsers } from "#services/user"
import { StatusCodes } from "http-status-codes"

export function getUsers(req: any, res: any) {

    const users = loadUsers()
    res.status(StatusCodes.OK).json(users)
}