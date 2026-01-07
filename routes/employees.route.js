const { Router } = require("express");
const { getEmployees, getEmployeeById, createEmployee } = require("../controllers/employees.controller");

const employeesRouter = new Router();

// Liste over ansatte
employeesRouter.get("/", (_, res) => {
    const employees = getEmployees();

    res.json(employees);
});


// Hent én spesifikk ansatt
employeesRouter.get("/:id", (req, res) => {
    const { id } = req.params;
    const employee = getEmployeeById(parseInt(id));

    res.json(employee);
});


employeesRouter.post("/", (req, res) => {
    const body = req.body;

    const result = createEmployee(body);

    res.status(201).json(result); // 201 -> Created
});

module.exports.employeesRouter = employeesRouter;

