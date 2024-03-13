import product from "./Product.js";
import jwt from "jsonwebtoken";
import secret from "../config.js";

export class ShopingCart {
    listOfProducts = new Array();
    totalprice = 0;

    getlistOfProducts() {
        return this.listOfProducts;
    }

    addProduct(product) {
        this.totalprice += product.getProductPrice;
        this.listOfProducts.push(product);
    }

    showUserName(req, res) {
        try {
            const token = req.body.token;

            const decodedData = jwt.verify(token, secret);

            console.log(decodedData);

            // Отправляем имя пользователя обратно на клиент
            res.json({ username: decodedData.username });
        } catch (err) {
            console.log(`Ошибка на сервере (корзиина) ${err}`);
        }
    }
}

export default new ShopingCart();
