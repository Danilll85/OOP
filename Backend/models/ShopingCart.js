//import product from "./Product.js";
import jwt from "jsonwebtoken";
import secret from "../config.js";
import { Product } from "./Product.js";
import db from "../DataBase.js";
import Order from "./Order.js";
import { User } from "./User.js";

export class ShopingCart {
    constructor() {
        this.listOfProducts = new Array();
        this.totalprice = 0;
    }

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

            res.json({ data: this.listOfProducts });
        } catch (err) {
            console.log(
                `Ошибка в addProduct класса ShopingCart ${this.addProduct}`
            );
        }
    };

    showUserName(req, res) {
        try {
            const token = req.body.token;

            const decodedData = jwt.verify(token, secret);

            res.json({
                username: decodedData.username,
                loyalityPoints: decodedData.loyalityPoints,
            });
        } catch (err) {
            console.log(`Ошибка на сервере (корзина) ${err}`);
        }
    }

    async addLoyalityPoints(req, res) {
        const token = req.body.token;

        const decodedData = jwt.verify(token, secret);

        const { username } = decodedData;

        let listOfProducts = req.body.order;

        const role = req.body.role;

        const temp = db.editInfo(username, "loyalityPoints", 1, role);

        res.json(temp);
    }

    getTotalCount(loyalityPoints) {
        let total = 0;

        this.listOfProducts.forEach((element) => {
            total +=
                parseInt(element.productPrice) * parseInt(element.productCount);
        });

        if (loyalityPoints > 5) {
            total = total - (total * 5) / 100;
        }

        return total;
    }

    makeOrder(username, listOfProducts, role) {
        const productListJSON = JSON.stringify(listOfProducts);

        const order = new Order(productListJSON);

        return order;
    }
}

export default new ShopingCart();
