import z from "zod";
import * as uuid from "uuid";

const UserSchemaBase = z.object({
    id: z.uuidv4().default(uuid.v4()),
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


export {
    UserSchemaCreate,
    UserSchemaUpdate
}

