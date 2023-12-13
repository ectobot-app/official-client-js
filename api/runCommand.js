import axios from "axios";

export default function runCommand(channel, userstate, message, userType) {
    // TODO: Use axios to make a request to the API

    const API_URL = process.env.API_URL || 'http://localhost:8000'

    const BOT_TOKEN = process.env.BOT_TOKEN

    const headers = {
        'Authorization': 'Bearer ' + BOT_TOKEN,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    const data = {
        channel: channel,
        userstate: userstate,
        message: message,
        userType: userType
    }

    let response = axios.post(`${API_URL}/client/command`, data, { headers: headers })
        .then(function (response) {

            // Return the response
            return response.data
        })
        .catch(function (error) {
            // handle error
            console.log(error);
            // Return an array
            return {
                noResponse: true
            };
        })

    return response;

}