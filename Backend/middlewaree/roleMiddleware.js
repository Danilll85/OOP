// import { secret } from "../config.js";

// export default check_role = function (req, res) {
//     return function (res, req, next) {
//         if (req.method == "OPTIONS") {
//             next();
//         }

//         try {
//             const token = req.headers.authorization.split(" ")[1];

//             if (!token) {
//                 return res
//                     .status(403)
//                     .json({ message: "Пользователь не авторизован" });
//             }
//             const { roles: userRoles } = jwt.verify(token, secret);
//             let hasRole = false;
//             userRoles.forEach((role) => {
//                 if (roles.includes(role)) {
//                     hasRole = true;
//                 }
//             });
//             if (!hasRole) {
//                 return res.status(403).json({ message: "У вас нет доступа" });
//             }
//             next();
//         } catch (err) {
//             console.log(err);
//             return res
//                 .status(403)
//                 .json({ message: "Пользователь не авторизован" });
//         }
//     };
// };
