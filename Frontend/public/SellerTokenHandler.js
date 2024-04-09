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
        const response = await fetch("/auth/SellerLogIn", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            alert("Ошибка аутентификации: " + errorMessage);
            return;
        }

        const data = await response.json();
        const { token } = data;
        console.log("Полученный токен:", token);

        const sellerObj = {
            role: "SELLER",
        };

        // Сохраняем токен в localStorage
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", JSON.stringify(sellerObj));
        // Перенаправляем пользователя на другую страницу или выполняем другие действия
        // Например, переход на страницу домашнего кабинета
        //window.location.href = "/LogInStatus";
        window.location.href = "/";
    } catch (error) {
        console.error("Ошибка входа:", error);
        // Обработка ошибки входа
    }
});
