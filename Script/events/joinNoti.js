const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "joinnoti",
  eventType: ["log:subscribe"],
  version: "1.0.2",
  credits: "SHAHADAT SAHU",
  description: "Welcome message with optional image/video",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.onLoad = function () {
  // Clean up unnecessary directories if you are not using images/gifs.
  // Keeping paths array minimal to avoid errors, although no files will be used.
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  // Keeping directories defined but will not use them in run function
  const paths = [
    join(__dirname, "cache", "joinGif"),
    join(__dirname, "cache", "randomgif")
  ];
  for (const path of paths) {
    if (!existsSync(path)) mkdirSync(path, { recursive: true });
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID } = event;
  
  const botPrefix = global.config.PREFIX || "/";
  const botName = global.config.BOTNAME || "𝗦𝗵𝗮𝗵𝗮𝗱𝗮𝘁 𝗖𝗵𝗮𝘁 𝗕𝗼𝘁";

 
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    // Setting nickname on join
    await api.changeNickname(`[ ${botPrefix} ] • ${botName}`, threadID, api.getCurrentUserID());

    const botJoinMessage = `╭━━━━━━━━━━━━━╮
┃ 🌟 **BOT INTRODUCTION** 🌟
╰━━━━━━━━━━━━━╯
**Thank you so much for adding me to your group!** 🎉
🛡️ **My Primary Feature:**
> **I can re-send messages that are Unsent/Removed by any member.** Nothing is truly deleted when I'm around!`;
      
    // Sending only the text message, no file/attachment handling
    api.sendMessage(botJoinMessage, threadID);

    return;
  }

 
  try {
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const threadData = global.data.threadData.get(parseInt(threadID)) || {};
    let mentions = [], nameArray = [], memLength = [], i = 0;

    for (let id in event.logMessageData.addedParticipants) {
      const userName = event.logMessageData.addedParticipants[id].fullName;
      nameArray.push(userName);
      mentions.push({ tag: userName, id });
      memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    // Minimal welcome message for new members
    let msg = (typeof threadData.customJoin === "undefined") ? 
      `🎉 Welcome to **{threadName}**, {name}! 🎉` : threadData.customJoin;

    msg = msg
      .replace(/\{name}/g, nameArray.join(', '))
      .replace(/\{soThanhVien}/g, memLength.join(', '))
      .replace(/\{threadName}/g, threadName);

    // Sending only the text message, without attachments
    return api.sendMessage({ body: msg, mentions }, threadID);
  } catch (e) {
    console.error(e);
  }
};
