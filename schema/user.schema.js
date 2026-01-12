const z = require("zod");
const { v4: uuid } = require("uuid");

const UserSchemaBase = z.object({
    id: z.uuidv4().default(uuid()),
    email: z.email(),
    password: z.string(),
    role: z.enum(["user", "admin"]).default("user"),
    lastLoggedIn: z.number().min(Date.now()).nullable().default(null),
}).strict();

const UserSchemaCreate = UserSchemaBase.omit({
    lastLoggedIn: true,
}).strict();

const UserSchemaUpdate = UserSchemaBase.omit({
    lastLoggedIn: true,
    id: true,
    role: true,
}).partial().strict();


module.exports = {
    UserSchemaCreate,
    UserSchemaUpdate
}

