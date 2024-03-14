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
}

export default new DataBase();
