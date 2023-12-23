/**
 * Ectobot - The Twitch Bot That's Literally You
 */

import 'dotenv/config'

import { Client } from 'tmi.js'
import { hotRestart, checkForHotRestart } from "./helpers.js";

const BOT_DEV = process.env.BOT_DEV || false

const CHANNEL_NAME = process.env.TWITCH_USERNAME

import runCommand from "./api/runCommand.js";

var client = new Client({
    options: { debug: BOT_DEV },
    identity: {
        username: CHANNEL_NAME,
        password: process.env.TWITCH_TOKEN
    },
    channels: [ CHANNEL_NAME ]
});

client.connect().catch(console.error);

/**
 * Connected event handler
 */
client.on('connected', (address, port) => {
    console.log(`Successfully connected to Twitch at ${address}:${port}!`);

    if(checkForHotRestart()){
        // We are restarting the bot
        client.say(CHANNEL_NAME, 'Ectobot has been restarted!')
    }
});

/**
 * Message event handler
 */
client.on("message", (channel, userstate, message, self) => {

    // Don't listen to my own messages..
    if (self) return;

    let userType = '';

    if(userstate.username === CHANNEL_NAME){
        // The user is the channel owner
        userType = 'broadcaster'
    }
    else if(userstate.mod){
        // The user is a moderator
        userType = 'moderator'
    }
    else if(userstate.subscriber){
        // The user is a subscriber
        userType = 'subscriber'
    }
    else if(userstate.badges.vip){
        // The user is a VIP
        userType = 'vip'
    }
    else{
        // The user is a viewer
        userType = 'viewer'
    }

    if(BOT_DEV){
        console.log('User type: ', userType);
    }

    // Handle different message types..
    if(userstate["message-type"] === 'chat') {
        // This is a chat message..
        // Check if the message is a command, (aka starts with !)
        if(message.startsWith('!')) {

            if(userType === 'broadcaster') {
                // These are a few commands that only the broadcaster can use

                // !ectoRestart
                if(message === '!ectoRestart') {
                    // Restart the bot
                    client.say(channel, 'Restarting the bot...')
                    hotRestart();
                    process.exit(0)
                }

                // !ectoUptime
                if(message === '!ectoUptime') {
                    // Get the uptime of the bot
                    let uptime = process.uptime()
                    let uptimeString = ''
                    if(uptime > 3600) {
                        let hours = Math.floor(uptime / 3600)
                        uptimeString += `${hours} hour${hours > 1 ? 's' : ''} `
                        uptime -= hours * 3600
                    }
                    if(uptime > 60) {
                        let minutes = Math.floor(uptime / 60)
                        uptimeString += `${minutes} minute${minutes > 1 ? 's' : ''} `
                        uptime -= minutes * 60
                    }
                    uptimeString += `${Math.floor(uptime)} second${uptime > 1 ? 's' : ''}`
                    client.say(channel, `Ectobot Uptime: ${uptimeString}`)
                }
            }

            // Run the command and save the result to a variable
            let result = runCommand(channel, userstate, message, userType)

            // Result is a promise, so we need to wait for it to resolve
            // before we can do anything with it
            result.then((result) => {
                // If the key 'noResponse' is true, don't send a response back to the user
                if(result.noResponse === true) {
                    return;
                }

                // If the key 'message' is defined, send the message back to the user
                if(result.message) {
                    client.say(channel, result.message)
                    return;
                }

                // If the key 'messages' is defined, send each message back to the user
                if(result.messages) {
                    result.messages.forEach((message) => {
                        client.say(channel, message)
                        return;
                    })
                }
            })
        }

        // Increment the message count
        messageCount++
        if(BOT_DEV) {
            console.log('Message count: ', messageCount)
        }
    }
});

/**
 * Message count per minute
 */
let messageCount = 0

/**
 * Timer event handler
 */
setInterval(() => {
    // TODO: Send the message count to the API

    // Reset the message count
    messageCount = 0
}, 60000)