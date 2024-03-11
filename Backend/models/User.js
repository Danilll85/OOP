import { Schema, model } from "mongoose";

// Определяем класс User
export class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.roles = ["USER"];
    }
}

// Определяем схему для модели User
const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, default: "USER" }],
});

// Создаем модель User на основе схемы
const userModel = model("User", userSchema);

// Экспортируем модель User
export default userModel;

/*import { Schema, model } from "mongoose";

// переопределить через класс
const User = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    roles: [{ type: String, ref: "Role" }],
});

//module.exports = model("User", User);

export default model("User", User);
*/
