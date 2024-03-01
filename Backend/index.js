import express from "express";
import path from "path";
import mongoose from "mongoose";

const PORT = 3000;
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "../", "Frontend");
const db = "mongodb://127.0.0.1:27017/Authentification";

console.log(frontendPath);

mongoose
    .connect(db)
    .then((res) => {
        console.log("Succesfully connect to db");
    })
    .catch((err) => {
        console.log(`Ошибка ${err}`);
    });

const app = express();

app.set("views", frontendPath);
app.set("view engine", "ejs");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    res.render("home");
});

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`);
});
