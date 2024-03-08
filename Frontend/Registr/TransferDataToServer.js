const { response } = require("express");

const requestURL = "http://localhost:3000";

function sendRequest(method, url, body = null) {
    return fetch(url).then((response) => {
        return response.text();
    });
}

sendRequest("GET", requestURL)
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
