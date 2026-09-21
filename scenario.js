import {check} from "k6";
import {createUser} from "./helper/user.js";
import {createContact, createToken} from "./helper/contact.js";
import execution from "k6/execution";
import {Counter} from "k6/metrics";

export const options = {
    thresholds: {
        user_registration_counter_success: ['count>190'],
        user_registration_counter_error: ['count<10'],
    },
    scenarios: {
        userRegistration: {
            exec: "userRegistration",
            executor: "shared-iterations",
            vus: 10,
            iterations: 200,
            maxDuration: '30s'
        },
        contactRegistration: {
            exec: 'contactRegistration',
            executor: 'constant-vus',
            vus: 10,
            duration: '30s'
        }
    }
}

const registerCounterSuccess = new Counter('user_registration_counter_success')
const registerCounterError = new Counter('user_registration_counter_error')

export function userRegistration() {
    const uniqueId = `${new Date().getTime()}-${execution.vu.idInInstance}-${execution.scenario.iterationInTest}`;
    const registerRequest = {
        username: `user-${uniqueId}`,
        password: 'rahasia',
        name: 'jwjooth'
    }

    const response = createUser(registerRequest)
    if (response.status === 200) {
        registerCounterSuccess.add(1)
    } else {
        registerCounterError.add(1)
    }
}

export function contactRegistration() {
    const uniqueSuffix = `${Date.now()}-${execution.vu.idInInstance}-${execution.scenario.iterationInTest}`;
    const username = `contoh-${uniqueSuffix}`;
    const request = {
        username: username,
        password: `rahasia`,
        name: 'test name'
    };

    createUser(request)
    const tokenResponse = createToken({
        username: request.username,
        password: request.password
    })
    const token = tokenResponse.json("data.token")

    const contact = {
        "first_name": "test kontak",
        "last_name": "last test kontak",
        "email": `testcontact-${uniqueSuffix}@gmail.com`
    }


    const response = createContact(contact, token)

    check(response, {
        "create contact status must 200": (val) => val.status === 200,
        "create contact response id must exist": (val) =>
            val.status === 200 && val.json("data.id") != null,
    })
}