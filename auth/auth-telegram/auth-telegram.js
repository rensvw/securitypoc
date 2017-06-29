module.exports = function auth(options) {

const moment = require("moment");
const Promise = require("bluebird");
const TelegramBot = require('node-telegram-bot-api');

var act = Promise.promisify(this.act, {context: this})

this.add({role:"auth",login:"telegram",}, authenticateTelegramAndSetFlags)
this.add({role:"telegram",send:"message",}, sendVerifyMessage)
this.add({role:"auth",verify:"telegram",}, verifyTelegramCodeMFA)
this.add({role:"auth",signup:"telegram",}, signupTelegram)
this.add({role:"auth",signup:"verify-telegram",}, verifyTelegramCodeBySignUp)

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
                  act("role:bot,save:token", {email: email,token:token})
                    .then((response) => {return respond({
                      succes: true,
                      redirectTo: "subscribeTelegramChat"
                    });
                  })
                    .catch((err) => {return respond(err);})               
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


function verifyTelegramCodeBySignUp(msg, respond) {
  let uuid = msg.uuid;
  let code = msg.code;
  let seneca = this;
  act("entity:user-telegram,get:uuid", {uuid: uuid})
    .then((user) => {
      if (!user) {
        respond(user);
      } else if (user) {
        let newTime = moment(user.session.timeCreated).add(4, "m");
        if (newTime > moment()) {
          if (code == user.session.code) {
            return act("entity:user-mfa,change:flags", {uuid: msg.uuid,telegram: 1})
              .then((data) => {
                if (data.succes) {
                  return act("entity:user,update:flags", {email: data.email,telegram: 1})
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

function sendVerifyMessage(msg, respond) {
    let seneca = this;
          act("entity:user-mfa,crud:user", {email: msg.email,mail: 1,sms: 1,app: 1,normal: 1,telegram:1})
              .then((userMFASession) => {
                
                this.userMFASession = userMFASession;
                return act("entity:user-telegram,get:email",{email:this.userMFASession.email})
                .then((user)=>{
                    return act("role:bot,send:message,with:code",{ email:msg.email, uuid: this.userMFASession.uuid, token: this.userMFASession.token })         
                    .then((response) => {return respond(response);})
                    .catch((err) => {return respond(err);})          
                })
                .catch((err) => {return respond(err);})
              })
            .catch((err) => {
              return respond(err);
            })
        
    
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

}

