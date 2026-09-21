import {check, fail} from "k6";
import http from "k6/http";
import {createContact, createToken} from "../helper/contact.js";

export const options = {
    vus: 10,
    duration: "10s",
};

export function setup() {
    const data = [];

    for (let i = 0; i < 10; i++) {
        data.push({
            first_name: "contact",
            last_name: `ke-${i}`,
            email: `contact${i}@gmail.com`,
        });
    }

    return data;
}

export function getToken() {
    const request = {
        username: "contact",
        password: "rahasia",
    };

    const response = createToken(request)

    return response.json("data.token");
}

export default function (data) {
    const token = getToken();

    for (const contact of data) {
        const response = createContact(contact, token)

        check(response, {
            "create contact status is 200": (res) => res.status === 200,
        });
    }
}

export function teardown(data) {
    console.info(`Finished creating ${data.length} contacts`);
}