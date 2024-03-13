const elements = document.getElementsByClassName("buy_button");

const buyButtons = Array.from(elements);

buyButtons.forEach((button) => {
    const addButton = button.querySelector("#Add_button"); // Находим кнопку "Добавить в корзину" в текущем блоке

    addButton.addEventListener("click", () => {
        // Ваша логика обработки нажатия на кнопку "Добавить в корзину"
        const productCountInput = button.querySelector(
            'input[name="productCount"]'
        );
        const productCount = productCountInput.value;
        const productTitle = productCountInput.id.replace("productCount", ""); // Получаем заголовок товара из ID

        // Здесь можно выполнить действия с полученными данными
        console.log(
            `Добавляем товар "${productTitle}" в корзину в количестве ${productCount}`
        );
    });
});
