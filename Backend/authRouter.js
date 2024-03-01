import Router from "express";
import controller from "./authController";
import { check } from "express-validator";

const router = new Router();

router.post(
    "/registration",
    [
        check("username", "Имя пользователя не может быть пустым").notEmpty(),
        check(
            "password",
            "Пароль должен быть длинее 4 и меньше 10 символов"
        ).isLength({ min: 4, max: 10 }),
    ],
    controller.registration
);
router.post("/login", controller.login);
router.post("/users", controller.getUsers);

module.exports = router;
