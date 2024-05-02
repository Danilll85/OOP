//import product from "./Product.js";
import jwt from "jsonwebtoken";
import secret from "../config.js";
import { Product } from "./Product.js";
import db from "../DataBase.js";
import Order from "./Order.js";
import { User } from "./User.js";

export class ShopingCart {
    constructor() {
        this.listOfProducts = new Array();
        this.productsInCheck = new Array();
        //this.listOfDiscounts = {
        //    discountByShop: [],
        //    discountBySeller: [],
        //    discountByAdminForUser: [],
        //};
        this.categotyOfDiscount = {
            Car: [],
            Alcohol: [],
            Clothes: [],
            loyalityProgram: 0,
        };
        this.maxDiscount = 0;
        this.totalprice = 0;
    }

    setproductsInCheck(listOfOrder) {
        this.productsInCheck = listOfOrder;
    }

    getproductsInCheck() {
        return this.productsInCheck;
    }

    getlistOfProducts() {
        return this.listOfProducts;
    }

    addProduct(
        productType,
        productName,
        productPrice,
        productCount,
        discountByShop,
        discountBySeller,
        discountByAdminForUser,
        loyalityPoints
    ) {
        console.log("productType,", productType);
        console.log("productName", productName);
        console.log("productPrice", productPrice);
        console.log("productCount", productCount);
        console.log("discountByShop", discountByShop);
        console.log("discountBySeller", discountBySeller);
        console.log("discountByAdminForUser", discountByAdminForUser);

        //write loyality points
        this.categotyOfDiscount["loyalityProgram"] = loyalityPoints;

        let check = false; //Т.е ничего нет

        let arr = Object.values(this.categotyOfDiscount);

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i][j].productName == productName) {
                    console.log(`${arr[i][j].productName} and ${productName}`);
                    console.log(
                        `${arr[i][j].productCount} + ${Number(productCount)}`
                    );
                    this.categotyOfDiscount[productType][j].productCount =
                        arr[i][j].productCount + Number(productCount);

                    check = true; // т.е есть такой товар
                }
            }
        }

        if (!check) {
            const priceInfo = {};
            priceInfo["productType"] = productType;
            priceInfo["productName"] = productName;
            priceInfo["productPrice"] = Number(productPrice.split(" ")[0]);
            priceInfo["productCount"] = Number(productCount);

            console.log("type of discountBySeller ", typeof discountBySeller);
            if (discountByShop != undefined) {
                priceInfo["discountByShop"] = Number(discountByShop);
            }

            if (discountBySeller != undefined) {
                priceInfo["discountBySeller"] = Number(discountBySeller);
                console.log(
                    "discountBySeller in Numbetr",
                    Number(discountBySeller)
                );
            }

            if (discountByAdminForUser != undefined) {
                priceInfo["discountByAdminForUser"] = Number(
                    discountByAdminForUser
                );
            }

            this.categotyOfDiscount[productType].push(priceInfo);
        }

        let convPrice = parseInt(productPrice);
        let convCount = parseInt(productCount);

        let flag = false;
        this.listOfProducts.forEach((element) => {
            if (element.productTitle == productName) {
                element.productCount =
                    element.productCount + Number(productCount);

                flag = true;
            }
        });

        if (flag) {
            return;
        }
        console.log("проверка пройдена");
        const product = new Product(productName, convPrice, convCount);

        this.totalprice += product.getProductPrice;

        this.listOfProducts.push(product);
        console.log(`list of products: `);
        this.listOfProducts.forEach((element) => {
            console.log(element);
        });
    }

    removeProduct(productName) {
        this.listOfProducts = this.listOfProducts.filter((product) => {
            return product.productTitle !== productName;
        });

        for (const category in this.categotyOfDiscount) {
            if (this.categotyOfDiscount.hasOwnProperty(category)) {
                const productsInCategory = this.categotyOfDiscount["Car"];
                this.categotyOfDiscount["Car"] = productsInCategory.filter(
                    (product) => product.productName !== productName
                );
            }
        }

        for (const category in this.categotyOfDiscount) {
            if (this.categotyOfDiscount.hasOwnProperty(category)) {
                const productsInCategory = this.categotyOfDiscount["Alcohol"];
                this.categotyOfDiscount["Alcohol"] = productsInCategory.filter(
                    (product) => product.productName !== productName
                );
            }
        }

        for (const category in this.categotyOfDiscount) {
            if (this.categotyOfDiscount.hasOwnProperty(category)) {
                const productsInCategory = this.categotyOfDiscount["Clothes"];
                this.categotyOfDiscount["Clothes"] = productsInCategory.filter(
                    (product) => product.productName !== productName
                );
            }
        }
    }

    showUserName(decodedData) {
        const call = this.getTotalCount();
        return this.maxDiscount;
    }

    async addLoyalityPoints(username, role) {
        const temp = await db.editInfo(username, "loyalityPoints", 1, role);

        return temp;
    }

    getTotalCount(loyalityPoints) {
        let total = 0;

        let loyalityDiscount;

        loyalityPoints > 5 ? (loyalityDiscount = 5) : (loyalityDiscount = 0);

        let shopDiscount;
        let sellerDiscount;
        let adminDiscount;
        let max = 0;
        let arr = Object.values(this.categotyOfDiscount);

        console.log("Что приходит на расчёт суммы в getTotalCount", arr);

        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (arr[i][j].discountByShop != undefined) {
                    shopDiscount = arr[i][j].discountByShop;
                }
                if (arr[i][j].discountBySeller != undefined) {
                    sellerDiscount = arr[i][j].discountBySeller;
                }
                if (arr[i][j].discountByAdminForUser != undefined) {
                    adminDiscount = arr[i][j].discountByAdminForUser;
                }

                if (
                    shopDiscount == undefined &&
                    sellerDiscount == undefined &&
                    adminDiscount == undefined
                ) {
                    max = loyalityDiscount;
                }
                if (
                    shopDiscount == undefined &&
                    sellerDiscount == undefined &&
                    adminDiscount != undefined
                ) {
                    max = Math.max(adminDiscount, loyalityDiscount);
                }
                if (
                    shopDiscount == undefined &&
                    sellerDiscount != undefined &&
                    adminDiscount == undefined
                ) {
                    max = Math.max(sellerDiscount, loyalityDiscount);
                }
                if (
                    shopDiscount != undefined &&
                    sellerDiscount == undefined &&
                    adminDiscount == undefined
                ) {
                    max = Math.max(shopDiscount, loyalityDiscount);
                }
                if (
                    shopDiscount != undefined &&
                    sellerDiscount != undefined &&
                    adminDiscount != undefined
                ) {
                    max = Math.max(
                        shopDiscount,
                        sellerDiscount,
                        adminDiscount,
                        loyalityDiscount
                    );
                }
                if (
                    shopDiscount == undefined &&
                    sellerDiscount != undefined &&
                    adminDiscount != undefined
                ) {
                    max = Math.max(
                        sellerDiscount,
                        adminDiscount,
                        loyalityDiscount
                    );
                }
                if (
                    shopDiscount != undefined &&
                    sellerDiscount == undefined &&
                    adminDiscount != undefined
                ) {
                    max = Math.max(
                        shopDiscount,
                        adminDiscount,
                        loyalityDiscount
                    );
                }
                if (
                    shopDiscount != undefined &&
                    sellerDiscount != undefined &&
                    adminDiscount == undefined
                ) {
                    max = Math.max(
                        shopDiscount,
                        sellerDiscount,
                        loyalityDiscount
                    );
                }

                console.log(arr[i][j].productCount);

                total +=
                    arr[i][j].productPrice * arr[i][j].productCount -
                    (arr[i][j].productPrice * arr[i][j].productCount * max) /
                        100;

                console.log(`max ${max}`);
                console.log(`total после применения скидки ${total}`);
            }
        }

        //this.listOfProducts.forEach((element) => {
        //    total +=
        //        parseInt(element.productPrice) * parseInt(element.productCount);
        //});

        console.log(total);

        return total;
    }

    makeOrder(username, listOfProducts, role) {
        const productListJSON = JSON.stringify(listOfProducts);

        const order = new Order(productListJSON);

        return order;
    }

    clearDiscounts() {
        //this.listOfDiscounts.length = 0;
        console.log(this.listOfProducts);
    }
}

export default new ShopingCart();
