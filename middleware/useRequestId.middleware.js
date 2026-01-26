
import crypo from "node:crypto";

const useRequestId = (req, res, next) => {
    const requestId = crypo.randomUUID();
    req.headers["X-Request-Id"] = requestId;
    next();
}


export { useRequestId };