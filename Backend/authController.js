import User from "./models/User";
import Role from "./models/Role";
import bcrypt from "bcryptjs";
import validationResult from "express-validator";
import jwt from "jsonwebtoken";

const generateAccesToken = (id, roles) => {
    const payload = {
        id, 
        roles
    }
    return jwt.sign(payload, )
}

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            
            if(!errors.isEmpty()){
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const { username, password } = req.body;
            
            const candidate = await User.findOne({ username });
            
            if (candidate) {
                return res.status(400).json({
                    message: "Пользователь с таким именем уже существует",
                });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            if(/* Если продавец, то */){
                const userRole = await Role.findOne({ value: "SELLER" });
            }else{
                const userRole = await Role.findOne({ value: "USER" });
            }

            const user = new User({ username, password: hashPassword, roles: [userRole.value]});

            await user.save();
            return res.json({message: "Пользователь успешно зарегистрирован"}); // возвращаем ответ на клиент
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Registration error" });
        }
    }

    async login(req, res) {
        try {
            const {username, password} = req.body;
            const user = await User.findOne({ username });
            if(!user){
                res.status(400).json({ message: "Пользователь не найден" });
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if(!validPassword){
                res.status(400).json({ message: "Введён не верный пароль" });
            }
            const token = generateAccesToken;
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: "Login error" });
        }
    }

    async getUsers(req, res) {
        try {
            const userRole = new Role();
            const sellerRole = new Role({ value: "SELLER" });
            const adminRole = new Role({ value: "ADMIN" });

            // Сохранить в бд
            await userRole.save();

            res.json("server work");
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new authController();
