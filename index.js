// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const API_URL = 'https://api.coingecko.com/api/v3/coins/markets';
const CURRENCY = 'usd';

client.once('ready', () => {
    console.log('Crypto Tracker Bot is online!');
});

client.on('messageCreate', async (message) => {
    if (message.content.startsWith('!crypto')) {
        const args = message.content.split(' ');
        if (args.length !== 2) {
            return message.channel.send('Usage: !crypto <coin_name>');
        }
        const coinName = args[1].toLowerCase();

        try {
            const response = await axios.get(API_URL, {
                params: {
                    vs_currency: CURRENCY,
                    ids: coinName
                }
            });

            if (response.data.length === 0) {
                return message.channel.send('Cryptocurrency not found.');
            }

            const coin = response.data[0];
            const price = coin.current_price;
            const change24h = coin.price_change_percentage_24h.toFixed(2);

            return message.channel.send(
                `**${coin.name} (${coin.symbol.toUpperCase()})**\n` +
                `Price: $${price}\n` +
                `24h Change: ${change24h}%`
            );
        } catch (error) {
            console.error('Error fetching the cryptocurrency data', error);
            return message.channel.send('Error fetching the cryptocurrency data.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
