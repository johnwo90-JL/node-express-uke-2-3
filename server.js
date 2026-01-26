//imports
//third party imports
import express from "express";
import path from "node:path";
import { populateRoutes } from "./routes/index.js";

import { configureApp } from "./config.js";

const app = express();

//Port definition
const PORT = process.env.PORT || 3500;

// Configure app
configureApp(app);

// Set up routes
populateRoutes(app);

// ...catch-all => 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(process.cwd(), "view", "404.html"));
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));