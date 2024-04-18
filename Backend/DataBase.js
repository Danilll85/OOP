import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import secret from "./config.js";
import Katalog from "./Katalog.js";

export class DataBase {
    async findAllItemsByTheirType(type, dbAdress) {
        let client;
        try {
            client = new MongoClient(dbAdress);

            await client.connect();

            const database = client.db();

            const collection = database.collection("products");

            const str = type.toString();

            const result = await collection
                .find({ productType: str })
                .toArray();

            return result;
        } catch (error) {
            throw new Error("Data base connectin error:", error);
        } finally {
            await client.close();

            console.log("Connection closed");
        }
    }

    async updateUser(username, roles, obj) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            let nameOfMongoDBCollection;
            if (roles[0] === "USER") {
                nameOfMongoDBCollection = "users";
            } else if (roles[0] === "SELLER") {
                nameOfMongoDBCollection = "sellers";
            } else {
                throw new Error("Ошибка в updateUser класс DataBase");
            }

            const collection = database.collection(nameOfMongoDBCollection);

            delete obj[0].listOfProducts;
            delete obj[0].role;
            delete obj[0].totalprice;

            await collection.updateOne(
                { username: username },
                { $push: { orders: obj } }
            );
        } catch (err) {
            console.error("updateUser error", err);
        }
    }

    async editInfo(infoForFind, infoForEdit, valueForEdit, role) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            let nameOfMongoDBCollection;
            if (role === "USER") {
                nameOfMongoDBCollection = "users";
            } else if (role === "SELLER") {
                nameOfMongoDBCollection = "sellers";
            } else {
                throw new Error("Ошибка в editInfo класс DataBase");
            }

            const collection = database.collection(nameOfMongoDBCollection);

            await collection.updateOne(
                { username: infoForFind },
                { $inc: { [infoForEdit]: parseInt(valueForEdit) } }
            );

            const obj = await collection.findOne({ username: infoForFind });

            return obj;
        } catch (error) {
            console.error("Data base connectin error:", error);
        } finally {
            await client.close();

            console.log("Connection closed");
        }
    }

    async editProduct(obj) {}

    async findUser(username, role) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            let nameOfMongoDBCollection;

            if (role === "USER") {
                nameOfMongoDBCollection = "users";
            } else if (role === "SELLER") {
                nameOfMongoDBCollection = "sellers";
            } else {
                console.log(role);
                throw new Error("Ошибка в editInfo класс DataBase");
            }

            const collection = database.collection(nameOfMongoDBCollection);

            const result = await collection.findOne({ username: username });

            return result;
        } catch (error) {
            console.error("Data base connectin error:", error);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }
    }

    async addOrder(username, productListJSON, role) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();
            let nameOfMongoDBCollection;
            if (role === "USER") {
                nameOfMongoDBCollection = "users";
            } else if (role === "SELLER") {
                nameOfMongoDBCollection = "sellers";
            } else {
                throw new Error("Ошибка в editInfo класс DataBase");
            }

            const collection = database.collection(nameOfMongoDBCollection);

            await collection.updateOne(
                { username: username },
                { $push: { orders: { order: productListJSON } } }
            );
        } catch (error) {
            console.error("Data base connectin error:", error);
        } finally {
            await client.close();

            console.log("Connection closed");
        }
    }

    async findProducts(name) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            const collection = database.collection("products");

            const result = await collection
                .find({
                    $or: [{ productTitle: { $regex: name, $options: "i" } }],
                })
                .toArray();

            return result;
        } catch (error) {
            console.error("Data base connectin error:", error);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }

        return; //array
    }

    async getOrderHistory(token) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            const { username, roles } = token;
            let collection = undefined;

            if (roles == "USER") {
                collection = database.collection("users");
            } else {
                collection = database.collection("sellers");
            }

            //Переписать запрос к бд,чтобы было для конкретного пользователья, а не для всех
            const result = await collection.findOne({ username: username });

            const orders = result.orders;

            return orders;
        } catch (err) {
            console.error("Data base connectin error:", err);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }
    }

    async addFavoutitesProducts(username, role, obj) {
        let client;
        let flag = true;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            let collection = undefined;

            if (role == "USER") {
                collection = database.collection("users");
            } else {
                collection = database.collection("sellers");
            }

            const user = await collection.findOne({ username: username });

            if (user.favouritesProducts != undefined) {
                user.favouritesProducts.forEach((element) => {
                    if (element.productName === obj.productName) {
                        flag = false;
                    }
                });
            } else {
                flag = true;
            }

            if (!flag) {
                return false;
            }

            //Переписать запрос к бд,чтобы было для конкретного пользователья, а не для всех
            await collection.updateOne(
                { username: username },
                { $push: { favouritesProducts: obj } }
            );

            return true;
        } catch (err) {
            console.error("Data base connectin error:", err);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }
    }

    async getFavouritesProducts(username, role) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            let collection = undefined;
            if (role == "USER") {
                collection = database.collection("users");
            } else {
                collection = database.collection("sellers");
            }

            //Переписать запрос к бд,чтобы было для избранного
            const user = await collection.findOne({ username: username });

            const favProducts = user.favouritesProducts;

            return favProducts;
        } catch (err) {
            console.error("Data base connectin error:", err);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }
    }

    async convertFromNamesToObjects(listOfNames) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            let tmpArr = new Array();

            listOfNames.forEach((element) => {
                tmpArr.push(element.productName);
            });

            console.log(tmpArr);

            //Переписать запрос к бд,чтобы было для избранного
            const products = await database
                .collection("products")
                .find({ productTitle: { $in: tmpArr } })
                .toArray();

            return products;
        } catch (err) {
            console.error("Data base connectin error:", err);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }
    }

    async addRating(productName, value, username, role) {
        let flag = true;
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            const rating = {
                username: username,
                role: role,
                ratingValue: value,
            };

            const product = await database
                .collection("products")
                .findOne({ productTitle: productName });

            //доделать тут
            let check = false;

            if (product.rating) {
                for (let i = 0; i < product.rating.length; i++) {
                    if (
                        product.rating[i].username == username &&
                        product.rating[i].role[0] == role[0]
                    ) {
                        check = true; // т.е отзыв от конкретного пользователя есть
                    }
                }
            }

            if (check == false) {
                await database
                    .collection("products")
                    .updateOne(
                        { productTitle: productName },
                        { $addToSet: { rating: rating } }
                    );
            } else {
                await database.collection("products").updateOne(
                    {
                        productTitle: productName,
                        "rating.username": username,
                    },
                    { $set: { "rating.$.ratingValue": value } }
                );
            }

            return flag;
        } catch (err) {
            console.error("Data base connectin error:", err);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }
    }

    async removeFromFavouritesProducts(username, role, obj) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            let collection = undefined;
            if (role == "USER") {
                collection = database.collection("users");
            } else {
                collection = database.collection("sellers");
            }

            const { productName } = obj;
            await collection.updateOne(
                { username: username },
                { $pull: { favouritesProducts: { productName: productName } } }
            );
        } catch (err) {
            console.error("Data base connectin error:", err);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }
    }

    async removeFromProducts(productTitle, typeOfProduct) {
        let client;
        try {
            client = new MongoClient(
                "mongodb://127.0.0.1:27017/Authentification"
            );

            await client.connect();

            const database = client.db();

            let collection = database.collection("products");

            console.log(productTitle, typeOfProduct);

            await collection.deleteOne({
                productType: typeOfProduct,
                productTitle: productTitle,
            });
        } catch (err) {
            console.error("Data base connectin error:", err);
        } finally {
            if (client) {
                await client.close();
                console.log("Connection closed");
            }
        }
    }
}

export default new DataBase();
