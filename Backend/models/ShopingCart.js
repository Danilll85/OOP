//import product from "./Product.js";
import jwt from "jsonwebtoken";
import secret from "../config.js";
import { Product } from "./Product.js";

export class ShopingCart {
    listOfProducts = new Array();
    totalprice = 0;

    getlistOfProducts() {
        return this.listOfProducts;
    }

    addProduct = (req, res) => {
        try {
            const { productName, productPrice, productCount } = req.body;

            let convPrice = parseInt(productPrice);
            let convCount = parseInt(productCount);

            const product = new Product(productName, convPrice, convCount);

            this.totalprice += product.getProductPrice;

            this.listOfProducts.push(product);
        } catch (err) {
            console.log(
                `Ошибка в addProduct класса ShopingCart ${this.addProduct}`
            );
        }
    };

    makeOrder() {
        //додумать логику
    }

    showUserName(req, res) {
        try {
            const token = req.body.token;

            const decodedData = jwt.verify(token, secret);

            console.log(decodedData);

            // Отправляем имя пользователя обратно на клиент
            res.json({ username: decodedData.username });
        } catch (err) {
            console.log(`Ошибка на сервере (корзина) ${err}`);
        }
    }

    getTotalCount() {
        let total = 0;

        this.listOfProducts.forEach((element) => {
            total +=
                parseInt(element.productPrice) * parseInt(element.productCount);

            console.log("в get total conut " + parseInt(element.productPrice));
            console.log("в get total conut " + parseInt(element.productCount));

            console.log(total);
        });

        return total;
    }
}

export default new ShopingCart();
