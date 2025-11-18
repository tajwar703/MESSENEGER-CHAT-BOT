const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "leave",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "Shahadat Sahu (Modified by Gemini)",
  description: "Thông báo bot hoặc người rời khỏi nhóm",
  dependencies: {
    "fs-extra": "",
    "path": ""
  }
};

module.exports.run = async function({ api, event, Users, Threads }) {
  // যদি বট নিজেই লিভ নেয়, তবে কোনো নোটিফিকেশন দেবে না।
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { threadID } = event;

  const data = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data;
  const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);

  const type = (event.author == event.logMessageData.leftParticipantFbId)
    // স্বেচ্ছায় লিভ নিলে
    ? `😭 **Goodbye!** We hope to see you again soon. 👋`
    // অ্যাডমিন বের করে দিলে
    : `👋 **Removed.** We wish you the best.`;

  // কাস্টম বা ডিফল্ট মেসেজ
  let msg = (typeof data.customLeave == "undefined")
    ? `💔 **Group Departure Notification** 💔\n\n**${name}** has left the group.\n\n${type}`
    : data.customLeave;

  msg = msg.replace(/\{name}/g, name).replace(/\{type}/g, type);

  // শুধুমাত্র টেক্সট মেসেজ পাঠানো হচ্ছে
  const formPush = { body: msg };

  return api.sendMessage(formPush, threadID);
};
