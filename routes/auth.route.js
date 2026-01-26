import express from "express";
import { generateTokenPair, login, verifyRefreshToken } from "../controllers/auth.controller";
import RefreshToken from "../models/refresh-token.model";
import { AuthSchemaLogin } from "../schema/auth.schema";
import jwt from "jsonwebtoken";
import { config } from "../config/env.config";

const authRouter = new express.Router();


const handleRefreshToken = async (req, res) => {
    const { token } = req.params;

    const headerRefreshToken = req.cookies.refreshToken;

    const actualToken = token || headerRefreshToken || null;

    console.log("Token:",actualToken);

    if (actualToken === null) {
        throw new Error("Bad request", { cause: 400 });
    }

    try {
        await verifyRefreshToken(actualToken);
        const payloadRefreshToken = jwt.decode(actualToken);

        
        const tokens = generateTokenPair(payloadRefreshToken);

        res.cookie("refreshToken", tokens.refreshToken);
        res.status(200).json({success: true, ...tokens});
    } catch (err) {
        console.error(err);
        res.sendStatus(err?.cause ?? 401);
        return;
    }
};

authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/refresh/:token", handleRefreshToken);

authRouter.post("/login", async (req, res) => {
    try {
        AuthSchemaLogin.parse(req.body);
    } catch (err) {
        res.sendStatus(400);
        console.error(err);
        return;
    }

    const { email, password } = req.body;
        
    try {
        const result = await login(email, password);

        res.cookie("refreshToken", result.refreshToken, {
            maxAge: 7*24*60*60*1000,
            httpOnly: true,
            secure: config.env !== "development"
        });
        
        res.json(result);
    } catch (err) {
        console.log(err);
        res.sendStatus(err.cause ?? 401);
        return;
    }
});


export { authRouter }