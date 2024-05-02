import { Schema, model } from "mongoose";
import { User } from "./User.js";
import db from "../DataBase.js";
//import Role from "./Role.js";

export class Seller extends User {
    constructor(username, hashPassword) {
        super();
        this.username = username;
        this.password = hashPassword;
        this.roles = ["SELLER"];
    }

    async addDiscount(productTitle, productDiscount, username) {
        const result = await db.addDiscountBySeller(
            productTitle,
            productDiscount,
            username
        );

        return result;
    }
}

const sellerSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: { type: String, default: "SELLER" },
    loyalityPoints: { type: Number, required: true },
});

const sellerModel = model("Seller", sellerSchema);

export default sellerModel;
