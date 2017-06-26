module.exports = function auth(options) {

  const moment = require("moment");
  const Promise = require("bluebird");

  var act = Promise.promisify(this.act, {context: this})

  this.add({role:"auth",mfa:"auth"}, authenticateAndSetFlags);
  this.add({role:"auth",verify:"normal"}, verifyNormalLogin);  
  this.add({role:"auth",login:"email"}, authenticateEmailAndSetFlags);
  this.add({role:"auth",login:"sms"}, authenticateSMSAndSetFlags);
  
  this.add({role:"auth",mfa:"check"}, checkFlagsSession);
  this.add({role:"auth",check:"verified"}, checkIfUserVerifiedAuthenticationType);
  
  function checkIfUserVerifiedAuthenticationType(msg, respond) {
    console.log(msg.user);
    if (msg.sms == 0 && msg.user.verified.sms == null) {

      return respond({succes: false,message: "This verification type has not been added to your account!"})

    } else if (msg.mail == 0 && msg.user.verified.mail == null) {

      return respond({succes: false,message: "This verification type has not been added to your account!"})

    } else if (msg.app == 0 && msg.user.verified.app == null) {

      return respond({succes: false,message: "This verification type has not been added to your account!"})

    } else {
      return respond({succes: true,message: "Alle types are verified!"})
    }
  }


function authenticateEmailAndSetFlags(msg, respond) {
    let email = msg.email;
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

          return act("entity:user-mfa,crud:user", {email: msg.email,mail: msg.mail,sms: msg.sms,app: msg.app,normal: msg.normal})
              .then((userMFASession) => {
                return act("role:email,cmd:mfa", {uuid: userMFASession.uuid})
                  .then((response) => {return respond(response);})
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
          return act("entity:user-mfa,crud:user", {email: this.user.email,mail: msg.mail,sms: msg.sms,app: msg.app,normal: msg.normal})
              .then((userMFASession) => {
                this.userMFASession = userMFASession;
                return act("entity:user-sms,get:user",{email:this.user.email})
                .then((user)=>{
                    return act("role:sms,cmd:save,send:false", {email: this.user.email,phoneNumber: msg.phoneNumber,countryCode: user.countryCode,uuid: this.userMFASession.uuid})
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
                      return act("entity:user-mfa,crud:user", {email: msg.email,mail: msg.mail,sms: msg.sms,app: msg.app,normal:msg.normal,mfa:msg.mfa})
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
  

  function checkFlagsSession(msg, respond) {
    //ROEP HIER DE MICROSERVICE AAN DIE NOG OP 0 STAAT BIJ FLAGS. mAAK HIERNA 1 VAN. 
    // RESPOND IS NIET NODIG OMDAT DE LOSSE MCIROSERVICES ALTIJD DEZE FUNCTIE WEER AAN ROEPEN.
    act("entity:user-mfa,get:uuid", {uuid: msg.uuid})
      .then((user) => {
        this.user = user;
        if (user.flags.sms == null || user.flags.sms == 0) {

          act("role:sms,cmd:save,send:false", {email: user.email,phoneNumber: msg.phoneNumber,countryCode: msg.countryCode,uuid: user.uuid})
            .then((response) => {return respond(response);})
            .catch((err) => {return respond(err);})

        } else if (user.flags.mail == null || user.flags.mail == 0) {

          act("role:email,cmd:mfa", {uuid: user.uuid})
            .then((response) => {return respond(response);})
            .catch((err) => {return respond(err);})

        } else if (user.flags.normal == null || user.flags.normal == 0) {

          return respond({succes: true,message: "Standard user + pass session started!",uuid: user.uuid,redirectTo: "verifyNormalPage"})

        } else if (user.flags.app == null || user.flags.app == 0) {

          return respond({succes: true,message: "Authenticator app session started!",uuid: user.uuid,redirectTo: "verifyAppPage"});

        } else {
           return act("entity:user,get:email", {email: this.user.email})
                .then((userdata) => {
                  return respond({succes: true,returnToken: true,user: {email: this.user.email, fullName: userdata.fullName},message: "All codes are correct, welcome!"})})
                .catch((err) => {return respond(err, null);})
        }
      })
      .catch((err) => {return respond(err, null);})
  }
  }
