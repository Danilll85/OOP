import { Schema, model } from "mongoose";

export class Product {
    constructor(productTitle, productDescription, productPhoto, productPrice) {
        this.productTitle = productTitle;
        this.productDescription = productDescription;
        this.productPhoto = productPhoto;
        this.productPrice = productPrice;
    }
}

// Определяем схему для модели Product
const productSchema = new Schema({
    productTitle: { type: String, unique: true, required: true },
    productDescription: { type: String, required: true },
    productPhoto: { type: Buffer, required: true },
    productPrice: [{ type: String, required: true }],
});

// Создаем модель Product на основе схемы
const productModel = model("Product", productSchema);

// Экспортируем модель Product
export default productModel;
