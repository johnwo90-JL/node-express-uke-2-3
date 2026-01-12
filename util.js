
import fs from "node:fs";
import path from "node:path";


/**
 * Reads and converts and returns a JSON-string as an object.
 * @param {string} dbName 
 * @returns {object}
 */
export function readJsonDB(dbName) {
    const filePath = path.join(process.cwd(), "data", `${dbName}.db.json`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File ${dbName} does not exist in "./data"!`);
    }

    const buffer = fs.readFileSync(filePath);
    const obj = JSON.parse(buffer.toString("utf8"));

    return obj;
}

/**
 * Converts and writes an object as a JSON-file.
 * @param {string} dbName 
 * @param {string} data
 */
export function writeJsonDB(dbName, data) {
    const filePath = path.join(process.cwd(), "data", `${dbName}.db.json`);
    
    if (!fs.existsSync(filePath)) {
        throw new Error(`File ${dbName} does not exist in "./data"!`);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 4) , { encoding: "utf8" });
}