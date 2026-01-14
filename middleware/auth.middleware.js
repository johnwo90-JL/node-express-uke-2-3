import { verifyToken } from "../controllers/auth.controller";

export function isAuthenticated(validRoles = ["user"]) {
    // validRoles: ["admin", "user", "self"]

    return (req, res, next) => {
        console.log("Headers",req.headers["authorization"]);

        if (!req.headers["authorization"]) {
            res.sendStatus(401);
            return;
        }

        const payload = verifyToken(req.headers["authorization"].split(" ")[1]);

        // Check "self" X

        // Check "admin"3
        if (validRoles.includes("admin") && payload.role !== "admin") {
            res.sendStatus(403);
            return;
        }

        // Check/default "user"

        req.payload = payload;

        next();
    };
}