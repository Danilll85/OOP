import express from "express";
import path from "path";
import mongoose from "mongoose";
import authRouter from "./authRouter.js";
import bodyParser from "body-parser";
import dataBase from "./DataBase.js";
import cart from "./models/ShopingCart.js";

const PORT = 3000;
const __dirname = path.resolve();

const db = "mongodb://127.0.0.1:27017/Authentification";
//const db = "mongodb://mongodb:27017/Authentification";

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

// Products
app.get("/Katalog", (req, res) => {
    res.render("Katalog");
});

app.get("/CarsKatalog", async (req, res) => {
    try {
        const products = await dataBase.findAllItemsByTheirType("Car", db);
        res.render("CarsKatalog", { products: products });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Internal Server Error");
    }
});

//Cart
app.get("/ShopingCart", (req, res) => {
    let temp = new Array();

    temp = cart.getlistOfProducts();

    temp.forEach((element) => {
        console.log(temp);
    });

    console.log(`total = ${cart.getTotalCount()}`);
    res.render("ShopingCart", {
        products: cart.getlistOfProducts(),
        price: cart.getTotalCount(),
    });
});

//Orders History
app.get("/OrdersHistory", (req, res) => {
    res.render("OrdersHistory");
});

//Order Page (как чек короче)
app.get("/Order", (req, res) => {
    res.render("Order");
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
        console.log(`Америка тонет братишка \n@ВАХО БРУКЛИН ${err}`);
    }
};

start();
