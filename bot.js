const Discord = require('discord.js')
let messageCreate = require('./messageCreate')
const bot = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES']
})

// hidden for github
const token = require('./config.json').botToken

bot.on('ready', () => {
    console.log('RadioZachariasz is online')
})

bot.on('messageCreate', msg => messageCreate.messageCreateHandler(msg))

bot.login(token)