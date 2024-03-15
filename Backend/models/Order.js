import { ShopingCart } from "./ShopingCart.js";
import cart from "./ShopingCart.js";
import jwt from "jsonwebtoken";
import secret from "../config.js";

export class Order extends ShopingCart {
    constructor(name, price, listOfProducts, role) {
        super(); // конструктор родительского класса
        this.username = name;
        this.role = role;
        this.date = new Date();
        this.total = price;
        this.orderTime = `${this.date.getDate()} : ${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`;
        this.products = listOfProducts;
    }

    pay(username, role) {
        let price = cart.getTotalCount();
        let listOfProducts = cart.listOfProducts;
        let order = new Order(username, price, listOfProducts);
        return order;
    }

    getOrderTime() {
        return this.orderTime;
    }
}

export default new Order();
