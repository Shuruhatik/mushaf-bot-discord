import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import {Client,MessageEmbed} from 'discord.js';
import { createSpinner } from "nanospinner";
import Database from "st.db";
import ms from 'ms';
import express from 'express';
import 'console.image'
import synchronizeSlashCommands from './util/SyncCommands.mjs'
import commandResponse from './util/commandResponse.mjs'
const app = express()
import replit from "quick.replit"
const config_db = new replit.Database(process.env["REPLIT_DB_URL"])
const config_delete_db = new Database({path:"./datas/config.yml"})
await getStarted()
async function getStarted(){
  if(await config_delete_db.has("delete_this_value_if_you_want_delete_config") != true || await config_delete_db.get("delete_this_value_if_you_want_delete_config") == true){
    await config_db.delete(`bot_config`)
  }
  if(await config_db.get(`bot_config`)) return await startBot()
  const rainbow = chalkAnimation.karaoke('ًﺍﺮﻴﺜﻛ ﺭﺎﻔﻐﺘﺳﻻﺍﻭ ﻪﻠﻟﺍ ﺮﻛﺫ ﻰﺴﻨﺗ ﻻ ﺀﻲﺷ ﻞﻛ ﻞﺒﻗ');

  setTimeout(async()=> {
     rainbow.stop()
     console.log(`\u001b[42;1mMuslim Bot\u001b[0m first version\nBy \u001b[47;1m\u001b[30;1mShuruhatik#2443\u001b[0m `)
     const ask1 = await inquirer.prompt({
       name:"token_bot",
       type:'password',
       message:`Put your Bot token :`,
       mask:"*"
     })
     const ask2 = await inquirer.prompt({
       name:"status_bot",
       type:'input',
       message:`Type in the status of the bot you want`,
     })
     const ask3 = await inquirer.prompt({
       name:"status_type",
       type:'list',
       message:`Choose the type of bot status`,
       choices:[
         "PLAYING","LISTENING","WATCHING","COMPETING"
       ]
     })
     await config_db.set(`bot_config`,{
         token_bot:ask1.token_bot.replaceAll("\\","").replaceAll("~",""),
         status_bot:ask2.status_bot.replaceAll("\\","").replaceAll("~",""),
         status_type:ask3.status_type.replaceAll("\\","").replaceAll("~","")
     })
     return await startBot()
  },3500)
} 


async function startBot(){
  console.clear()
  const spinner = createSpinner(`Processing..`).start()
  const client = new Client({intents: ['GUILDS', 'GUILD_MESSAGES']})
  const config = await config_db.get(`bot_config`)
  client.login(config.token_bot).then(()=>{
    spinner.update({ text: 'Running the bot...' })
  }).catch(()=>{
    spinner.error({ text: 'Invalid Bot Token' })
  })

  // Event Ready
  client.on("ready",async()=>{
    await synchronizeSlashCommands(client)
    client.user.setActivity(config.status_bot, { type:config.status_type });
    let bot_invite_link = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
    spinner.success({ text: `Logged in as ${client.user.tag} (${client.user.id})`})
     app.get('/',(r, s) => {
       s.send({message:"Bot by Shuruhatik#2443",youtube_channel:"https://www.youtube.com/ShuruhatikYT"})
      }).post('/',async(r, s) => {
       
        s.send({
          message:"Bot by Shuruhatik#2443",  youtube_channel:"https://www.youtube.com/ShuruhatikYT"
        })
        if(await config_db.has(`uptime`) != true){
          console.log("\u001b[32m✔ \u001b[0mUptime has been done successfully")
          await config_db.set(`uptime`,true)
        }
      })
     .get("/invite", (req, res) => res.status(301).redirect(bot_invite_link))
     .listen(3000)
     console.log("\u001b[32m▣\u001b[0m \u001b[0mBot Run By \u001b[34;1mShuruhatik#2443\u001b[0m")
  })

  // Event Interaction Create
  client.on(`interactionCreate`, async(interaction) => await commandResponse(client,interaction,config))
}