import { MongoClient } from "mongodb";

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

            delete obj.listOfProducts;
            delete obj.totalprice;
            delete obj.role;

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

    async findUser(db, username, role) {
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

    async getOrder(username) {}
}

export default new DataBase();
