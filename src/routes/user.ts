import { checkAuth } from "#middlewares/auth"
import { Router } from "express"
import { getUsers } from "#controllers/user"

const router = Router()
router.get("/", checkAuth, getUsers)

export { router as usersRouter }