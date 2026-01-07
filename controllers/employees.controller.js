const { readJsonDB, writeJsonDB } = require("../util");


// Hent ut alle ansatte fra DB (JSON)
function getEmployees() {
    const employees = readJsonDB("employees");

    return employees;
}


function getEmployeeById(id) {
    const employees = readJsonDB("employees");
    const index = employees.map(e => e.id).indexOf(id);
    
    if (index === -1) {
        throw new Error(`Employee with id ${id} doesn't exist!`, { status: 404 });
    }

    return employees[index];
}

function createEmployee(employeeData) {
    delete employeeData.id;
    
    // ... validering ...

    const employees = readJsonDB("employees");
    employeeData.id = employees[employees.length-1].id + 1;
    employees.push(employeeData);
    
    writeJsonDB("employees", JSON.stringify(employees));

    return { success: true, _inserted: employeeData };
}




module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee
};