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

        //formData.append("token", JSON.stringify(token));
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
    } else {
        alert("Вы не являетесь продавцом");
        return;
    }
});

//const editButton = document.getElementById("editProduct");

/*
//Изменить товар
editButton.addEventListener("click", (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение кнопки

    const roleObj = JSON.parse(sessionStorage.getItem("role"));

    if (roleObj && roleObj.role === "SELLER") {
        // Создаем новый объект FormData и добавляем данные из формы
        const formData = new FormData(form);

        const typeOfProduct = formData.get("typeOfProduct");
        const productTitle = formData.get("productTitle");
        const productDescription = formData.get("productDescription");
        const productPrice = formData.get("productPrice");

        let sendData = { typeOfProduct: typeOfProduct };

        if (fileInput.files.length > 0) {
            sendData["productPhoto"] = fileInput;
        } else if (productTitle != "") {
            sendData["productTitle"] = productTitle;
        } else if (productDescription != "") {
            sendData["productDescription"] = productDescription;
        } else if (productPrice == "") {
            sendData["productPrice"] = productPrice;
        } else {
            alert("Добавьте данные в форму");
            return;
        }

        // Отправляем данные на сервер
        fetch("/auth/AdminModeration", {
            method: "POST",
            body: productPrice,
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
    } else {
        alert("Вы не являетесь продавцом");
        return;
    }
});*/
