import express from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readJsonDB } from "../util";

function login(email, password) {
    const users = readJsonDB("users");
    const user = users.find(e => e.email === email);

    console.log(`Comparing password "${password}" with existing hash...`);
    const result = bcrypt.compareSync(password, user.password);
    console.log("Result:",result);

    if (!result) {
        res.status(401).json({ success: false, error: "Invalid credentials." });
        throw new Error("Invalid credentials.");
    }

    const accessToken = jwt.sign({
        role: user.role,
        user: {
            id: user.id
        }
    }, "foobar12", {
        expiresIn: "3h"
    }); // .env, miljøvarabeldefinisjonsfil

    const refreshToken = jwt.sign({}, "foobar12", { expiresIn: "7d" }); // .env, miljøvarabeldefinisjonsfil

    return { success: true, accessToken, refreshToken };
}

function verifyToken(token) {
    return jwt.verify(token, "foobar12");
}

export { login, verifyToken };