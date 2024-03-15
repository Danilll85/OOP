const element = document.getElementById("OnHomePage");

const token = sessionStorage.getItem("token");

element.addEventListener("click", async (event) => {
    const role = JSON.parse(sessionStorage.getItem("role"));

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
    } catch (error) {
        console.error("Проблемы с формированием заказа: ", error);
    }
});
