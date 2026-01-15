import express from "express";
import * as employeeController from "../controllers/employees.controller";
import { isAuthenticated } from "../middleware/auth.middleware";

const employeesRouter = new express.Router();

// Liste over ansatte
employeesRouter.get("/", isAuthenticated(["admin"]), async (req, res) => {
    const employees = await employeeController.getEmployees();

    console.log(employees); 

    res.json(employees);
});


// Hent én spesifikk ansatt
employeesRouter.get("/:id", isAuthenticated(["user"]), (req, res) => {
    const { id } = req.params;

    if (id !== req.payload.user.id) {
        if (req.payload.role !== "admin") {
            res.sendStatus(403);
            return;
        }
    }

    const employee = employeeController.getEmployeeById(id);

    res.json(employee);
});


// Opprette ny ansatt, uten spesifisert id
employeesRouter.post("/", (req, res) => {
    const body = req.body;
    const result = employeeController.createEmployee(body);

    res.status(201).json(result); // 201 -> Created
});


// Oppdatere data for en ansatt
employeesRouter.patch("/:id",  (req, res) => {
    const { id } = req.params;
    const { body } = req;
    
    const result = employeeController.updateEmployee(id, body);

    res.status(200).json(result);
});


// Oppdatere data for en ansatt basert på id, hvis id ikke eksisterer, 
// opprett en ansatt med den aktuelle id-en.
employeesRouter.put("/:id",  (req, res) => {
    const { id } = req.params;
    const { body } = req;

    const result = employeeController.upsertEmployee(id, body);
    const statusCode = result.status;
    delete result.status;

    res.status(statusCode).json(result);
});


// Sletter en ansatt
employeesRouter.delete("/:id", (req, res) => {
    const { id } = req.params;
    const result = employeeController.deleteEmployee(id);

    const statusCode = result.status;

    res.sendStatus(statusCode);
});


employeesRouter.use((err, req, res, next) => {
    console.log("!!!!!!! Error?", err);

    if (req.headersSent) {
        return;
    }

    console.log("employeesRouter-Error:", err);

    res.status(err.cause).json({ success: false, error: err });
});

export { employeesRouter };

