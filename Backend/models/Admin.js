import { Schema, model } from "mongoose";
import Seller from "./Seller.js";
import Product from "./Product.js";
import fs from "fs";
import { validationResult } from "express-validator";
import DB from "../DataBase.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import secret from "../config.js";

export class Admin extends Seller {
    async addProduct(req, res) {
        try {
            const errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка при добавлении товара", errors });
            }

            const {
                typeOfProduct,
                productTitle,
                productDescription,
                //productPhoto,
                productPrice,
            } = req.body;

            const bannedWords = [
                "ПИЗДЕЦ",
                "БЛЯТЬ",
                "ХУЙ",
                "FUCK",
                "ЕБАТЬ",
                "УБИТЬ",
            ]; // Список запрещенных слов и фраз

            const upperCaseDescription = productDescription.toUpperCase();

            const hasBannedWord = bannedWords.some((word) =>
                upperCaseDescription.includes(word)
            );

            if (hasBannedWord) {
                return res.status(400).json({
                    error: "Описание продукта содержит запрещенные слова или фразы.",
                });
            }

            const candidate = await Product.findOne({ productTitle });

            if (candidate) {
                return res.status(400).json({
                    message: "Продукт с таким именем уже существует",
                });
            }

            //считай единственный файл из папки uploads в переменную productPhoto, а затем удали его;
            // Прочитайте файл из диска
            const filePath = "uploads/" + req.file.filename; // Путь к загруженному файлу
            const fileData = fs.readFileSync(filePath);

            const product = new Product({
                productType: typeOfProduct,
                productTitle: productTitle,
                productDescription: productDescription,
                productPhoto: fileData,
                productPrice: productPrice,
            });

            await product.save();

            // Удалите файл с диска после сохранения его в базе данных
            fs.unlinkSync(filePath);

            return res.json({
                message: "Товар успешно добавлен",
            }); // возвращаем ответ на клиент
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Add Product error" });
        }
    }

    async editInfo(req, res) {
        try {
            const errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка при изменении товара", errors });
            }

            const obj = req.body;

            const {
                typeOfProduct,
                productTitle,
                productDescription,
                productPhoto,
                productPrice,
            } = req.body;

            if (productPhoto) {
                // Прочитайте файл из диска
                const filePath = "uploads/" + req.file.filename; // Путь к загруженному файлу
                const fileData = fs.readFileSync(filePath);
            }

            //Ответ из бд
            await DB.editProduct(obj);

            // Удалите файл с диска после сохранения его в базе данных
            if (productPhoto) {
                fs.unlinkSync(filePath);
            }

            return res.json({
                message: "Товар успешно изменён",
            }); // возвращаем ответ на клиент
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Add Product error" });
        }
    }

    async removeItem(productTitle, typeOfProduct) {
        await DB.removeFromProducts(productTitle, typeOfProduct);
    }
}

export default new Admin();
