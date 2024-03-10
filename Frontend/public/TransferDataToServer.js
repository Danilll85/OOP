document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registrationForm");

    registrationForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Предотвращаем отправку формы по умолчанию

        // Получение значений email и пароля из формы
        const emailInput = document.getElementById("auth_email");
        const email = emailInput.value;

        const passwordInput = document.getElementById("auth_pass");
        const password = passwordInput.value;

        // Создание объекта с данными для отправки на сервер
        const data = {
            username: email,
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
        const url = "/auth/Reg";

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
                console.error(
                    "There was a problem with the fetch operation:",
                    error
                );
            });
    });
});
