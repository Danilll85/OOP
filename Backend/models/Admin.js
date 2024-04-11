import { Schema, model } from "mongoose";
import Seller from "./Seller.js";
import Product from "./Product.js";
import fs from "fs";
import { validationResult } from "express-validator";
import multer from "multer";

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

            //const { productPhoto } = req.file;

            //console.log(productPhoto);

            //if (!productPhoto) {
            //    return res
            //        .status(400)
            //        .json({ error: "Файл изображения не найден" });
            //}

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

            console.log(typeof fileData);

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
}

export default new Admin();
