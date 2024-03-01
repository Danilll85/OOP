import express from "express";
import path from "path";

const PORT = 3000;

const app = express();

app.listen(PORT, () => {
    console.log(`Server has been started on port ${PORT}`);
});
