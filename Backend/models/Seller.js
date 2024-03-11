import { Schema, model } from "mongoose";
import { User } from "./User.js";
//import Role from "./Role.js";

export class Seller extends User {
    constructor(username, hashPassword) {
        this.username = username;
        this.password = hashPassword;
        this.roles = ["SELLER"];
    }
}

const sellerSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: { type: String, default: "SELLER" },
});

const sellerModel = model("Seller", sellerSchema);

export default sellerModel;
