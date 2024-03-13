const loginForm = document.querySelector(".form_auth_style");

// Обработчик события отправки формы
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    // Получаем данные из формы
    const formData = new FormData(loginForm);
    const username = formData.get("username");
    const password = formData.get("password");

    // Отправляем запрос на сервер для аутентификации
    try {
        const response = await fetch("/auth/LogIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        const { token } = data;
        console.log("Полученный токен:", token);

        // Сохраняем токен в localStorage
        sessionStorage.setItem("token", token);
        // Перенаправляем пользователя на другую страницу или выполняем другие действия
        // Например, переход на страницу домашнего кабинета
        window.location.href = "/LogInStatus";
    } catch (error) {
        console.error("Ошибка входа:", error);
        // Обработка ошибки входа
    }
});
