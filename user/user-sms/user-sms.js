module.exports = function flag( options ) {

  const moment = require("moment");
  const Promise = require("bluebird");
  var act = Promise.promisify(this.act, {context: this});

  this.add({entity:"user-sms",create:"new"}, createNewSMSSession);
  this.add({entity:"user-sms",update:"new"}, updateNewSMSSession);
  this.add({entity:"user-sms",get:"user"}, getSMSUserSession);
  this.add({entity:"user-sms",get:"uuid"}, getSMSUserSessionWithID);
  this.add({entity:"user-sms",get:"phoneNumber"}, getSMSUserSessionWithPhoneNumber);
  
  this.add({entity:"user-sms",crud:"user"}, updateOrCreateNewSession);

  function getSMSUserSessionWithID(msg, respond) {
    var userSMS = this.make$("userSMSSession");
    let uuid = msg.uuid;
    userSMS.load$({
      uuid: uuid
    }, function (err, userSMS) {
      if (err) {
        respond(err, null);
      }
      
      if (userSMS) {
        respond(err, {
          succes: true,
          phoneNumber: userSMS.phoneNumber,
          uuid: userSMS.uuid,
          countryCode: userSMS.countryCode,
          session: userSMS.session
        });
      }
    });
  }

  function getSMSUserSessionWithPhoneNumber(msg, respond) {
    var userSMS = this.make$("userSMSSession");
    let phoneNumber = msg.phoneNumber;
    userSMS.load$({
      phoneNumber: phoneNumber
    }, function (err, userSMS) {
      if (err) {
        respond(err, null);
      }
      if(!userSMS){
        respond(null,{
          succes:false,
          message:"Could not find an user!"
        })
      }
      if (userSMS) {
        respond(err, {
          succes: true,
          phoneNumber: userSMS.phoneNumber,
          uuid: userSMS.uuid,
          countryCode: userSMS.countryCode,
          session: userSMS.session
        });
      }
    });
  }
  
  function getSMSUserSession(msg, respond) {
    var userSMS = this.make$("userSMSSession");
    userSMS.load$({
      email: msg.email
    }, function (err, userSMS) {
      if (err) {
        respond(err, null);
      }
      if (!userSMS) {
        respond(null, {
          succes: false,
          message: "User could not be found!"
        });
      }
      if (userSMS) {
        respond(err, {
          succes: true,
          phoneNumber: userSMS.phoneNumber,
          uuid: userSMS.uuid,
          countryCode: userSMS.countryCode,
          session: userSMS.session
        });
      }
    });
  }

  function createNewSMSSession(msg, respond) {
    var userSMS = this.make('userSMSSession');
    userSMS.email = msg.email;
    userSMS.phoneNumber = msg.phoneNumber;
    userSMS.countryCode = msg.countryCode;
    userSMS.uuid = msg.uuid;
    userSMS.session = {
      timecreated: moment().format('LLL'),
      code: msg.code
    };
    userSMS.save$(function (err, userSMS) {
      if (err) {
        respond(err, null);
      } else {
        respond(null, this.util.clean(userSMS), respond(err, {
              succes: true,
              message: "Succesfully started a new sms session!",
              uuid: userSMS.uuid,
            }));
      }
    });
  }

  function updateNewSMSSession(msg, respond) {
    var userSMS = this.make('userSMSSession');
        userSMS.load$({
          email: msg.email
        }, function (err, result) {
          if (!result) {
            respond({
              succes: false,
              message: "User could not be found!"
            });
          }
          if(msg.phoneNumber== undefined){
            msg.phoneNumber = result.phoneNumber;
          }
          if(msg.countryCode == undefined){
            msg.countryCode = result.countryCode;
          }
          result.data$({
            uuid: msg.uuid,
            phoneNumber: msg.phoneNumber,
            countryCode: msg.countryCode,
            session: {
              timeCreated: moment().format('LLL'),
              code: msg.code,
            }
          });
          result.save$(function (err, user) {
            respond(err, {
              succes: true,
              message: "Succesfully started a new sms session!",
              uuid: user.uuid,
            })
          });

        })
  }
  

  function updateOrCreateNewSession(msg, respond) {
    let uuid = msg.uuid
    act("entity:user-sms,get:user", {
        email: msg.email
      })
      .then((user) => {
        if (user.succes) {
          return act("entity:user-sms,update:new", {
              phoneNumber: msg.phoneNumber,
              countryCode: msg.countryCode,
              email: msg.email,
              code: msg.code,
              uuid: uuid
            })
            .then((data) => {
              return respond(null, data);
            })
            .catch((err) => {
              return respond(err, null)
            })
        } else if (!user.succes) {
          return act("entity:user-sms,create:new", {
              email: msg.email,
              uuid: uuid,
              code: msg.code,
              phoneNumber: msg.phoneNumber,
              countryCode: msg.countryCode,
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