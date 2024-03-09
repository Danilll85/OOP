import express from "express";
import path from "path";
import mongoose from "mongoose";
import authRouter from "./authRouter.js";

const PORT = 3000;
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "../", "Frontend");

const db = "mongodb://127.0.0.1:27017/Authentification";

const app = express();

// Для парсинга json из запросов
app.use(express.json());

app.use("/auth", authRouter);

//подключаем фронт
app.set("views", frontendPath);
app.set("view engine", "ejs");

//Home
app.use(express.static(frontendPath));

//Authentificaton

app.get("/", (req, res) => {
    res.render("home");
});

//Test
app.get("Authentification/Registration", (req, res) => {
    res.render("Reg");
});

app.get("Authentification/LogIn", (req, res) => {
    res.render("LogIn");
});
//

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
