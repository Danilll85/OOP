const token = sessionStorage.getItem("token");

//Отображение баллов лояльности
fetch("/auth/ShopingCart", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: token }),
})
    .then((response) => response.json())
    .then((data) => {
        document.getElementById("username").textContent = data.username;
        document.getElementById("userLoyalityPoints").textContent =
            "Баллы лояльности: " + data.loyalityPoints;

        console.log("Loyality points " + data.loyalityPoints);
    })
    .catch((error) =>
        console.error("Ошибка при получении имени пользователя:", error)
    );

//Работа с баллами лояльности и составлением чека
const element = document.getElementById("payButton");

const token_2 = sessionStorage.getItem("token");

element.addEventListener("click", async (event) => {
    const role = JSON.parse(sessionStorage.getItem("role"));

    try {
        //сделать отправку имени, количесвта и стоимости товара

        // Собираем информацию о продуктах
        const productsInfo = [];
        const productContainers =
            document.querySelectorAll(".product-container");
        productContainers.forEach((container) => {
            const productTitle = container.querySelector(
                ".product-details h2"
            ).innerText;
            const productPrice =
                container.querySelector(".product-details p").innerText;
            const productCount = container.querySelector(
                ".product-details p:nth-child(4)"
            ).innerText;

            productsInfo.push({ productTitle, productPrice, productCount });
        });

        const finallSum = document.getElementById("finallSum").innerText;

        console.log("%s", finallSum, typeof finallSum);

        const phoneNumber = document.getElementById("AddPhoneNumber").value;

        console.log("номер телефона", phoneNumber);

        const checkNumbersAndSign = (phoneNumber) => {
            let regex = /^[0-9+]+$/;

            return regex.test(phoneNumber);
        };

        const res = checkNumbersAndSign(phoneNumber);

        console.log("Проверка", res);

        if (!res) {
            alert("Ошибка при вводе телофона");
            throw new Error("Ошибка при вводе номера телефона");
        } else {
            productsInfo.push(phoneNumber);
        }

        const geolocation = document.getElementById("addressInput").value;

        if (!geolocation) {
            alert("Выберите на карте геолокацию");
            throw new Error("Выберите на карте геолокацию");
        } else {
            productsInfo.push(geolocation);
        }

        if (finallSum[7] == "0") {
            alert("Корзина пуста");
            throw new Error("Корзина пуста");
        }

        productsInfo.push(finallSum);

        const response = await fetch("/auth/ShopingCartAddLoyalityPoints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token_2,
                role: role ? role.role : "USER",
                order: productsInfo,
            }),
        }).then((response) => {
            if (response.ok) {
                document.getElementById("userLoyalityPoints").textContent =
                    "Баллы лояльности: " + response.loyalityPoints;
            }
        });

        window.location.href = "/Order";
    } catch (err) {
        console.error("Баллы ...", err);
    }
});

//Работа с календарём

document.getElementById("AddDate").valueAsDate = new Date();

const calendar = document.getElementById("AddDate");

const today = new Date();

// Устанавливаем минимальную дату как сегодняшний день
calendar.min = today.toISOString().split("T")[0];

// Создаем новый объект Date, добавляем к текущей дате 7 дней и устанавливаем максимальную дату как результат
const maxDate = new Date(today);
maxDate.setDate(maxDate.getDate() + 7);
calendar.max = maxDate.toISOString().split("T")[0];

// Обработчик события изменения даты
calendar.addEventListener("change", () => {
    // Если выбранная дата меньше сегодняшней или больше максимальной, устанавливаем значение поля ввода на минимальную или максимальную дату
    const selectedDate = new Date(this.value);
    if (selectedDate < today || selectedDate > maxDate) {
        this.value = today.toISOString().split("T")[0];
    }
});

//Удалить товар

document.addEventListener("DOMContentLoaded", () => {
    const deleteButtons = document.querySelectorAll(".delItem");

    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const productName = button.parentElement.querySelector(
                ".product-details h2"
            ).innerText;

            // Отправляем данные на сервер для удаления товара из корзины
            const data = {
                productName: productName,
            };

            fetch("/api/ChangeShopingCart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            "Ошибка при удалении товара из корзины"
                        );
                    }
                    // Обновляем страницу после успешного удаления
                    location.reload();
                })
                .catch((error) => {
                    console.error("Произошла ошибка:", error);
                    alert("Произошла ошибка при удалении товара из корзины");
                });
        });
    });
});
