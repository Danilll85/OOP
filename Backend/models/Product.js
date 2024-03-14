import { Schema, model } from "mongoose";

export class Product {
    constructor(productTitle, productPrice, productCount) {
        this.productTitle = productTitle;
        this.productPrice = productPrice;
        this.productCount = productCount;
    }

    getProductPrice() {
        return this.productPrice;
    }
}

// Определяем схему для модели Product
const productSchema = new Schema({
    productType: { type: String, required: true },
    productTitle: { type: String, unique: true, required: true },
    productDescription: { type: String, required: true },
    productPhoto: { type: Buffer, required: true },
    productPrice: [{ type: String, required: true }],
});

// Создаем модель Product на основе схемы
const productModel = model("Product", productSchema);

// Экспортируем модель Product
export default productModel;
