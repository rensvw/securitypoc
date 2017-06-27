module.exports = function auth(options) {

const moment = require("moment");
const Promise = require("bluebird");

var act = Promise.promisify(this.act, {context: this});


 


function verifyEmailCode(msg, respond) {
  let uuid = msg.uuid;
  let code = msg.code;
  let seneca = this;
  act("entity:user-email,get:uuid", {uuid: uuid})
    .then((user) => {
      if (!user) {
        respond(user);
      } else if (user) {
        let newTime = moment(user.session.timeCreated).add(4, "m");
        if (newTime > moment()) {
          if (code == user.session.code) {
            return act("entity:user-mfa,change:flags", {uuid: msg.uuid,mail: 1})
              .then((data) => {
                if (data.succes) {
                  act('role:auth,mfa:check', {uuid: msg.uuid})
                    .then((check) => {return respond(check);})
                    .catch((err) => {return respond(err);});
                } else {
                  return respond({succes: false,message: "Something wen't wrong in the database!"});
                }
              })
              .catch((err) => {
                respond(err);
              })
          } else {
            respond({succes: false,message: "Code is incorrect!"})
          }
        } else {
          respond({succes: false,message: "you are to late!"})
        }
      }
    })
    .catch(function (err) {respond(err);})
}

function signupAndSendMail(msg, respond) {
  let email = msg.email;
  let fullName = msg.fullName;
  let password = msg.password;
  act("role:hash,cmd:newHash", {password: password})
    .then((hash) => {
      return act("entity:user,create:new", {email: email,fullName: fullName,password: hash.password,});
    })
    .then((user) => {
      if (user.succes) {
        return act("entity:user-mfa,crud:user", {email: msg.email,mail: 0,sms: 1,app: 1,normal:1,telegram:1})
          .then((userSession) => {return act("role:email,cmd:mfa", {uuid: userSession.uuid})})
          .then((response) => {return respond(response);})
      } else {
        return respond(user);
      }
    })
    .catch((err) => {respond(err);})

}

function verifyEmailCodeAtSignup(msg, respond) {
  let uuid = msg.uuid;
  let code = msg.code;
  let seneca = this;
  act("entity:user-email,get:uuid", {uuid: uuid
    })
    .then((user) => {
      if (!user) {
        respond(user);
      } else if (user) {
        let newTime = moment(user.session.timeCreated).add(4, "m");
        if (newTime > moment()) {
          if (code == user.session.code) {
            return act("entity:user-mfa,change:flags", {uuid: uuid,mail: 1})
              .then((data) => {
                if (data.succes) {
                 return act("entity:user,update:flags", {email: data.email,mail: 1})
                    .then((response) => {return respond({succes: true,returnToken: true,user: {email: response.email,},message: "All codes are correct, welcome!"});})
                    .catch((err) => {return respond(err);})
                } else {
                  return respond({succes: false,message: "Something went wrong in the database!"});
                }
              })
              .catch((err) => {respond(err);})
          } else {
            respond({succes: false,message: "Code is incorrect!"})
          }
        } else {
          respond({succes: false,message: "you are to late!"})
        }
      }
    })
    .catch(function (err) {return respond(err);})
}


  this.add({role:"auth",signup:"email"}, signupAndSendMail);     
  this.add({role:"auth",email:"verify"}, verifyEmailCode);
  this.add({role:"auth",signup:"verify-email"}, verifyEmailCodeAtSignup);
  


}