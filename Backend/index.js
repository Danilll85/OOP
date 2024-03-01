import express from "express";
import path from "path";

const PORT = 3000;
const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "../", "Frontend");

console.log(frontendPath);

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
