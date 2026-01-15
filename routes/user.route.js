import express from "express";
import * as userController from "../controllers/users.controller";
import * as bcrypt from "bcrypt";

const userRouter = new express.Router();

userRouter.get("/", async (req, res) => {
    const users = await userController.getUsers();

    console.log("GET /users", users)

    res.json(users);
});

userRouter.post("/", (req, res) => {
    const { body } = req;
    const { password } = body;

    const hash = bcrypt.hashSync(password, 10);
    body.password = hash;

    const result = userController.createUser(body);

    res.json(result);
});

userRouter.patch("/:id", (req, res) => {
    const { id } = req.params; 
    const { body } = req;

    const result = userController.updateUser(id, body);

    res.json(result);
});

userRouter.delete("/:id", (req, res) => {
    const { id } = req.params;

    userController.deleteUser(id);

    res.sendStatus(204);
});


userRouter.use((err, req, res, next) => {
    if (req.headersSent) {
        return;
    }

    try {
        const zodError = JSON.parse(err.message)[0].code;

        switch (zodError) {
            case "unrecognized_keys":
                res.status(400).json({ success: false, error: "Bad request" });
                return;

        }
    } catch (err) { }

    res.status(err.cause).json({ success: false, error: err.message });
})

export { userRouter };