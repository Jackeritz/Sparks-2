// Copyright (c) 2025 Jackeritz
require('dotenv').config();
const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers] });

let currencyName = 'Credits';
let customCommands = {};
let userBalances = {};

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'play') {
        const reward = Math.floor(Math.random() * 100) + 1;
        const userId = message.author.id;
        userBalances[userId] = userBalances[userId] || { cash: 0, bank: 0 };
        userBalances[userId].cash += reward;
        message.reply(`You played and earned ${reward} ${currencyName}! Your current cash balance is ${userBalances[userId].cash}.`);
    } else if (command === 'eternal') {
        const userId = message.author.id;
        userBalances[userId] = userBalances[userId] || { cash: 0, bank: 0 };
        const chance = Math.random();
        if (chance < 0.7) {
            const reward = Math.floor(Math.random() * 100) + 1;
            userBalances[userId].cash += reward;
            message.reply(`You received a blessing! You earned ${reward} ${currencyName}!`);
        } else {
            const reward = Math.floor(Math.random() * 500) + 1;
            userBalances[userId].cash += reward;
            message.reply(`You received a great blessing! You earned ${reward} ${currencyName}!`);
        }
    } else if (command === 'infernal') {
        const userId = message.author.id;
        userBalances[userId] = userBalances[userId] || { cash: 0, bank: 0 };
        const chance = Math.random();
        const amount = Math.floor(Math.random() * 50) + 1;
        if (chance < 0.5) {
            userBalances[userId].cash += amount;
            message.reply(`You made a deal with a devil! You gained ${amount} ${currencyName}!`);
        } else {
            userBalances[userId].cash -= amount;
            if (userBalances[userId].cash < 0) userBalances[userId].cash = 0;
            message.reply(`You angered a devil! You lost ${amount} ${currencyName}!`);
        }
    } else if (command === 'freeplay') {
        const userId = message.author.id;
        userBalances[userId] = userBalances[userId] || { cash: 0, bank: 0 };
        const chance = Math.random();
        const amount = Math.floor(Math.random() * 200) + 1;
        if (chance < 0.5) {
            userBalances[userId].cash += amount;
            message.reply(`You won ${amount} ${currencyName}!`);
        } else {
            userBalances[userId].cash -= amount;
            if (userBalances[userId].cash < 0) userBalances[userId].cash = 0;
            message.reply(`You lost ${amount} ${currencyName}!`);
        }
    } else if (command === 'balance') {
        const userId = message.author.id;
        userBalances[userId] = userBalances[userId] || { cash: 0, bank: 0 };
        message.reply(`Cash: ${userBalances[userId].cash} ${currencyName}\nBank: ${userBalances[userId].bank} ${currencyName}`);
    } else if (command === 'deposit') {
        const amount = parseInt(args[0]);
        const userId = message.author.id;
        userBalances[userId] = userBalances[userId] || { cash: 0, bank: 0 };
        if (isNaN(amount) || amount <= 0) return message.reply('Please provide a valid amount to deposit.');
        if (userBalances[userId].cash < amount) return message.reply('You do not have enough cash to deposit.');
        userBalances[userId].cash -= amount;
        userBalances[userId].bank += amount;
        message.reply(`You deposited ${amount} ${currencyName}. Your new cash balance is ${userBalances[userId].cash} and bank balance is ${userBalances[userId].bank}.`);
    } else if (command === 'withdraw') {
        const amount = parseInt(args[0]);
        const userId = message.author.id;
        userBalances[userId] = userBalances[userId] || { cash: 0, bank: 0 };
        if (isNaN(amount) || amount <= 0) return message.reply('Please provide a valid amount to withdraw.');
        if (userBalances[userId].bank < amount) return message.reply('You do not have enough in your bank to withdraw.');
        userBalances[userId].bank -= amount;
        userBalances[userId].cash += amount;
        message.reply(`You withdrew ${amount} ${currencyName}. Your new cash balance is ${userBalances[userId].cash} and bank balance is ${userBalances[userId].bank}.`);
    } else if (command === 'setcurrencyname') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("You must be an admin to use this command.");
        currencyName = args.join(" ");
        message.reply(`Currency name set to ${currencyName}`);
    } else if (command === 'addcommand') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("You must be an admin to use this command.");

        if (args.length < 2) return message.reply('Usage: !addcommand <command_name> <response>');

        const newCommandName = args.shift().toLowerCase();
        const newCommandResponse = args.join(' ');

        customCommands[newCommandName] = (message, args) => {
            message.channel.send(newCommandResponse);
        };

        message.reply(`Command !${newCommandName} added.`);
    } else if (customCommands[command]) {
        customCommands[command](message, args);
    }
});
