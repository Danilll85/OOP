const elements = document.getElementsByClassName("buy_button");
const buyButtons = Array.from(elements);

buyButtons.forEach((button) => {
    const addButton = button.querySelector("#Add_button");

    addButton.addEventListener("click", () => {
        const productCountInput = button.querySelector(
            'input[name="productCount"]'
        );
        const productName = button.parentElement.querySelector(
            ".product-details h2"
        ).innerText;
        const productPrice = button.parentElement
            .querySelector(".product-details p:nth-child(3)")
            .innerText.split(": ")[1];

        const productCount = productCountInput.value;

        // Отправляем данные на сервер
        const data = {
            productName: productName,
            productPrice: productPrice,
            productCount: productCount,
        };

        const token = sessionStorage.getItem("token");

        // Отправляем запрос POST на сервер с данными о товаре
        fetch("/auth/AddToCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            token: token,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Ошибка при добавлении товара в корзину");
                }
                return response.json();
            })
            .then((data) => {
                // Обработка успешного ответа от сервера

                // Обработка успешного ответа от сервера
                const listOfProductsString = JSON.stringify(data.data);
            })
            .catch((error) => {
                // Обработка ошибок
                console.error("Ошибка:", error);
            });
    });
});

// -------------------------------------------

const token = sessionStorage.getItem("token");

const cart = document.getElementById("KorzinaForItems");

cart.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/cartPoints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token }),
        });
    } catch (err) {
        console.error("Ошибка при отправке токена", err);
    }
    window.location.href = "/ShopingCart";
});

//-------------------------------------------------------
