import express from "express";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readJsonDB } from "../util";
import { login } from "../controllers/auth.controller";

const authRouter = new express.Router();

// authRouter.get("/verify/:id", (req, res) => {
//     const { password } = req.body;
//     const { id } = req.params;

//     const users = readJsonDB("users");

//     const user = users.find(e => e.id === id);

//     console.log(`Comparing password "${password}" with existing hash...`);
//     const result = bcrypt.compareSync(password, user.password);
//     console.log("Result:",result);

//     const accessToken = jwt.sign({
//         role: user.role,
//         user: {
//             id
//         }
//     }, "foobar12"); // .env, miljøvarabeldefinisjonsfil

//     res.json(accessToken);
// });


authRouter.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    try {
        res.json(login(email, password));
    } catch (err) {
        res.sendStatus(401);
        return;
    }
});


export { authRouter }