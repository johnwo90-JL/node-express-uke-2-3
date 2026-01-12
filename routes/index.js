console.log("Initializing routes...");

import { rootRouter } from "./root.route.js";
import { userRouter } from "./user.route.js";
import { employeesRouter } from "./employees.route.js";

const routes = {
    root: rootRouter,
    users: userRouter,
    employees: employeesRouter,
}

function populateRoutes(app) {
    app.use("/", routes["root"]);
    console.log(`Added routes for collection "root" => "/"`);
    // app.use("/employees", employeesRouter);
    for (const collection in routes) {
        if (collection === "root") continue;

        app.use(`/${collection}`, routes[collection]);
        console.log(`Added routes for collection "${collection}" => "/${collection}"`);
    }
}

console.log("Routes initialized!");

export { 
    routes,
    populateRoutes,
}