import Router from "express";
import controller from "./authController.js";
import { check } from "express-validator";
//import authMiddleware from "./middlewaree/authMiddleware.js";
//import roleMiddleware from "./middlewaree/roleMiddleware.js";

const router = new Router();

router.post(
    "/Reg",
    [
        check("username", "Имя пользователя не может быть пустым").notEmpty(),
        check(
            "password",
            "Пароль должен быть длинее 4 и меньше 10 символов"
        ).isLength({ min: 4, max: 10 }),
    ],
    controller.registration
);

router.post("/LogIn", controller.login);
router.get("/users", controller.getUsers);
//router.get("/users", authMiddleware(["USER"]), controller.getUsers);
//roleMiddleware(["USER"])
//module.exports = router;

export default router;
