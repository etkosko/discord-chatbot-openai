const { Client, Partials, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
const { Configuration, OpenAIApi } = require('openai');


const client = new Client({
    intents:
        [GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessageTyping],

    partials:
        [Partials.Message,
        Partials.Channel,
        Partials.Reaction]
});



client.on("ready", () => {
    console.log("Discord DM Chatbot")
})

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION, //* Get the organization key https://platform.openai.com/account/org-settings
    apiKey: process.env.OPENAI_API_KEY, //* Get the api key https://platform.openai.com/account/api-keys
});

const openai = new OpenAIApi(configuration);

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.channel.type == 1) { // If message came from dm

        message.channel.sendTyping(); // Bot typing...
        try {
            let user = message.author.username; // user is message creater
            let bot = client.user.username; // bot is client

            let prompt = `${bot} is a friendly chatbot and it's owner is Etkosko#9997.\n\ 
            ${message.author.username}: ${message.content}\n\ 
            ${bot}:`; //* you can change prompt and add something dont touch user: & bot:

            const response = await openai.createCompletion({
                prompt,
                model: "text-davinci-003",
                temperature: 0.9,
                max_tokens: 500
            }); // You can change model i used text-davinci-003 you canu se ChatGPT3.5 and you must change propmt

            if (response.data.choices[0].text <= 0) return message.channel.send("Sorry I cant understand what did you say!"); // Maybe some chatgpt return errors
            message.channel.send(response.data.choices[0].text);
            return;
        } catch (e) {
            message.channel.send("Sorry I cant understand what did you say")
        }
    }
});

//* Login
client.login(process.env.token);