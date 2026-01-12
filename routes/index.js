console.log("Initializing routes...");

const routes = {
    employees: require("./employees.route").employeesRouter,
    root: require("./root.route").rootRouter,
    users: require("./user.route").userRouter
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

module.exports.routes = routes;
module.exports.populateRoutes = populateRoutes;