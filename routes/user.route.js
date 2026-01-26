import express from "express";
import * as userController from "../controllers/users.controller";
import * as bcrypt from "bcrypt";
import { isAuthenticated } from "../middleware/isAuthenticated.middleware";
import { useValidate } from "../middleware/useValidate.middleware";
import { UserSchemaCreate } from "../schema/user.schema";

const userRouter = new express.Router();

userRouter.get("/", isAuthenticated(["admin"]), async (req, res) => {
    const users = await userController.getUsers();

    console.log("GET /users", users)

    res.json(users);
});

userRouter.get("/:id", isAuthenticated(["admin", "self"]), async (req, res) => {
    // Inndatavalidering !!

    const user = await userController.getUserById(req.params?.id);

    console.log(`GET /users/${req.params?.id}`, user);

    res.json(user);
});

userRouter.post("/", isAuthenticated(["admin"]), useValidate({ bodySchema: UserSchemaCreate }), async (req, res) => {
    const { body } = req;
    const { password } = body;

    const hash = bcrypt.hashSync(password, 10);
    body.password = hash;

    const result = await userController.createUser(body);

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

    if (/(jwt)|(token)/i.test(err.name)) {
        console.log("JWT/Token error");
        res.status(401).json({ success: false });
        return;
    }

    res.status(err?.cause ?? 400).json({ success: false, error: err });
})

export { userRouter };