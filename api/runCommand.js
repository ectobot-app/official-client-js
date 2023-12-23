import axios from "axios";
import https from "https";
import {headers} from "./helpers.js";

export default function runCommand(channel, userstate, message, userType) {
    // TODO: Use axios to make a request to the API

    const API_URL = process.env.API_URL || 'http://localhost:8000'


    const BOT_DEV = process.env.BOT_DEV || false

    if(BOT_DEV){
        // Disable SSL verification
        axios.defaults.httpsAgent = new https.Agent({
            rejectUnauthorized: false
        });
    }

    const data = {
        channel: channel,
        userState: userstate,
        message: message,
        userType: userType
    }

    let response = axios.post(`${API_URL}/command`, data, { headers: headers })
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