import {ApplicationCommand} from 'discord.js';
import commands from './cmds.mjs';

export default async function(client) {
    client.application.commands.fetch().then(async currentCommands => {
        let newCommands = commands.filter((command) => !currentCommands.some((c) => c.name === command.name));
        for (let newCommand of newCommands) {
            await client.application.commands.create(newCommand);
        }
        let updatedCommands = commands.filter((command) => currentCommands.some((c) => c.name === command.name));
        let updatedCommandCount = 0;
        for (let updatedCommand of updatedCommands) {
            const previousCommand = currentCommands.find((c) => c.name === updatedCommand.name);
            const newCommand = updatedCommand;
            let modified = false;
            if (previousCommand.description !== newCommand.description) modified = true;
            if (!ApplicationCommand.optionsEqual(previousCommand.options ?? [], newCommand.options ?? [])) modified = true;
            if (modified) {
                await previousCommand.edit(newCommand);
                updatedCommandCount++;
            }
        }
        let deletedCommands = currentCommands.filter((command) => !commands.some((c) => c.name === command.name)).toJSON();
        for (let deletedCommand of deletedCommands) {
            await deletedCommand.delete();
        }
        console.log("\u001b[32m▣ \u001b[0m\u001b[0m\u001b[40;1m\u001b[34;1mhttps://"+process.env.REPL_ID+".id.repl.co/invite\u001b[0m")
    })
};