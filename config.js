import express from "express";
import { logger } from "./middleware/logEvents.js";
import path from "node:path";
import cors from "cors";
import cookieParser from "cookie-parser";
import { useRequestId } from "./middleware/useRequestId.middleware.js";


const whitelist = ["https://www.minHjemmeside.com", "http://127.0.0.1:5500", "http://localhost:3500"];
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS!"));
        }
    }, optionSuccessStatus: 200
}

function configureApp(app) {
    app.use(express.urlencoded({extended:false}));
    app.use(useRequestId);
    app.use(cookieParser());
    app.use(express.json());
    console.log(path.dirname("/"))
    app.use(express.static(path.join(process.cwd(), "/public")));
    app.use(cors(corsOptions));
    app.use(logger);

    // app.use(function (feil, req, res, next)
    // {
    //     console.error(feil.stack)
    //     res.status(500).send(feil.message);
    //     next();
    // });
}


export { configureApp };