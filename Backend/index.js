import express from "express";
import path from "path";
import mongoose from "mongoose";
import authRouter from "./authRouter.js";
import bodyParser from "body-parser";

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

app.get("/Katalog", (req, res) => {
    res.render("Katalog");
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
