import User from "./models/User.js";
import Seller from "./models/Seller.js";
import bcrypt from "bcryptjs";
import roles from "./models/Role.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import secret from "./config.js";
import DB from "./DataBase.js";

const generateAccesToken = (id, username, roles, loyalityPoints) => {
    const payload = {
        id,
        username,
        roles,
        loyalityPoints,
    };
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

export class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка при регистрации", errors });
            }
            const { username, password } = req.body;

            //const candidate = await User.findOne({ username });
            const candidate = await DB.findUser(username, "USER");
            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует",
                });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const user = new User({
                username: username,
                password: hashPassword,
                roles: "USER",
                loyalityPoints: 0,
            });

            await user.save();
            return res.json({
                message: "Пользователь успешно зарегистрирован",
            }); // возвращаем ответ на клиент
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Registration error" });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            //const user = await user.findOne({ username });
            const user = await DB.findUser(username, "USER");
            console.log("user", user);
            if (user === null) {
                res.status(400).json({ message: "Пользователь не найден" });
                return;
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                res.status(400).json({ message: "Введён не верный пароль" });
            }
            const token = generateAccesToken(
                user._id,
                user.username,
                user.roles,
                user.loyalityPoints
            );
            return res.json({ token });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Login error" });
        }
    }

    async sellerRegistration(req, res) {
        try {
            const errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка при регистрации", errors });
            }
            const { username, password } = req.body;

            //const candidate = await Seller.findOne({ username });
            const candidate = await DB.findUser(username, "SELLER");
            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует",
                });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const seller = new Seller({
                username: username,
                password: hashPassword,
                roles: "SELLER",
                loyalityPoints: 0,
            });

            await seller.save();
            return res.json({
                message: "Пользователь успешно зарегистрирован",
            }); // возвращаем ответ на клиент
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Registration error" });
        }
    }

    async sellerLogin(req, res) {
        try {
            const { username, password } = req.body;
            //const seller = await Seller.findOne({ username });
            const seller = await DB.findUser(username, "SELLER");
            if (!seller) {
                return res
                    .status(400)
                    .json({ message: "Пользователь не найден" });
            }

            const validPassword = bcrypt.compareSync(password, seller.password);

            if (!validPassword) {
                res.status(400).json({ message: "Введён не верный пароль" });
            }
            const token = generateAccesToken(
                seller._id,
                seller.username,
                seller.roles,
                seller.loyalityPoints
            );
            return res.json({ token });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Login error" });
        }
    }

    async adminLogin(req, res) {
        try {
            const { username, password } = req.body;
            const admin = await DB.findUser(username, "ADMIN");
            if (!admin) {
                return res
                    .status(400)
                    .json({ message: "Пользователь не найден" });
            }

            const validPassword = bcrypt.compareSync(password, admin.password);

            console.log(admin);
            console.log(typeof validPassword);

            if (!validPassword) {
                res.status(400).json({ message: "Введён не верный пароль" });
            }
            const token = generateAccesToken(
                admin._id,
                admin.username,
                admin.roles
            );

            const roles = "ADMIN";
            return res.json({ token, roles });
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Login error" });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json("server work");
        } catch (err) {
            console.log(err);
        }
    }
}

//AuthController = new authController();

export default new authController();
