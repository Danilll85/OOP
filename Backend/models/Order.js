import ShopingCart from "./ShopingCart.js";

export class Order extends ShopingCart {
    date = new Date();

    pay() {
        //логика для оплаты
    }
}
