module.exports = function flag( options ) {

  const moment = require("moment");
  const Promise = require("bluebird");
  var act = Promise.promisify(this.act, {context: this});

  this.add({entity:"user-mfa",create:"new"}, createNewMfaSession);
  this.add({entity:"user-mfa",update:"new"}, updateNewMfaSession);
  this.add({entity:"user-mfa",get:"user"}, getMFAUserSession);
  this.add({entity:"user-mfa",get:"uuid"}, getMFAUserSessionWithID);
  this.add({entity:"user-mfa",crud:"user"}, updateOrCreateNewSession);
  this.add({entity:"user-mfa",change:"flags"}, updateFlagsMfaSession);
  

  function getMFAUserSessionWithID(msg, respond) {
    var userMfa = this.make$("userMFASession");
    var uuid = msg.uuid;
    userMfa.load$({uuid:uuid}, function (err, userMfa) {
      if (err) {
        respond(err, null);
      }
      if (!userMfa) {
        respond(null, {
          succes: false,
          message: "User could not be found!"
        });
      }
      if (userMfa) {
        respond(err, {
          succes: true,
          email: userMfa.email,
          uuid: userMfa.uuid,
          flags: userMfa.flags,
          sessionStarted: userMfa.sessionStarted
        });
      }
    });
  }

  function getMFAUserSession(msg, respond) {
    var userMfa = this.make$("userMFASession");
    var email = msg.email;
    userMfa.load$({
      email: email
    }, function (err, userMfa) {
      if (err) {
        respond(err, null);
      }
      if (!userMfa) {
        respond(null, {
          succes: false,
          message: "User could not be found!"
        });
      }
      if (userMfa) {
        respond(err, {
          succes: true,
          email: userMfa.email,
          uuid: userMfa.uuid,
          flags: userMfa.flags,
          sessionStarted: userMfa.sessionStarted
        });
      }
    });
  }

  function createNewMfaSession(msg, respond) {
    var userMfa = this.make('userMFASession');
    act("role:generate,cmd:uuid")
      .then((data) => {
        userMfa.uuid = data.uuid;
        userMfa.email = msg.email;
        userMfa.sessionStarted = moment().format("LLL");
        userMfa.flags = {
          sms: msg.sms,
          mail: msg.mail,
          telegram: msg.telegram,
          app: msg.app,
          normal: msg.normal
          
        };
        userMfa.save$(function (err, userMfa) {
          if (err) {
            respond(err, null);
          } else {
            respond(null, this.util.clean(userMfa), userMfa);
          }
        });
      })
      .catch((err) => {
        respond(err, null);
      });
  }

  function updateNewMfaSession(msg, respond) {
    var userMfa = this.make('userMFASession');
    act("role:generate,cmd:uuid")
      .then((data) => {
        userMfa.load$({
          email: msg.email
        }, function (err, result) {
          if (!result) {
            respond({
              succes: false,
              message: "User could not be found!"
            });
          }
          result.data$({
            uuid: data.uuid,
            flags: {
              sms: msg.sms,
              mail: msg.mail,
              app: msg.app,
              normal: msg.normal,
              telegram: msg.telegram
            },
            mfa: msg.mfa,
            sessionStarted: moment().format("LLL")
          });
          result.save$(function (err, user) {
            respond(err, {
              succes: true,
              message: "Succesfully started a new session!",
              uuid: user.uuid,
            })
          });

        })
      })
      .catch((err) => {
        respond(err, null);
      });


  }

   function updateFlagsMfaSession(msg, respond) {
    var userMfa = this.make('userMFASession');
        userMfa.load$({
          uuid: msg.uuid
        }, function (err, result) {
          if (!result) {
            respond({
              succes: false,
              message: "User could not be found!"
            });
          }
          console.log(result.flags)
          if (msg.sms == undefined){
            var sms = result.flags.sms;
          }
          if (msg.mail == undefined){
            var mail = result.flags.mail;
          }
          if (msg.app == undefined){
            var app = result.flags.app;
          } 
          if (msg.normal == undefined){
            var normal = result.flags.normal;
          } 
          result.data$({
            flags: {
              sms: sms || msg.sms,
              mail: mail || msg.mail,
              app: app || msg.app,
              telegram: telegram || msg.telegram,
              normal: normal || msg.normal,
            },
            mfa: msg.mfa
          });
          result.save$(function (err, user) {
            respond(err, {
              succes: true,
              message: "Succesfully changed the flags!",
              email: user.email,
              uuid: user.uuid,
            })
          });
      })
   }

  function updateOrCreateNewSession(msg, respond) {
    act("entity:user-mfa,get:user", {
        email: msg.email
      })
      .then((user) => {
        if (user.succes) {
          return act("entity:user-mfa,update:new", {
              email: msg.email,
              sms: msg.sms,
              mail: msg.mail,
              app: msg.app,
              normal: msg.normal,
              mfa: msg.mfa,
              telegram: msg.telegram
              
            })
            .then((data) => {
              return respond(null, data);
            })
            .catch((err) => {
              return respond(err, null)
            })
        } else if (!user.succes) {
          return act("entity:user-mfa,create:new", {
              email: msg.email,
              sms: msg.sms,
              mail: msg.mail,
              app: msg.app,
              normal: msg.normal,
              mfa: msg.mfa,
              telegram: msg.telegram
              
            })
            .then((data) => {
              return respond(null, data);
            })
            .catch((err) => {
              return respond(err, null)
            })
        }
      })
      .catch((err) => {
        respond(err, null);
      });
    }
   }
