import express from "express";
import session from "express-session";
import path from "path";
import mongoose from "mongoose";
import authRouter from "./authRouter.js";
import bodyParser from "body-parser";
import dataBase from "./DataBase.js";
import cart from "./models/ShopingCart.js";
import jwt from "jsonwebtoken";
import secret from "./config.js";
import DB from "./DataBase.js";
import { User } from "./models/User.js";
import { Seller } from "./models/Seller.js";
import katalog from "./Katalog.js";
import os from "os";

const PORT = 3000;
const __dirname = path.resolve();

const db = "mongodb://127.0.0.1:27017/Authentification";

// ====================================================
//For Docker
//const db = "mongodb://mongo:27017/Authentification";
// ====================================================

const app = express();

// Для парсинга json из запросов
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRouter);

//подключаем фронт
app.set("views", path.join(__dirname, "../", "/Frontend", "/views"));
app.set("view engine", "ejs");

//Home
app.use(express.static(path.join(__dirname, "../", "/Frontend", "/public")));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/RegStatus", (req, res) => {
    res.render("RegStatus");
});

app.get("/LogInStatus", (req, res) => {
    res.render("LogInStatus");
});

//Authentificaton
app.get("/Reg", (req, res) => {
    res.render("Reg");
});

app.get("/LogIn", (req, res) => {
    res.render("LogIn");
});

app.get("/SellerSwitch", (req, res) => {
    res.render("SellerSwitch");
});

app.get("/SellerReg", (req, res) => {
    res.render("SellerReg");
});

app.get("/SellerLogIn", (req, res) => {
    res.render("SellerLogIn");
});

app.get("/SellerRegStatus", (req, res) => {
    res.render("SellerRegStatus");
});

app.get("/SellerLogInStatus", (req, res) => {
    res.render("SellerLogInStatus");
});

//Search

app.get("/Katalog", (req, res) => {
    const products = katalog.getProducts(); // получаем продукты из сессии или пустой массив, если они не определены

    res.render("Katalog", { products: products });
});

app.get("/CarsKatalog", async (req, res) => {
    try {
        let products = await dataBase.findAllItemsByTheirType("Car", db);

        // Сортируем массив products по полю productTitle
        products.sort((a, b) => {
            const titleA = a.productTitle.toUpperCase();
            const titleB = b.productTitle.toUpperCase();

            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }

            return;
        });

        res.render("CarsKatalog", { products: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});

//Cart
let tmp_0 = undefined;
app.post("/api/cartPoints", (req, res) => {
    tmp_0 = req.body.token;

    if (tmp_0) {
        res.status(200).send("ok");
    } else {
        res.status(500).send("not ok");
    }
});

app.get("/ShopingCart", (req, res) => {
    if (tmp_0) {
        const decodedData = jwt.verify(tmp_0, secret);
        const { loyalityPoints } = decodedData;

        res.render("ShopingCart", {
            products: cart.getlistOfProducts(),
            price: cart.getTotalCount(loyalityPoints),
        });
    } else {
        res.render("ShopingCart", {
            products: [],
            price: [0],
        });
    }
});

//Orders History
let tmp = undefined;
app.post("/api/token", (req, res) => {
    //пост запрос для работы с токеном для получения данных в истории заказов и в избранном
    tmp = req.body.token;

    if (tmp) {
        res.status(200).send("ok");
    } else {
        res.status(500).send("not ok");
    }
});

app.get("/OrdersHistory", async (req, res) => {
    const decodedData = jwt.verify(tmp, secret);

    let orders = await DB.getOrderHistory(decodedData);

    if (orders == undefined) {
        orders = [];
    }

    console.log("user order:", orders);

    res.render("OrdersHistory", { orders });
});

//Order Page (как чек короче)
app.get("/Order", (req, res) => {
    res.render("Order");
});

//Обработчик заказов
app.post("/api/order", async (req, res) => {
    // Обработка запроса для оформления заказа

    const token = req.body.token;

    const decodedData = jwt.verify(token, secret);

    const { username } = decodedData;

    const role = req.body.role;

    const user = await DB.findUser(username, role);

    const _id = user._id;

    let newUser;
    if (user.roles[0] === "USER") {
        newUser = new User(user.username, user.password);
    } else {
        newUser = new Seller(user.username, user.password);
    }

    newUser.addOrder();

    const obj = newUser.getOrderHistory();

    await DB.updateUser(newUser.username, newUser.roles, obj);

    res.send("Order placed successfully");
});

//Добавление в избранное
app.post("/api/favour", async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const obj = req.body;

    const decodedData = jwt.verify(token, secret);

    const { username, roles } = decodedData;

    const check = await DB.addFavoutitesProducts(username, roles, obj);

    console.log(check);

    if (!check) {
        res.status(500).send("Товар уже есть в избранном");
    } else {
        res.status(200).send("товра добавлен в избранное");
    }
});

//Избранное
app.get("/FavouritesProducts", async (req, res) => {
    //Запрос в БД по юзеру, отсюда придёт лист избранного и этот лист уже отгенерим;

    const token = tmp;

    const decodedData = jwt.verify(token, secret);

    const { username, roles } = decodedData;

    let products = await DB.getFavouritesProducts(username, roles);

    products = await DB.convertFromNamesToObjects(products);

    res.render("FavouritesProducts", { products });
});

const start = async () => {
    try {
        mongoose
            .connect(db)
            .then((res) => {
                console.log("Succesfully connect to db");
            })
            .catch((err) => {
                console.log(`Ошибка ${err}`);
            });

        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}`);
        });
    } catch (err) {
        console.error("Started app error", err);
    }
};

start();
