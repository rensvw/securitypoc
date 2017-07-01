module.exports = function auth(options) {

  const moment = require("moment");
  const Promise = require("bluebird");

  var act = Promise.promisify(this.act, {context: this})

  
function authenticateAndSendSMSCode(msg, respond) {
  let email = msg.email;
  let password = msg.password;
  act("role:user,cmd:get", {email: email})
    .then((user) => {
      if (user.succes) {
        return act("role:hash,cmd:comparePasswords", {password: password,hash: user.password})
          .then((authenticated) => {
            if (authenticated.succes) {
              return act("role:sms,cmd:save,send:true", {email: email})
                .then((result) => {
                  return respond({succes: true,uuid: result.uuid,message: "Username and password are correct, we've send you a code in a text message!"});})
                .catch((err) => {return respond(err);});
            } else {
              return respond({succes: false,message: "Username or password is incorrect!"});
            }
          })
          .catch((err) => {
            return respond(err);
          });
      } else {
        return respond({succes: false,message: "Username or password is incorrect!"});
      }
    })
    .catch((err) => {
      return respond(err);
    });
}

function signupAndSendSMS(msg, respond) {
  let phoneNumber = msg.phoneNumber;
  let countryCode = msg.countryCode;
  let email = msg.email;
  let password = msg.password;
  act("entity:user-sms,get:phoneNumber",{phoneNumber: phoneNumber})
  .then((user)=>{
    if(user.succes){
      return respond({ succes: false, message:"An user with this phonenumber already exists!"})
    }
    return act("entity:user,get:email", {
      email: email
    })
    .then((user) => {
      if (user.succes) {
        return act("role:hash,cmd:comparePasswords", {password: password,hash: user.password})
          .then((authenticated) => {
            if (authenticated.succes) {

                return act("entity:user-mfa,crud:user", {email: msg.email,mail: 1,sms: 0,app: 1,normal:1,telegram:1})
                .then((user) => {
                  if (user.succes) {
                  act("entity:user,crud:phone", {email: msg.email,phoneNumber:phoneNumber})
             
            
                    return act("role:sms,cmd:save,send:true", {email: email,uuid: user.uuid,phoneNumber: phoneNumber,countryCode: countryCode})
                      .then((result) => {return respond(null,result);})
                      .catch((err) => {return respond(err,null);})
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
  })
  .catch((err)=>{
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

 function authenticateSMSAndSetFlags(msg, respond) {
    let seneca = this;
    act("entity:user,get:phoneNumber", {
        phoneNumber: msg.phoneNumber
      })
      .then((user) => {
        this.user = user;
        if (!user.succes) {
          return respond({
            succes: false,
            message: "User could not been found!"
          });
        } else {
          return act("entity:user-mfa,crud:user", {email: this.user.email,mail: msg.mail,sms: msg.sms,app: msg.app,normal: msg.normal,telegram: msg.telegram})
              .then((userMFASession) => {
                this.userMFASession = userMFASession;
                return act("entity:user-sms,get:user",{email:this.user.email})
                .then((user)=>{
                    return act("role:sms,cmd:save,send:true", {email: this.user.email,phoneNumber: msg.phoneNumber,countryCode: user.countryCode,uuid: this.userMFASession.uuid})
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


function verifySMSCodeMFA(msg, respond) {
  let uuid = msg.uuid;
  let code = msg.code;
  let seneca = this;
  act("entity:user-sms,get:uuid", {uuid: uuid
    })
    .then((user) => {
      if (!user) {
        return respond(user);
      } else if (user) {
        let newTime = moment(user.session.timeCreated).add(4, "m");
        if (newTime > moment()) {
          if (code == user.session.code) {
            return act("entity:user-mfa,change:flags", {uuid: msg.uuid,sms: 1})
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

  this.add({role:"auth",cmd:"authenticate",mfa:"sms"}, authenticateAndSendSMSCode);
  this.add({role:"auth",signup:"sms"}, signupAndSendSMS);
  this.add({role:"auth",sms:"verify-signup"}, verifySMSCodeBySignUp);  
  this.add({role:"auth",sms:"verify"}, verifySMSCodeMFA);
  this.add({role:"auth",login:"sms"}, authenticateSMSAndSetFlags);

}