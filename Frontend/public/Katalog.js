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

console.log("token:", token);

const cart = document.getElementById("KorzinaForItems");

cart.addEventListener("click", async () => {
    console.log("тутуоталвыаод");
    try {
        const response = await fetch("/api/cartPoints", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: token }),
        });
    } catch (err) {
        console.error("Ошибка при отправке токена", err);
    }
    window.location.href = "/ShopingCart";
});

//-------------------------------------------------------

buyButtons.forEach((button) => {
    const fav = button.querySelector("#favoritesButton");

    fav.addEventListener("click", () => {
        const productName = button.parentElement.querySelector(
            ".product-details h2"
        ).innerText;

        // Отправляем данные на сервер
        const data = {
            productName: productName,
        };

        const token = sessionStorage.getItem("token");

        // Отправляем запрос POST на сервер с данными о товаре
        const response = fetch("/api/favour", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (!response.ok) {
                alert("Такой товар уже есть");
                return;
            }
        });
    });
});

//-------------------------------------------------------------------
//Р - рейтинг!

const ratings = document.querySelectorAll(".rating");

if (ratings.length > 0) {
    initRatings();
}

function initRatings() {
    let ratingActive, ratingValue;

    for (let i = 0; i < ratings.length; i++) {
        const rating = ratings[i];
        initRating(rating);
    }

    function initRating(rating) {
        initRatingVars(rating);
        setRatingActiveWidth();

        if (rating.classList.contains("rating_set")) {
            setRating(rating);
        }
    }

    function initRatingVars(rating) {
        ratingActive = rating.querySelector(".rating_active");
        ratingValue = rating.querySelector(".rating_value");
    }

    function setRatingActiveWidth(index = ratingValue.innerHTML) {
        const ratingActiveWidth = index / 0.05;

        ratingActive.style.width = `${ratingActiveWidth}%`;
    }

    function setRating(rating) {
        const ratingItems = rating.querySelectorAll(".rating_item");
        for (let index = 0; index < ratingItems.length; index++) {
            const ratingItem = ratingItems[index];

            ratingItem.addEventListener("mouseenter", function (e) {
                initRatingVars(rating);
                setRatingActiveWidth(ratingItem.value);
            });

            ratingItem.addEventListener("mouseleave", function (e) {
                setRatingActiveWidth();
            });

            ratingItem.addEventListener("click", function (e) {
                initRatingVars(rating);

                //Отправка на сервер if да else нет

                alert("Доработать отправку на сервер!");

                ratingValue.innerHTML = index + 1;
                setRatingActiveWidth();
            });
        }
    }
}
