// import jwt from "jsonwebtoken";
// import { secret } from "../config";

// export default check_auth = function (req, res, next) {
//     if (req.method == "OPTIONS") {
//         next();
//     }

//     try {
//         const token = req.headers.authorization.split(" ")[1];

//         if (!token) {
//             return res
//                 .status(403)
//                 .json({ message: "Пользователь не авторизован" });
//         }
//         const decodedData = jwt.virify(token, secret);
//         req.user = decodedData;
//         next();
//     } catch (err) {
//         console.log(err);
//         return res.status(403).json({ message: "Пользователь не авторизован" });
//     }
// };
