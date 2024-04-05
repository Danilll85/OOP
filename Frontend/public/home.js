//Для списка в хедере
const elements = document.getElementsByClassName("menu-item"); // все элементы на странице, которые имеют класс 'menu-item'

document.addEventListener("DOMContentLoaded", () => {
    hideMenuOnLoad();
    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener("mousemove", showMenu); // Обработчик события. Когда происходит событие mousedown на элементе, вызывается функция showMenu
        elements[i].addEventListener("mouseleave", hideMenu);
    }
});

function showMenu() {
    if (this.children.length > 1) {
        // если есть дочерние элементы то идем сюда
        this.children[1].style.height = "auto";
        this.children[1].style.opasity = "1";
        this.children[1].style.overflow = "visible";
    }
}

function hideMenu() {
    if (this.children.length > 1) {
        this.children[1].style.height = "0";
        this.children[1].style.opasity = "0";
        this.children[1].style.overflow = "hidden";
    }
}

function hideMenuOnLoad() {
    const elements = document.getElementsByClassName("menu-item");
    for (let i = 0; i < elements.length; i++) {
        hideMenu.call(elements[i]);
    }
}

// --------------------------------------------------------------------------------------------

//Для Кнопки log out

if (!sessionStorage.getItem("token")) {
    document.getElementById("log_out_button").style.display = "none";
} else {
    document.getElementById("Log_In_button").style.display = "none";
    document.getElementById("Reg_button").style.display = "none";
}

const lout = document.getElementById("log_out_button");

lout.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    window.location.reload();
});

// --------------------------------------------------------------------------------------------

//Для корзины

const cart = document.getElementById("KorzinaForItems");

cart.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/cartPoints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: token }),
        });
    } catch (err) {
        console.log("Ошибка при получении токена", err);
    }

    window.location.href = "/ShopingCart";
});
