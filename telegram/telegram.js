module.exports = function telegram(options) {

const moment = require("moment");
const Promise = require("bluebird");
const TelegramBot = require('node-telegram-bot-api');
var act = Promise.promisify(this.act, {context: this})


this.add({role:"bot",save:"token"}, saveToken);
this.add({role:"bot",send:"message"}, sendMessageToBot);
this.add({role:"bot",send:"message",with:"code"}, sendMessageToBotWithCodeAndSave)

function subscribeChatID(token,email,respond){
    const bot = new TelegramBot(token,{polling: true});
    bot.onText(/\/subscribe/, (msg, match) => {
        const chatId = msg.chat.id;

        act("entity:user-telegram,crud:user",{chatId: msg.chat.id, email: email})
        .then((data)=>{ return respond ({ succes:true, user: data }) })
        .catch((err)=>{ return respond (err,null) })

        bot.sendMessage(chatId, 'Your chat ID has been saved!');
    });

}

function sendMessageToBotWithCodeAndSave(msg,respond){
    act("role:generate,cmd:code")
        .then((generatedCode) => {
            this.generatedCode = generatedCode
            return act("entity:user-telegram,crud:user", {
                email: msg.email,
                code: generatedCode.code,
                uuid: msg.uuid,
            })
        .then((userTelegramSession) => {
            this.userTelegramSession = userTelegramSession;
            if (userTelegramSession.succes) {
                return act("role:bot,send:message",{ 
                    email: msg.email, 
                    message: "Hello, your verification code is: " + this.generatedCode.code })
            .then((messageSent) => {
                return respond({
                    uuid: this.userTelegramSession.uuid,
                    message: messageSent.message,
                    redirectTo: "verifyTelegramPage",
                    succes: true
                });
            })
            .catch((err) => { return respond(err) })
        } else {
            return respond({ succes: false, message: "User could not be found!"})
            }
        })
        .catch((err) => { respond(err) })
    })
    .catch((err) => {respond(err) })
}


function sendMessageToBot(msg,respond){
    act("entity:user-telegram,get:email", { email: msg.email })
    .then((user) => { 
        const bot = new TelegramBot(user.token);
        bot.sendMessage(user.chatId, msg.message);
        return respond({ succes: true, message: "Message has been sent!"})
     })
    .catch((err) => { return respond(err,null) })
}

function saveToken(msg,respond){
    const token = msg.token;
    act("entity:user-telegram,crud:user",{token: msg.token,email: msg.email})
    .then((data)=>{ 
        subscribeChatID(data.token,msg.email,respond);        
        return respond ({ succes:true, user: data }) })
    .catch((err)=>{ return respond (err,null) })
}

}