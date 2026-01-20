

import { testConnection, syncDatabase } from "../config/db.config";
import Employee from "../models/employee.model";
import User from "../models/user.model";


testConnection().then(() => {
    syncDatabase();

    // Employee.create({
    //     firstname: ["John", "Jane", "Foo", "Bar"][Math.floor(Math.random()*4)],
    //     lastname: ["Lastnamne", "Doe", "Olsen", "Hansen"][Math.floor(Math.random()*4)],
    //     email: "foo3@bar.com",
    //     phone: "98765432",
    //     position: "Home",
    //     department: "Management"
    // })
    //     .then(res => console.log("DB Seeded:", res))
    //     .catch(err => console.log("Error seeding DB:", err));


    User.create({
        "email": "test2@auth.no",
        "password": "abc123",
        "role": "user"
    })
    .then(res => console.log("DB Seeded:", res))
    .catch(err => console.log("Error seeding DB:", err));
    
    User.create({
            "email": "test@auth.no",
            "password": "abc123",
            "role": "admin"
        })
        .then(res => console.log("DB Seeded:", res))
        .catch(err => console.log("Error seeding DB:", err));

}).catch(err => process.exit(1));






/* ,
    {
        "id": "9a6bcef5-70f8-43eb-b993-c9d9464d3393",
        "email": "test2@auth.no",
        "password": "$2b$10$fSBVSERHNzqcsztYxgNuz.uHKf9l.8mSIWt3g3m1x6T2msaNog7Qe",
        "role": "admin"
    } */