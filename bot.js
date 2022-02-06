const Discord = require('discord.js')
let messageCreate = require('./messageCreate')
const bot = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES']
})

const token = 'OTM4ODgxNzc0MjYyNTU0Njc0.Yfwvyg.i3Xaf4sio0StjQZiq7FvhQPOqe4'

bot.on('ready', () => {
    console.log('RadioZachariasz is online')
})

bot.on('messageCreate', msg => messageCreate.messageCreateHandler(msg))

bot.login(token)