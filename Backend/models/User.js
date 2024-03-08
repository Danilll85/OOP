import { Schema, model } from "mongoose";

// переопределить через класс
const User = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: "Role" }],
});

//module.exports = model("User", User);

export default model("User", User);
