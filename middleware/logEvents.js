//imports
import * as uuid from "uuid";
import * as datefns from "date-fns";
import fs from "node:fs";

//Creates a log if it doesn't exist, and fills it with id, date, and message
const logEvents = async(message, logName) =>
{
    const dateTime = `${datefns.format(new Date(), "ddMMyyyy\tHH:mm:ss")}`;
    const theLog = `${uuid.v4()}\t${dateTime}\t${message}\n`;
    console.log(theLog);
    
    try
    {
        if(!fs.existsSync(path.join(process.cwd(), "logs")))
        {
            await fs.promises.mkdir(join(process.cwd(), "logs"));
        }
        await fs.promises.appendFile(join(process.cwd(),  "logs", logName), theLog)
    }
    catch(err)
    {
        console.error(err)
    }
};

const logger = (req, res, next) =>
{
    logEvents(`${req.method}\t${req.header.origin}\t${req.url}`, "reqLog.txt");
    console.log(`${req.method} ${req.path}`);
    next();
}

export { logEvents, logger };