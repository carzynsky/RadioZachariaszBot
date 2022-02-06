const prefix = require('./aliases.json').prefix
const ytdl = require('ytdl-core')
const { joinVoiceChannel, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const randomGreetings = ['Bug wybacza ale nie tobie <username> kurwo jebana!', 'Przyjacielu z kosmosu, przyleciałeś żeby ostrzec nas..']
const radioZachariaszYtPath = 'https://youtu.be/n8X9ONSaNpg'

var servers = {}
const player = createAudioPlayer();

function messageCreateHandler(msg){
    let nickname = msg.member.displayName
    switch(msg.content){
        case prefix + 'siema':
            let index = Math.floor(Math.random() * randomGreetings.length)
            let rndMsg = randomGreetings[index].replace('<username>', nickname)
            msg.reply(rndMsg)
            break
        case prefix + 'help':
            msg.reply('Dostępne komendy:\n.siema\n.startradio\n.stopradio\n.pauseradio\n.leaveradio\n\nKomendy wkrótce:\n.pdf\n.uhhboy')
            break
        case prefix + 'startradio':

            function play(connection, msg){
                var server = servers[msg.guild.id]

                // Abandon downloading from yt
                // let audio = ytdl(server.queue[0], {filter: 'audioonly'})
                // const resource = createAudioResource(audio, {
                //     metadata:{
                //         title: 'RadioZachariasz 12.15fm'
                //     }
                // })

                const resource = createAudioResource('E:/discord/RadioZachariaszBot/resources/radioZachariasz.mp3', {
                    metadata:{
                        title: 'RadioZachariasz 12.15fm'
                    }
                })

                player.play(resource)
                
                player.on('error', () => {
                    console.log('Error on player occured')
                })

                server.dispatcher = connection.subscribe(player)
                msg.reply('RadioZachariasz. Nie zamulamy kochani!')
                resource.playStream.on('end', () => {
                    console.log(`Finished playing song ${resource.metadata.title} on ${msg.guild.id}`)
                    player.stop()
                    server.state = 'stopped'
                    server.queue.shift()
                })
                // resource.playStream.on('error', () => {
                //     console.log(`Some error occured...`)
                // })
            }

            // check if user is in a voice channel
            if(!msg.member.voice.channel){
                msg.reply('You must be in a channel to play radio!')
                return
            }
            
            // initialize queue for server
            if(!servers[msg.guild.id]){
                servers[msg.guild.id] = {
                    queue: [],
                    state: 'idle'
                }
            }

            var server = servers[msg.guild.id]

            if(!msg.guild.voiceConnection){
                const connection = joinVoiceChannel({
                    channelId: msg.member.voice.channel.id,
                    guildId: msg.guild.id,
                    adapterCreator: msg.guild.voiceAdapterCreator
                })

            // start from paused
            if(server.queue.length === 1){
                if(server.dispatcher.player.state.status === 'paused'){
                    server.dispatcher.player.unpause()
                    msg.reply('RadioZachariasz wznowione!')
                    server.state = 'playing'
                    return
                }
                msg.reply('RadioZachariasz aktualnie gra!')
                return
            }

            server.queue.push(radioZachariaszYtPath)
            server.state = 'playing'
            
            play(connection, msg)
            break
            }
        case prefix + 'stopradio':
            var server = servers[msg.guild.id]
            if(!server || server.queue.length === 0){
                msg.reply('RadioZachariasz nie jest włączone!')
                return
            }
            server.state = 'stopped'
            server.dispatcher.player.stop()
            server.queue.shift()
            msg.reply('RadioZachariasz zostało wyłączone!')
            break

        case prefix + 'pauseradio':
            var server = servers[msg.guild.id]
            if(!server || server.queue.length === 0){
                msg.reply('RadioZachariasz nie jest włączone!')
                return
            }
            server.state = 'paused'
            server.dispatcher.player.pause()
            msg.reply('RadioZachariasz zostało zapauzowane')
            break

        case prefix + 'leaveradio':
            var server = servers[msg.guild.id]
            
            if(!server || server.state === 'idle'){
                msg.reply('RadioZachariasz nie jest włączone!')
                return
            }
            
            server.state = 'idle'
            server.dispatcher.player.stop()
            server.dispatcher.connection.destroy()
            server.queue.shift()
            msg.reply('Zamulacie...')
            break
    }
}

module.exports = {
    messageCreateHandler
}
