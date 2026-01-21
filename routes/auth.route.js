import express from "express";
import { generateTokenPair, login, verifyRefreshToken } from "../controllers/auth.controller";
import RefreshToken from "../models/refresh-token.model";
import { AuthSchemaLogin } from "../schema/auth.schema";
import jwt from "jsonwebtoken";

const authRouter = new express.Router();

authRouter.get("/refresh/:token", async (req, res) => {
    const { token } = req.params;

    try {
        await verifyRefreshToken(token);
        const payloadRefreshToken = jwt.decode(token);
        console.log("token",payloadRefreshToken);
        res.status(200).json({success: true, ...(await generateTokenPair(payloadRefreshToken))});
    } catch (err) {
        console.error(err);
        res.sendStatus(err?.cause ?? 401);
        return;
    }
});


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
        res.json(await login(email, password));
    } catch (err) {
        res.sendStatus(401);
        return;
    }
});


export { authRouter }