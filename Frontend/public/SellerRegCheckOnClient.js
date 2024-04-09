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
        const response = await fetch("/auth/SellerReg", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            window.location.href = "/";
            //window.location.href = "/SellerRegStatus";
        } else {
            const errorMessage = await response.text();
            alert("Ошибка аутентификации: " + errorMessage);
            return;
        }
    } catch (error) {
        console.error("Ошибка входа:", error);
        // Обработка ошибки входа
    }
});
