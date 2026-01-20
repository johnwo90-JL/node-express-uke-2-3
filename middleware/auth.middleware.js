import { verifyToken } from "../controllers/auth.controller";

export function isAuthenticated(validRoles = ["user"]) {
    // validRoles: ["admin", "user", "self"]
    return (req, res, next) => {
        if (!req.headers["authorization"]) {
            res.sendStatus(401);
            return;
        }

        const payload = verifyToken(req.headers["authorization"].split(" ")[1]);

        
        // Check "admin"
        console.log(validRoles);
        if (validRoles.includes("admin") && payload.role !== "admin") {
            // "Admin"-role required
            if (!validRoles.includes("self")) {
                res.sendStatus(403);
                return;
            }
            
            console.log("Not admin, checking \"self\"");
            
            // Check "self"
            if (payload?.user?.id !== req.params?.id) {
                res.sendStatus(403);
                return;
            }
        }

        // Check/default "user" – Default case

        req.payload = payload;

        next();
    };
}