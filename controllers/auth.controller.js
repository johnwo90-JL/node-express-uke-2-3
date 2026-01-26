import express from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readJsonDB } from "../util";
import User from "../models/user.model";
import { config } from "../config/env.config";
import RefreshToken from "../models/refresh-token.model";

function generateTokenPair(user) {
    const accessToken = jwt.sign({
        id: user.id,
        role: "user",
    }, config.jwt.secret, {
        expiresIn: config.jwt.accessExpiration
    }); // .env, miljøvarabeldefinisjonsfil

    const refreshToken = jwt.sign({
        id: user.id
    }, config.jwt.secret, { expiresIn: config.jwt.refreshExpiration }); // .env, miljøvarabeldefinisjonsfil

    console.log("Tokens generated!", accessToken.length);

    return { accessToken, refreshToken };
}

async function login(email, password) {
    const user = await User.findOne({
        where: {
            email
        }
    });

    console.log(`Comparing password "${password}" with existing hash...`);
    const result = bcrypt.compareSync(password, user.password);
    console.log("Result:",result);

    if (!result) {
        console.error("Invalid credentials")
        throw new Error("Invalid credentials.", { cause: 401 });
    }

    const tokens = generateTokenPair(user);
    
    try {
        await RefreshToken.upsert({ userId: user.id, token: tokens.refreshToken });
    } catch (err) {
        console.error(err);
        throw new Error("Internal error", { cause: 500 });
    }
    
    return { success: true, ...tokens };
}

function verifyToken(token) {
    return jwt.verify(token, config.jwt.secret);
}

async function verifyRefreshToken(token) {
    const storedRefreshToken = await RefreshToken.findAll({
        where: {
            token
        }
    });

    if (!storedRefreshToken.length) {
        throw new Error("RefreshToken not found.", { cause: 404 });
    }

    return true;
}

export { login, verifyToken, verifyRefreshToken, generateTokenPair };