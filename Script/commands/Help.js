const fs = require("fs-extra");
const request = require("request"); // এটি আর প্রয়োজন নাও হতে পারে, কিন্তু রেখে দেওয়া হলো যদি অন্য কোথাও ব্যবহৃত হয়।
const path = require("path"); // এটি আর প্রয়োজন নাও হতে পারে, কিন্তু রেখে দেওয়া হলো যদি অন্য কোথাও ব্যবহৃত হয়।

module.exports.config = {
    name: "help",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Shows all commands with details",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": `╭━━━━━━━━━━━━━━━━━╮
┃ 🌟 **COMMAND INFORMATION** 🌟
┣━━━━━━━━━━━━━━━━━┫
┃ 🔖 **Name:** %1
┃ 📄 **Usage:** %2
┃ 📜 **Description:** %3
┃ 🔑 **Permission:** %4
┃ 👨‍💻 **Credit:** %5
┃ 📂 **Category:** %6
┃ ⏳ **Cooldown:** %7s
┣━━━━━━━━━━━━━━━━━┫
┃ ⚙ **Prefix:** %8
┃ 🤖 **Bot Name:** %9
╰━━━━━━━━━━━━━━━━━╯`,
        "helpList": "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
        "user": "User",
        "adminGroup": "Group Admin",
        "adminBot": "Bot Admin"
    }
};

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body === "undefined" || body.indexOf("help") != 0) return;  
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);  
    if (splitBody.length < 2 || !commands.has(splitBody[1].toLowerCase())) return;  

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const command = commands.get(splitBody[1].toLowerCase());  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  

    const botName = global.config.BOTNAME || "Default Chat Bot"; // Bot Name এখান থেকে নেওয়া হবে

    const detail = getText("moduleInfo",  
        command.config.name,  
        command.config.usages || "Not Provided",  
        command.config.description || "Not Provided",  
        command.config.hasPermssion,  
        command.config.credits || "Unknown",  
        command.config.commandCategory || "Unknown",  
        command.config.cooldowns || 0,  
        prefix,  
        botName  
    );  

    api.sendMessage({ body: detail }, threadID, messageID);
};

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  
    const botName = global.config.BOTNAME || "Default Chat Bot"; // Bot Name এখান থেকে নেওয়া হবে

    if (args[0] && commands.has(args[0].toLowerCase())) {  
        const command = commands.get(args[0].toLowerCase());  

        const detailText = getText("moduleInfo",  
            command.config.name,  
            command.config.usages || "Not Provided",  
            command.config.description || "Not Provided",  
            command.config.hasPermssion,  
            command.config.credits || "Unknown",  
            command.config.commandCategory || "Unknown",  
            command.config.cooldowns || 0,  
            prefix,  
            botName  
        );  

        api.sendMessage({ body: detailText }, threadID, messageID);  
        return;  
    }  

    const arrayInfo = Array.from(commands.keys())
        .filter(cmdName => cmdName && cmdName.trim() !== "")
        .sort();  

    const page = Math.max(parseInt(args[0]) || 1, 1);  
    const numberOfOnePage = 20;  
    const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);  
    const start = numberOfOnePage * (page - 1);  
    const helpView = arrayInfo.slice(start, start + numberOfOnePage);  

    let msg = helpView.map(cmdName => `┃ 💠 ${cmdName}`).join("\n");

    const text = `╭━━━━━━━━━━━━━━━━━╮
┃ 📜 **COMMAND LIST** 📜
┣━━━━━━━━━━━━━━━━━┫
┃ 📄 **Page:** ${page}/${totalPages}
┃ 🧮 **Total Commands:** ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━━┫
${msg}
┣━━━━━━━━━━━━━━━━━┫
┃ ⚙ **Prefix:** ${prefix}
┃ 🤖 **Bot Name:** ${botName}
╰━━━━━━━━━━━━━━━━━╯`;

    api.sendMessage({ body: text }, threadID, messageID);
};
```http://googleusercontent.com/image_generation_content/0
