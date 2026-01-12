const { Router } = require("express");
const { getUsers, createUser, deleteUser, updateUser } = require("../controllers/users.controller");
const { ZodError } = require("zod");

const userRouter = new Router();

userRouter.get("/", (req, res) => {
    const users = getUsers();

    res.json(users);
});

userRouter.post("/", (req, res) => {
    const { body } = req;

    const result = createUser(body);

    res.json(result);
});

userRouter.patch("/:id", (req, res) => {
    const { id } = req.params; 
    const { body } = req;

    const result = updateUser(id, body);

    res.json(result);
});

userRouter.delete("/:id", (req, res) => {
    const { id } = req.params;

    deleteUser(id);

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

module.exports = { userRouter };