import {check, fail} from "k6";
import http from "k6/http";
import {createContact, createToken} from "../helper/contact.js";
import execution from "k6/execution";

export const options = {
    vus: 10,
    duration: "10s",
};

export function setup() {
    const data = [];
    const totalContacts = Number(__ENV.TOTAL_CONTACT) || 10

    for (let i = 0; i < totalContacts; i++) {
        data.push({
            first_name: "contact",
            last_name: `ke-${i}`,
            email: `contact${i}@gmail.com`,
        });
    }

    return data;
}

export function getToken() {
    const username = `contoh${execution.vu.idInInstance}`
    const request = {
        username: username,
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