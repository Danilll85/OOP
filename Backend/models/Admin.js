import { Schema, model } from "mongoose";
import Seller from "./Seller.js";
import Product from "./Product.js";
import { validationResult } from "express-validator";

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
                productTitle,
                productDescription,
                productPhoto,
                productPrice,
            } = req.body;

            if (!productPhoto) {
                return res
                    .status(400)
                    .json({ error: "Файл изображения не найден" });
            }

            const candidate = await Product.findOne({ productTitle });

            if (candidate) {
                return res.status(400).json({
                    message: "Продукт с таким именем уже существует",
                });
            }

            const product = new Product({
                productTitle: productTitle,
                productDescription: productDescription,
                productPhoto: productPhoto,
                productPrice: productPrice,
            });

            await product.save();

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
