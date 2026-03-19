import { Router } from "express";
import { login, logout, refresh, register } from "#controllers/auth"
import { checkRefreshToken } from "#middlewares/auth"
import multer, { diskStorage } from "multer";

const router = Router()
const storage = diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        const name = file.originalname
        console.log("file name", name);
        const iso8601Date = new Date().toISOString()
        const filename = `${iso8601Date}.${name}`
        cb(null, filename)
    }
})
const upload = multer({ storage })

router.post("/register", upload.single("avatar"), register)
router.post("/login", login)
router.post("/logout", logout)
router.post("/refresh", checkRefreshToken, refresh)
export { router as authRouter }