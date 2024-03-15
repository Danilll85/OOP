import { Schema, model } from "mongoose";
import order from "./Order.js";

// Определяем класс User
export class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.roles = ["USER"];
        this.orders = new Array();
        this.loyalityPoints = 0;
    }

    addOrder() {
        this.orders.push(order.pay(this.username));
    }

    getLoyalityPoints() {
        return this.loyalityPoints;
    }

    getOrderHistory() {
        return this.orders;
    }
}

// Определяем схему для модели User
const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, default: "USER" }],
    loyalityPoints: { type: Number, required: true },
    orders: [{ type: Array }],
});

const userModel = model("User", userSchema);

export default userModel;
