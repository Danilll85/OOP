//для скрытия кнопок регистрации
const roleObj = JSON.parse(sessionStorage.getItem("role"));

if (roleObj && roleObj.role === "SELLER") {
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

//let form = document.getElementsByClassName("addProductForm")[0];
let form = document.getElementById("addProductForm");

//Добавить товар
addButton.addEventListener("click", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки

    const roleObj = JSON.parse(sessionStorage.getItem("role"));

    if (roleObj && roleObj.role === "SELLER") {
        // Создаем новый объект FormData и добавляем данные из формы
        const formData = new FormData(form);

        const productTitle = formData.get("productTitle");
        const productDescription = formData.get("productDescription");
        const productPrice = formData.get("productPrice");

        if (
            !(fileInput.files.length > 0) ||
            productTitle == "" ||
            productDescription == "" ||
            productPrice == ""
        ) {
            alert("Добавьте данные в форму");
            return;
        }

        const token = sessionStorage.getItem("token");

        formData.append("token", JSON.stringify(token));
        console.log(formData);
        // Отправляем данные на сервер
        fetch("/auth/AdminModeration", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    alert(
                        "Описание продукта содержит запрещенные слова или фразы."
                    );
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
    } else {
        alert("Вы не являетесь продавцом");
        return;
    }
});

//Удалить товар

const removeButton = document.getElementById("removeItem");

removeButton.addEventListener("click", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки

    const roleObj = JSON.parse(sessionStorage.getItem("role"));

    if (roleObj && roleObj.role === "SELLER") {
        // Создаем новый объект FormData и добавляем данные из формы
        const formData = new FormData(form);

        const productTitle = formData.get("productTitle");
        const typeOfProduct = formData.get("typeOfProduct");

        if (productTitle == "") {
            alert("Добавьте данные в форму");
            return;
        }

        const data = {
            productTitle: productTitle,
            typeOfProduct: typeOfProduct,
        };

        //formData.append("token", JSON.stringify(token));
        // Отправляем данные на сервер
        fetch("/auth/AdminRemove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Ошибка при отправке формы");
                } else {
                    alert("Товар успешно удален");
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
    } else {
        alert("Вы не являетесь продавцом");
        return;
    }
});

//Добавить скидку

const addDiscountButton = document.getElementById("sendDiscount");

let discountForm = document.getElementById("addDiscountForm");

addDiscountButton.addEventListener("click", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки

    const roleObj = JSON.parse(sessionStorage.getItem("role"));

    if (roleObj && roleObj.role === "SELLER") {
        // Создаем новый объект FormData и добавляем данные из формы
        const formData = new FormData(discountForm);

        const productTitle = formData.get("productTitle");
        const productDiscount = formData.get("productDiscount");
        const tokenInfo = sessionStorage.getItem("token");

        const data = {
            productTitle: productTitle,
            productDiscount: productDiscount,
            token: tokenInfo,
        };

        if (productTitle == "" || productDiscount == "") {
            alert("Добавьте данные в форму");
            return;
        }

        fetch("/auth/addDisountBySeller", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => {
                if (!response.ok) {
                    alert(
                        "Произошла ошибка (вы пытаетесь взаимодействовать не с вашим товаром"
                    );
                    throw new Error("Ошибка при отправке формы");
                } else {
                    alert("Скидка успешно добавлена");
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
    } else {
        alert("Вы не являетесь продавцом");
        return;
    }
});
