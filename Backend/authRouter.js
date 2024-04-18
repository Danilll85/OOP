import Router from "express";
import controller from "./authController.js";
import admin from "./models/Admin.js";
import cart from "./models/ShopingCart.js";
import { check } from "express-validator";
import order from "./models/Order.js";
import katalog from "./Katalog.js";
import multer from "multer";
import jwt from "jsonwebtoken";
import secret from "./config.js";

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Указываем папку для сохранения файлов
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Сохраняем файл с его оригинальным именем
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // Ограничение на размер файла (в данном случае 10MB)
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Допустимы только изображения"));
        }
    },
});
router.post(
    "/AdminModeration",
    upload.single("productPhoto"),
    admin.addProduct
);

router.post("/AdminRemove", async (req, res) => {
    const data = req.body;

    const { productTitle, typeOfProduct } = data;

    await admin.removeItem(productTitle, typeOfProduct);

    res.status(200).send("Товар удален");
});

router.post(
    "/ShopingCart",
    check("token", "нет токена").notEmpty(),
    cart.showUserName
);

export let infoForCheck = undefined;
router.post(
    "/ShopingCartAddLoyalityPoints",
    check("token", "нет токена").notEmpty(),
    async (req, res) => {
        const token = req.body.token;

        const decodedData = jwt.verify(token, secret);

        const { username } = decodedData;

        const role = req.body.role;

        const products = req.body.order;

        cart.setproductsInCheck(products);

        infoForCheck = products;

        const result = cart.addLoyalityPoints(username, role);

        res.json(result);
    }
);

router.post("/AddToCart", cart.addProduct);

router.post("/CreateOrder", order.pay);

router.post(
    "/Katalog",
    async (req, res) => {
        const { name } = req.body;

        await katalog.search(name);

        res.status(200).send();
    }

    //katalog.search(req, res)
);

//router.post(
//    "/AdminEditModeration",
//    upload.single("productPhoto"),
//    admin.editInfo
//);

export default router;
