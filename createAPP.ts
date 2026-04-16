import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "#routes/auth";
import { usersRouter } from "#routes/user";
import { recipesRouter } from "#routes/recipes";
import multer from "multer";

export function createApp() {
    const app = express();

    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
    app.use(express.static("public"));
    app.use("/uploads", express.static("uploads"));
    app.use(express.json());
    app.use(cookieParser());

    app.use("/api/auth", authRouter);
    app.use("/api/users", usersRouter);
    app.use("/api/recipes", recipesRouter);

    return app;
}