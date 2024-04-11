//для скрытия кнопок регистрации
if (sessionStorage.getItem("token")) {
    document.getElementById("reg_seller_button").style.display = "none";
    document.getElementById("log_in_seller_button").style.display = "none";
}

// Находим поле ввода файла
const fileInput = document.getElementById("productPhoto");

// Добавляем обработчик события для изменения файла
fileInput.addEventListener("change", (event) => {
    // Получаем информацию о выбранном файле
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
});

//Находим кнопку "Добавить товар"
const addButton = document.querySelector('button[type="submit"]');

let form = document.getElementsByClassName("addProductForm")[0];

// Добавляем обработчик события на клик по кнопке
addButton.addEventListener("click", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки

    // Создаем новый объект FormData и добавляем данные из формы
    const formData = new FormData(form);

    // Отправляем данные на сервер
    fetch("/auth/AdminModeration", {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Ошибка при отправке формы");
            } else {
                alert("Товар успешно добавлен");
            }
        })
        .then((data) => {
            // Обработка данных
            console.log(data);
        })
        .catch((error) => {
            // Обработка ошибок
            console.error("Ошибка:", error);
        });
});

/*
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
        //const productPhoto = formData.get("productPhoto").files[0];
        const productPhoto = document.getElementById("productPhoto").files[0];
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
*/
