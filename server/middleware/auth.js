import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization"); // The token will be set on the authorisation header on the front end, and we can grab it on the backend

        if(!token) {
            return res.status(403).send("Access Denied");
        }

        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Run this function to proceed to the next step of the process

    } catch (err) {
        res.status(500).json({ error: err.message });

    }
};
