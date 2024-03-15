const token = sessionStorage.getItem("token");

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

//Работа с баллами лояльности
const element = document.getElementById("payButton");

const token_2 = sessionStorage.getItem("token");

element.addEventListener("click", async (event) => {
    const role = JSON.parse(sessionStorage.getItem("role"));

    try {
        const listOfProducts = JSON.parse(
            sessionStorage.getItem("listOfProducts")
        );
        const response = await fetch("/auth/ShopingCartAddLoyalityPoints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token_2,
                role: role ? role.role : "USER",
                order: listOfProducts,
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
