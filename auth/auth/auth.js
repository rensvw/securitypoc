module.exports = function auth(options) {

  let moment = require("moment");
  const Promise = require("bluebird");
  const randomID = require("random-id");

  var act = Promise.promisify(this.act, {context: this});

  function changePassword(msg,respond){
    let oldPassword = msg.oldPassword
    if(msg.newPassword1 != msg.newPassword2){
      return respond({succes: "false", message: "The new passwords don't match"})
    }
    if(oldPassword == msg.newPassword1){
      return respond({succes: "false", message: "The new password can not be the same as the old one!"})      
    }
    act("entity:user,get:email", {email: msg.email})
      .then((user) => {
        if (!user.succes) {
          return respond({succes: false,message: "User could not been found!"});
        } 
        act("role:hash,cmd:comparePasswords", {password: oldPassword ,hash: user.password})
          .then((result)=>{
            if (result.succes) {
              return act("role:hash,cmd:newHash",{password: msg.newPassword1})
                .then((hash)=>{
                  return act("entity:user,change:password",{password: hash.password, email: msg.email})
                    .then((data)=>{
                      if(data.succes){
                        return respond({succes:true,message: "Succefully changed the password!"})
                      }
                      return respond({succes:false,message: "Something wen't wrong saving the password in the database!"})
                    })
                    .catch((err)=>respond(err,null))
                 })
                 .catch((err)=>respond(err,null))
            }
            return respond({succes: false,message: "Old password is incorrect!"});
          })
          .catch((err)=>respond(err,null))
      })
      .catch((err)=>respond(err,null))
}

function authenticateAndSetFlags(msg, respond) {
    act("entity:user,get:email", {email: msg.email})
      .then((user) => {
        this.user = user;
        if (user.succes) {
          return act("role:auth,check:verified", {user: user,app: msg.app,sms: msg.sms,mail: msg.mail})
            .then((message) => {
              if (message.succes) {
                return act("role:hash,cmd:comparePasswords", {password: msg.password,hash: this.user.password})
                  .then((authenticated) => {
                    if (authenticated.succes) {
                      return act("entity:user-mfa,crud:user", {email: msg.email,mail: msg.mail,sms: msg.sms,app: msg.app,normal:msg.normal,mfa:msg.mfa,telegram: msg.telegram})
                        .then((userMFASession) => {
                          console.log(userMFASession);
                          return act("role:auth,mfa:check", {email: msg.email,uuid: userMFASession.uuid})
                                .then((data) => {return respond(null, data);})
                        })
                        .catch((err) => {
                          return respond(err, null);
                        });
                    } else {
                      return respond(null, authenticated);
                    }
                  })
                  .catch((err) => {return respond(err);});
              } else {
                return respond({succes: false,message: "Username or password is incorrect!"});
              }
            })
            .catch((err) => {return respond(err);})
        } else {
          return respond({succes: false,message: "Username or password is incorrect!"});
        }
      })
      .catch((err) => {return respond(err);
      });
  }

  function authenticate(msg, respond) {
    let email = msg.email;
    let password = msg.password;
    let seneca = this;
    act("entity:user,get:email", {
        email: email
      })
      .then((user) => {
        if (!user.succes) {
          return respond({
            succes: false,
            message: "User could not been found!"
          });
        } else {
          act("role:hash,cmd:comparePasswords", {
              password: password,
              hash: user.password
            })
            .then((result) => {
              if (result.succes) {
                return respond({
                  succes: result.succes,
                  message: result.message,
                  user: {
                    fullname: user.fullName,
                    email: user.email
                  }
                });
              } else {
                return respond({
                  succes: false,
                  message: "Username or password is incorrect!"
                });
              }
            })
            .catch((err) => {
        return respond(err);
      });
        }
      })

      .catch((err) => {
        return respond(err);
      });
  }

function verifyNormalLogin(msg, respond) {
    act("entity:user,get:email", {email: msg.email})
      .then((user) => {
        
        this.user = user;
        if (user.succes) {
                return act("role:hash,cmd:comparePasswords", {password: msg.password,hash: this.user.password})
                  .then((authenticated) => {
                    if (authenticated.succes) {
                      return act("entity:user-mfa,change:flags", {normal: 1,uuid: msg.uuid})
                        .then((userMFASession) => {
                          console.log(userMFASession);
                          return act("role:auth,mfa:check", {email: msg.email,uuid: userMFASession.uuid})
                                .then((data) => {return respond(null, data);})
                        })
                        .catch((err) => {
                          return respond(err, null);
                        });
                    } else {
                      return respond(null, authenticated);
                    }
                  })
                  .catch((err) => {return respond(err);});
              } else {
                return respond({succes: false,message: "Username or password is incorrect!"});
              }
            })
            .catch((err) => {return respond(err);})
  }
 
  this.add({role:"auth",cmd:"authenticate",mfa:"none"}, authenticate);
  this.add({role:"auth",change:"password"}, changePassword);
  this.add({role:"auth",mfa:"auth"}, authenticateAndSetFlags);
  this.add({role:"auth",verify:"normal"}, verifyNormalLogin);  


  };