const element = document.getElementById("OnHomePage");

const token = sessionStorage.getItem("token");

let checkPayment = false; //т.е пока не заплатили

element.addEventListener("click", async (event) => {
    const role = JSON.parse(sessionStorage.getItem("role"));

    if (checkPayment) {
        if (
            confirm(
                "Вы уже совершили заказ. Хотите вернуться на главную страницу?"
            )
        ) {
            window.location.href = "/";
            return;
        } else {
            throw new Error("Вы уже совершили заказ.");
        }
    }
    try {
        const response = await fetch("/api/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: token,
                role: role ? role.role : "USER",
            }),
        });

        if (
            confirm("Спасибо за покупку! Хотите вернуться на главную страницу?")
        ) {
            window.location.href = "/";
        } else {
            checkPayment = true;
        }

        if (!response.ok) {
            alert("проблемы с заказом");
        }
    } catch (error) {
        console.error("Проблемы с формированием заказа: ", error);
    }
});
