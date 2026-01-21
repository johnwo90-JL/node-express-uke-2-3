import express from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readJsonDB } from "../util";
import User from "../models/user.model";
import { config } from "../config/env.config";
import RefreshToken from "../models/refresh-token.model";

async function generateTokenPair(user) {
    // if (!user.role) {
    //     const tempUser = await User.findByPk(user.id);
    //     user.role = tempUser.role;
    // }

    const accessToken = jwt.sign({
        id: user.id,
        role: "user",
    }, config.jwt.secret, {
        expiresIn: config.jwt.accessExpiration
    }); // .env, miljøvarabeldefinisjonsfil

    const refreshToken = jwt.sign({
        id: user.id
    }, config.jwt.secret, { expiresIn: config.jwt.refreshExpiration }); // .env, miljøvarabeldefinisjonsfil

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
        res.status(401).json({ success: false, error: "Invalid credentials." });
        console.error("Invalid credentials")
        throw new Error("Invalid credentials.");
    }

    const tokens = generateTokenPair(user);

    try {
        // await RefreshToken.upsert({ userId: user.id, token: refreshToken });
    } catch (err) {
        console.error(err);
        return { success: false, err};
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