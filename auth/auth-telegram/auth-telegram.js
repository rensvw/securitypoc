module.exports = function auth(options) {

const moment = require("moment");
const Promise = require("bluebird");
const TelegramBot = require('node-telegram-bot-api');
var act = Promise.promisify(this.act, {context: this})


this.add({role:"bot",save:"token"}, saveToken);
this.add({role:"bot",send:"message"}, sendMessageToBot);
this.add({role:"bot",send:"message",with:"code"}, sendMessageToBotWithCodeAndSave)
this.add({role:"auth",login:"telegram",}, authenticateTelegramAndSetFlags)
this.add({role:"auth",verify:"telegram",}, verifyTelegramCodeMFA)

function signupTelegram(msg, respond) {
  let email = msg.email;
  let token = msg.token;
  let password = msg.password;
    act("entity:user,get:email", {
      email: email
    })
    .then((user) => {
      if (user.succes) {
        return act("role:hash,cmd:comparePasswords", {password: password,hash: user.password})
          .then((authenticated) => {
            if (authenticated.succes) {

                return act("entity:user-mfa,crud:user", {email: email,mail: 1,sms: 1,app: 1,normal:1,telegram:0})
                .then((userMFASession) => {
                    this.user = user;
                  if (user.succes) {
                  act("entity:user-telegram,crud:user", {email: email,token:token})
                  .then((user)=>{
                     return act("role:bot,send:message,with:code",{ email:this.user.email, uuid: this.userMFASession.uuid })         
                    .then((response) => {return respond(response);})
                    .catch((err) => {return respond(err);})   
                  })
                     
                    
                  } else {
                    return respond(null,user);
                  }
                })
                .catch((err) => {return respond(err,null);})
             
            } else {
              return respond({succes:false,message: "Password is not correct!"})
            }
          })
          .catch((err) => {
            return respond(err,null);
          })
      }
    }).catch((err) => {
      return respond(err,null);
    })
}

function verifySMSCodeBySignUp(msg, respond) {
  let uuid = msg.uuid;
  let code = msg.code;
  let seneca = this;
  act("entity:user-sms,get:uuid", {uuid: uuid})
    .then((user) => {
      if (!user) {
        respond(user);
      } else if (user) {
        let newTime = moment(user.session.timeCreated).add(4, "m");
        if (newTime > moment()) {
          if (code == user.session.code) {
            return act("entity:user-mfa,change:flags", {uuid: msg.uuid,sms: 1})
              .then((data) => {
                if (data.succes) {
                  return act("entity:user,update:flags", {email: data.email,sms: 1})
                    .then((response) => {
                      return respond({succes: true,returnToken: true,user: {email: response.email,},message: "All codes are correct, welcome!"});})
                    .catch((err) => {return respond(err);})
                } else {
                  return respond({succes: false,message: "Something wen't wrong in the database!"});
                }
              })
              .catch((err) => {return respond(err);})
          } else {
            return respond({succes: false,message: "Code is incorrect!"})
          }
        } else {
          return respond({succes: false,message: "you are to late!"})
        }
      }
    })
    .catch(function (err) {return respond(err);})
}


function authenticateTelegramAndSetFlags(msg, respond) {
    let seneca = this;
    act("entity:user,get:email", {
        email: msg.email
      })
      .then((user) => {
        this.user = user;
        if (!user.succes) {
          return respond({
            succes: false,
            message: "User could not been found!"
          });
        } else {
          return act("entity:user-mfa,crud:user", {email: this.user.email,mail: msg.mail,sms: msg.sms,app: msg.app,normal: msg.normal,telegram:msg.telegram})
              .then((userMFASession) => {
                this.userMFASession = userMFASession;
                return act("entity:user-telegram,get:email",{email:this.user.email})
                .then((user)=>{
                    return act("role:bot,send:message,with:code",{ email:this.user.email, uuid: this.userMFASession.uuid })         
                    .then((response) => {return respond(response);})
                    .catch((err) => {return respond(err);})          
                })
                .catch((err) => {return respond(err);})
              })
            .catch((err) => {
              return respond(err);
            })
        }})
        .catch((err) => {
        return respond(err);
      });   
  }

function verifyTelegramCodeMFA(msg, respond) {
  let uuid = msg.uuid;
  let code = msg.code;
  let seneca = this;
  act("entity:user-telegram,get:uuid", {uuid: uuid})
    .then((user) => {
      if (!user) {
        return respond(user);
      } else if (user) {
        let newTime = moment(user.session.timeCreated).add(4, "m");
        if (newTime > moment()) {
          if (code == user.session.code) {
            return act("entity:user-mfa,change:flags", {uuid: msg.uuid,telegram: 1})
              .then((data) => {
                if (data.succes) {
                  act('role:auth,mfa:check', {uuid: msg.uuid})
                    .then((check) => {return respond(check);})
                    .catch((err) => {return respond(err);});
                } else {
                  return respond({succes: false,message: "Something wen't wrong in the database!"});
                }
              })
              .catch((err) => {return respond(err);})
          } else {
            respond({succes: false,message: "Code is incorrect!"})
          }
        } else {
          respond({succes: false,message: "you are to late!"})
        }
      }
    })
    .catch(function (err) {return respond(err);
    })
}

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