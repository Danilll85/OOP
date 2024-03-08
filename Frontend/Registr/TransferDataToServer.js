const requestURL = "http://localhost:3000";

function sendRequest(method, url, body = null) {
    return fetch(url);
}

sendRequest("GET", requestURL)
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
