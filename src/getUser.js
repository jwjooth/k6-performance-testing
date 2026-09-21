import {check, fail} from "k6";
import http from "k6/http";
import execution from "k6/execution"

export const options = {
    vus: 10, duration: "10s",
};

export default function () {
    const username = `contoh${execution.vu.idInInstance}`

    const loginBody = {
        username: username, password: "rahasia",
    };

    const response = http.post("http://localhost:3000/api/users/login", JSON.stringify(loginBody), {
        headers: {
            Accept: "application/json", "Content-Type": "application/json",
        },
    },);

    const checkLogin = check(response, {
        "login response status must 200": (val) => val.status === 200,
        "login response token must exists": (val) => val.json().data.token !== null,
    });

    if (checkLogin) {
        fail(response.error);
    }

    const responseBody = response.json();

    const currentResponse = http.get("http://localhost:3000/api/users/current", {
        headers: {
            Accept: "application/json", Authorization: responseBody.data.token,
        },
    });

    const checkCurrent = check(currentResponse, {
        "current response status must 200": (val) => val.status === 200,
        "current response data must not null": (val) => val.json().data !== null,
    });

    if (checkCurrent) {
        fail(currentResponse.error);
    }
}
