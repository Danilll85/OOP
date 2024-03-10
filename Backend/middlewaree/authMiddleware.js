import jwt from "jsonwebtoken";
import secret from "../config.js";

const check_auth = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res
                .status(403)
                .json({ message: "Пользователь не авторизован" });
        }
        const decodedData = jwt.verify(token, secret.secret); // исправлено на secret.secret
        req.user = decodedData;
        next();
    } catch (err) {
        console.log(err);
        return res.status(403).json({ message: "Пользователь не авторизован" });
    }
};

export default check_auth;
