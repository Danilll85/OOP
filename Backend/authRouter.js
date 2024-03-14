import Router from "express";
import controller from "./authController.js";
import admin from "./models/Admin.js";
import cart from "./models/ShopingCart.js";
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

router.post(
    "/SellerReg",
    [
        check("username", "Имя пользователя не может быть пустым").notEmpty(),
        check(
            "password",
            "Пароль должен быть длинее 4 и меньше 10 символов"
        ).isLength({ min: 4, max: 10 }),
    ],
    controller.sellerRegistration
);

router.post("/SellerLogIn", controller.sellerLogin);
router.get("/users", controller.getUsers);
//router.get("/users", authMiddleware(["USER"]), controller.getUsers);
//roleMiddleware(["USER"])
//module.exports = router;

router.post(
    "/AdminModeration",
    [
        check(
            "productTitle",
            "Название товара не должно быть пустым"
        ).notEmpty(),
        check(
            "productDescription",
            "Описание товара не должно быть пустым"
        ).notEmpty(),
        check("productPrice", "Добавьте фото товара").notEmpty(),
        check("productPrice", "Цена товара не должно быть пустой").notEmpty(),
    ],
    admin.addProduct
);

router.post(
    "/ShopingCart",
    check("token", "нет токена").notEmpty(),
    cart.showUserName
);

router.post(
    "/ShopingCartAddLoyalityPoints",
    check("token", "нет токена").notEmpty(),
    cart.addLoyalityPoints
);

router.post("/AddToCart", cart.addProduct);

export default router;
