module.exports = function flag( options ) {

  const moment = require("moment");
  const Promise = require("bluebird");
  var act = Promise.promisify(this.act, {context: this});

  this.add({entity:"user-email",create:"new"}, createNewEmailSession);
  this.add({entity:"user-email",update:"new"}, updateNewEmailSession);
  this.add({entity:"user-email",get:"user"}, getEmailUserSession);
  this.add({entity:"user-email",get:"uuid"}, getEmailUserSessionWithID);
  this.add({entity:"user-email",crud:"user"}, updateOrCreateNewSession);

  function getEmailUserSessionWithID(msg, respond) {
    var userEmail = this.make$("userEmailSession");
    let uuid = msg.uuid;
    userEmail.load$({
      uuid: uuid
    }, function (err, userEmail) {
      if (err) {
        respond(err, null);
      }
      if (!userEmail) {
        respond(null, {
          succes: false,
          message: "User could not be found!"
        });
      }
      if (userEmail) {
        respond(err, {
          succes: true,
          email: userEmail.email,
          uuid: userEmail.uuid,
          session: userEmail.session
        });
      }
    });
  }
  
  function getEmailUserSession(msg, respond) {
    var userEmail = this.make$("userEmailSession");
    userEmail.load$({
      email: msg.email
    }, function (err, userEmail) {
      if (err) {
        respond(err, null);
      }
      if (!userEmail) {
        respond(null, {
          succes: false,
          message: "User could not be found!"
        });
      }
      if (userEmail) {
        respond(err, {
          succes: true,
          email: userEmail.email,
          uuid: userEmail.uuid,
          session: userEmail.session
        });
      }
    });
  }

  function createNewEmailSession(msg, respond) {
    var userEmail = this.make('userEmailSession');
    userEmail.email = msg.email;
    userEmail.uuid = msg.uuid;
    userEmail.session = {
      timecreated: moment().format('LLL'),
      code: msg.code
    };
    userEmail.save$(function (err, userEmail) {
      if (err) {
        respond(err, null);
      } else {
        respond(null, this.util.clean(userEmail), respond(err, {
              succes: true,
              message: "Succesfully started a new Email session!",
              uuid: userEmail.uuid,
            }));
      }
    });
  }

  function updateNewEmailSession(msg, respond) {
    var userEmail = this.make('userEmailSession');
        userEmail.load$({
          email: msg.email
        }, function (err, result) {
          if (!result) {
            respond({
              succes: false,
              message: "User could not be found!"
            });
          }
          result.data$({
            uuid: msg.uuid,
            session: {
              timeCreated: moment().format('LLL'),
              code: msg.code,
            }
          });
          result.save$(function (err, user) {
            respond(err, {
              succes: true,
              message: "Succesfully started a new Email session!",
              uuid: user.uuid,
            })
          });

        })
  }
  

  function updateOrCreateNewSession(msg, respond) {
    act("entity:user-email,get:uuid", {
        uuid: msg.uuid
      })
      .then((user) => {
        if (user.succes) {
          return act("entity:user-email,update:new", {
              email: msg.email,
              code: msg.code,
              uuid: msg.uuid
            })
            .then((data) => {
              return respond(null, data);
            })
            .catch((err) => {
              return respond(err, null)
            })
        } else if (!user.succes) {
          return act("entity:user-email,create:new", {
              email: msg.email,
              uuid: msg.uuid,
              code: msg.code || 0,
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