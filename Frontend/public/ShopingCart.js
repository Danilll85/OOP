// отправка токена на сервер

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
    })
    .catch((error) =>
        console.error("Ошибка при получении имени пользователя:", error)
    );
