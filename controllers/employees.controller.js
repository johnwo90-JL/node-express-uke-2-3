const { readJsonDB, writeJsonDB } = require("../util");
const { v4: uuid } = require("uuid");


// Hent ut alle ansatte fra DB (JSON)
function getEmployees() {
    const employees = readJsonDB("employees");

    return employees;
}

// Hent ut én ansatt fra DB (JSON)
function getEmployeeById(id) {
    const employees = readJsonDB("employees");
    const index = employees.map(e => e.id).indexOf(id);
    
    if (index === -1) {
        throw new Error(`Employee with id ${id} doesn't exist!`, { cause: 404 });
    }

    return employees[index];
}

// Opprett en ansatt
function createEmployee(employeeData) {
    delete employeeData.id;
    
    // ... inndatavalidering ...

    const employees = readJsonDB("employees");
    
    employeeData.id = uuid();
    employees.push(employeeData);
    
    writeJsonDB("employees", employees);

    return { success: true, _inserted: employeeData };
}

// Update / PATCH
function updateEmployee(id, updatedEmployeeData) {
    const employees = readJsonDB("employees");
    const index = employees.map(e => e.id).indexOf(id);

    if (index === -1) {
        throw new Error(`Employee with id ${id} doesn't exist!`, { cause: 404 });
    }

    // ... Inndatavalidering ...

    delete updatedEmployeeData.id;

    const _old = { ...employees[index] };
    const employee = { ...employees[index], ...updatedEmployeeData };
    employees[index] = employee;

    writeJsonDB("employees", employees);

    return { success: true, _updated: employee, _old };
}

// Upsert (update & insert) / PUT
function upsertEmployee(id, upsertedEmployeeData) {
    const employees = readJsonDB("employees");
    const index = employees.map(e => e.id).indexOf(id);
    
    // ... Inndatavalidering ... 

    if (upsertedEmployeeData.id && id !== upsertedEmployeeData.id) {
        throw new Error(`id parameter doesn't match id of body: ${id} !== ${upsertedEmployeeData.id}`, { cause: 400 });
    }

    if (index === -1) { // Eksisterer ikke, så vi setter inn den nye dataen i DB
        if (!upsertedEmployeeData.id) {
            throw new Error(`id parameter missing from body!`);
        }

        employees.push(upsertedEmployeeData);
        writeJsonDB("employees", employees);
        return { success: true, status: 201, _inserted: upsertedEmployeeData };
    }
    
    // Ansatt eksisterer, så vi oppdaterer dataen

    delete upsertedEmployeeData.id;
    
    const employee = { ...employees[index], ...upsertedEmployeeData };
    employees[index] = employee;

    writeJsonDB("employees", employees);

    return { success: true, status: 200, _updated: { id, ...upsertedEmployeeData} };
}

// DELETE
function deleteEmployee(id) {
    const employees = readJsonDB("employees");
    const index = employees.map(e => e.id).indexOf(id);

    if (index === -1) { // Eksisterer ikke, send 404
        throw new Error(`Employee with id ${id} doesn't exist!`, { cause: 404 });
    }

    employees.splice(index, 1);

    writeJsonDB("employees", employees);

    return { success: true, status: 204, _deletedId: id };
}


module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    upsertEmployee,
    deleteEmployee
};