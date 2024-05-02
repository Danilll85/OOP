import Router from "express";
import controller from "./authController.js";
import admin from "./models/Admin.js";
import { Seller } from "./models/Seller.js";
import cart from "./models/ShopingCart.js";
import { body, check } from "express-validator";
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

router.post("/AdminLogIn", controller.adminLogin);

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

router.post("/ShopingCart", (req, res) => {
    const token = req.body.token;

    const decodedData = jwt.verify(token, secret);

    let maxDiscount = cart.showUserName(decodedData);
    console.log("Максимальная скидка: ", maxDiscount);
    res.json({
        username: decodedData.username,
        loyalityPoints: decodedData.loyalityPoints,
        maxDiscount: maxDiscount,
    });
});

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

router.post("/AddToCart", (req, res) => {
    const {
        productType,
        productName,
        productPrice,
        productCount,
        discountByShop,
        discountBySeller,
        discountByAdminForUser,
    } = req.body;
    console.log(discountByShop);
    const token = req.headers["authorization"].split(" ")[1];

    const decodedData = jwt.verify(token, secret);

    const { loyalityPoints } = decodedData;

    cart.addProduct(
        productType,
        productName,
        productPrice,
        productCount,
        discountByShop,
        discountBySeller,
        discountByAdminForUser,
        loyalityPoints
    );

    res.status(200).send();
});

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

router.post("/addDisountBySeller", async (req, res) => {
    const { productTitle, productDiscount, token } = req.body;

    const decodedData = jwt.verify(token, secret);

    const { username } = decodedData;

    console.log(productTitle, productDiscount, username);

    let seller = new Seller();

    const result = await seller.addDiscount(
        productTitle,
        productDiscount,
        username
    );

    seller = null;

    if (result) {
        res.status(200).send("Скидка успешно добавлена");
    } else {
        res.status(500).send("Произошла ошибка");
    }
});

router.post("/addDiscountByAdmin", async (req, res) => {
    const { typeOfProduct, productDiscount } = req.body;

    await admin.addDiscountOnCategory(typeOfProduct, productDiscount);

    res.status(200).send("Скидка на категорию добавлена успешно");
});

router.post("/addDiscountByAdminForUser", async (req, res) => {
    const { username, productDiscount } = req.body;

    let check = await admin.addDiscountForUser(username, productDiscount);

    if (check) {
        res.status(200).send();
    } else {
        res.status(500).send("Ошибка, такого пользователя нет");
    }
});

export default router;
