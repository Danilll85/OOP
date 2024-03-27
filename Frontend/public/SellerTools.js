//для скрытия кнопок регистрации
if (sessionStorage.getItem("token")) {
    document.getElementById("reg_seller_button").style.display = "none";
    document.getElementById("log_in_seller_button").style.display = "none";
}

const element = document.getElementById("addProductForm");
element.addEventListener("submit", async (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение отправки формы

    const roleObj = JSON.parse(sessionStorage.getItem("role"));

    if (roleObj && roleObj.role === "SELLER") {
        // Получаем данные из формы
        const formData = new FormData(element);
        const productTitle = formData.get("productTitle");
        const productDescription = formData.get("productDescription");
        const productPrice = formData.get("productPrice");
        const productPhoto = formData.get("productPhoto").files[0]; // Используем свойство files, а не file
        const typeOfProduct = formData.get("typeOfProduct");

        try {
            const requestData = new FormData(); // Создаем новый объект FormData
            requestData.append("productTitle", productTitle);
            requestData.append("productDescription", productDescription);
            requestData.append("productPrice", productPrice);
            requestData.append("productPhoto", productPhoto);
            requestData.append("typeOfProduct", typeOfProduct);

            const response = await fetch("/auth/AdminModeration", {
                method: "POST",
                body: requestData, // Отправляем объект FormData, содержащий файл
            });

            if (!response.ok) {
                throw new Error("Ошибка при добавлении товара(клиент)");
            }
        } catch (err) {
            console.error("Ошибка отправки товара:", err);
        }
    } else {
        alert("Вы не являетесь продавцом");
    }
});
