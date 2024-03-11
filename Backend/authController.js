import User from "./models/User.js";
import Seller from "./models/Seller.js";
//import Role from "./models/Role.js";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import secret from "./config.js";

const generateAccesToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

export class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            console.log(errors);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({ message: "Ошибка при регистрации", errors });
            }
            const { username, password } = req.body;

            const candidate = await User.findOne({ username });

            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует",
                });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const user = new User({
                username,
                password: hashPassword,
                roles: "USER",
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
            const user = await User.findOne({ username });
            if (!user) {
                res.status(400).json({ message: "Пользователь не найден" });
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                res.status(400).json({ message: "Введён не верный пароль" });
            }
            const token = generateAccesToken(user._id, user.roles);
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

            const candidate = await Seller.findOne({ username });

            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует",
                });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const seller = new Seller({
                username,
                password: hashPassword,
                roles: "SELLER",
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
            const seller = await Seller.findOne({ username });
            if (!seller) {
                res.status(400).json({ message: "Пользователь не найден" });
            }

            const validPassword = bcrypt.compareSync(password, seller.password);

            if (!validPassword) {
                res.status(400).json({ message: "Введён не верный пароль" });
            }
            const token = generateAccesToken(seller._id, seller.roles);
            return res.json({ token });
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
