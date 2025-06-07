const jwt = require("jsonwebtoken");


function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.PRIVATE_KEY);
        req.user.id = payload;
        
        next();
        
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

}

module.exports = authMiddleware;