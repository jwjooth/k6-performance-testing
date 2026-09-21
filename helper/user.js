import {check, fail} from "k6";
import http from "k6/http";

export function createUser(request) {
    const res = http.post("http://localhost:3000/api/users", JSON.stringify(request), {
        headers: {
            Accept: "application/json", "Content-Type": "application/json",
        },
    });

    const checkRegistration = check(res, {
        "registration response status must 200": (val) => val.status === 200,
        "registration response username must match": (val) =>
            val.status === 200 && val.json("data.username") === request.username,
    });

    if (!checkRegistration) {
        fail(`failed when trying to create user: ${res.status} ${res.body || res.error || ""}`);
    }

    return res;
}

export function getCurrentUser(responseBody) {
    const currentResponse = http.get("http://localhost:3000/api/users/current", {
        headers: {
            Accept: "application/json", Authorization: responseBody.data.token,
        },
    });

    const checkCurrent = check(currentResponse, {
        "current response status must 200": (val) => val.status === 200,
        "current response data must not null": (val) =>
            val.status === 200 && val.json("data") !== null,
    });

    if (!checkCurrent) {
        fail(currentResponse.error);
    }

    return currentResponse
}