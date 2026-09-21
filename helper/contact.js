import {check, fail} from "k6";
import http from "k6/http";

export function createContact(contact, token) {
    return http.post(
        "http://localhost:3000/api/contacts",
        JSON.stringify(contact),
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `${token}`,
            },
        },
    );
}

export function createToken(request) {
    const res = http.post(
        "http://localhost:3000/api/users/login",
        JSON.stringify(request),
        {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        },
    );

    const loginSuccess = check(res, {
        "login status is 200": (val) => val.status === 200,
        "login token exists": (val) => val.json("data.token") != null,
    });

    if (!loginSuccess) {
        fail(`Login failed: ${res.status} ${res.body}`);
    }

    return res;
}