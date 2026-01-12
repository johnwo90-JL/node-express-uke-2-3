const { UserSchemaCreate, UserSchemaUpdate } = require("../schema/user.schema");
const { readJsonDB, writeJsonDB } = require("../util");
const { v4: uuid } = require("uuid");


// Hent ut alle ansatte fra DB (JSON)
function getUsers() {
    const users = readJsonDB("users");

    return users;
}


function getUserById(id) {
    const users = readJsonDB("users");
    const index = users.map(e => e.id).indexOf(id);
    
    if (index === -1) {
        throw new Error(`User with id ${id} doesn't exist!`, { cause: 404 });
    }

    return users[index];
}


function createUser(userData) {
    delete userData.id;
    
    try {
        const validUserData = UserSchemaCreate.parse(userData);
        const users = readJsonDB("users");

        userExists(userData.email);

        users.push(validUserData);
        
        writeJsonDB("users", users);
    
        return { success: true, _created: validUserData };
    } catch (err) {
        if (err.cause) {
            throw err;
        }
        
        console.error(err);
        throw new Error("Invalid user data.", { cause: 400 });
    }

}


function updateUser(id, data) {
    UserSchemaUpdate.parse(data);
    
    const users = readJsonDB("users");
    const index = users.map(e => e.id).indexOf(id);

    if (index === -1) {
        throw new Error(`User with id ${id} doesn't exist!`, { cause: 404 });
    }

    const _old = { ...users[index] };
    const user = { ...users[index], ...data };
    users[index] = user;

    writeJsonDB("users", users);

    return { success: true, _updated: user, _old };
}


function deleteUser(id) {
    const users = readJsonDB("users");
    const index = users.map(e => e.id).indexOf(id);

    if (index === -1) { // Eksisterer ikke, send 404
        throw new Error(`User with id ${id} doesn't exist!`, { cause: 404 });
    }

    users.splice(index, 1);

    writeJsonDB("users", users);

    return { success: true, status: 204, _deletedId: id };
}


function userExists(email) {
    const users = readJsonDB("users");
    if (users.find(e => e.email === email)) {
        throw new Error("User already exists.", { cause: 409 });
    }
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};