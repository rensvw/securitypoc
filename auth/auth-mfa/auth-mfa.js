module.exports = function auth(options) {

  const moment = require("moment");
  const Promise = require("bluebird");

  var act = Promise.promisify(this.act, {context: this})

  
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


  function checkFlagsSession(msg, respond) {
    //ROEP HIER DE MICROSERVICE AAN DIE NOG OP 0 STAAT BIJ FLAGS. mAAK HIERNA 1 VAN. 
    // RESPOND IS NIET NODIG OMDAT DE LOSSE MCIROSERVICES ALTIJD DEZE FUNCTIE WEER AAN ROEPEN.
    act("entity:user-mfa,get:uuid", {uuid: msg.uuid})
      .then((user) => {
        this.user = user;
        if (user.flags.sms == null || user.flags.sms == 0) {

          act("role:sms,cmd:save,send:true", {email: user.email,phoneNumber: msg.phoneNumber,countryCode: msg.countryCode,uuid: user.uuid})
            .then((response) => {return respond(response);})
            .catch((err) => {return respond(err);})

        } else if (user.flags.mail == null || user.flags.mail == 0) {

          act("role:email,cmd:mfa", {uuid: user.uuid})
            .then((response) => {return respond(response);})
            .catch((err) => {return respond(err);})

        } else if (user.flags.telegram == null || user.flags.telegram == 0) {

          act("role:bot,send:message,with:code", {uuid: user.uuid,email:user.email})
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
