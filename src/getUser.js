import execution from "k6/execution"
import {createUser, getCurrentUser} from "../helper/user.js";

export const options = {
    vus: 10, duration: "10s",
};

export default function () {
    const username = `contoh${execution.vu.idInInstance}`

    const request = {
        username: username, password: "rahasia",
    };

    const response = createUser(request)

    const responseBody = response.json();

    getCurrentUser(responseBody)
}
