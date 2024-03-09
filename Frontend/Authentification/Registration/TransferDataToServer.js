// Получение значений логина и пароля из формы
const email = document.querySelector('input[name="auth_email"]').value;
const password = document.querySelector('input[name="auth_pass"]').value;

// Создание объекта с данными для отправки на сервер
const data = {
    email: email,
    password: password,
};

// Опции для fetch()
const options = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
};

// URL, на который будет отправлен запрос
const url = "/auth/registration";

// Отправка запроса на сервер
fetch(url, options)
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        // Обработка ответа от сервера
        console.log(data);
    })
    .catch((error) => {
        // Обработка ошибок
        console.error("There was a problem with the fetch operation:", error);
    });
