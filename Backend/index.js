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

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.render("home");
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
