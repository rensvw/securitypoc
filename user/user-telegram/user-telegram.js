module.exports = function userTelegram( options ) {

const moment = require("moment");
const Promise = require("bluebird");
var act = Promise.promisify(this.act, {context: this});

this.add({entity:"user-telegram",create:"new"}, createNewTelegramSession);
this.add({entity:"user-telegram",update:"new"}, updateNewTelegramSession);
this.add({entity:"user-telegram",get:"email"}, getTelegramUserSession);
this.add({entity:"user-telegram",get:"uuid"}, getTelegramUserSessionWithUUID);
this.add({entity:"user-telegram",crud:"user"}, updateOrCreateNewTelegramSession);

function getTelegramUserSessionWithUUID(msg, respond) {
    var userTelegram = this.make$("userTelegramSession");
    let uuid = msg.uuid;
    userTelegram.load$({
      uuid: uuid
    }, function (err, user) {
      if (err) {
        respond(err, null);
      }
      if (user) {
        respond(err, {
          succes: true,
          token: user.token,
          uuid: user.uuid,
          chatId: user.chatId,
          session: user.session
        });
      }
    });
  }

function getTelegramUserSession(msg, respond) {
    var userTelegram = this.make$("userTelegramSession");
    userTelegram.load$({
      email: msg.email
    }, function (err, user) {
      if (err) {
        respond(err, null);
      }
      if (!user) {
        respond(null, {
          succes: false,
          message: "User could not be found!"
        });
      }
      if (user) {
        respond(err, {
          succes: true,
          token: user.token,
          chatId: user.chatId,
          uuid: user.uuid,
          session: user.session
        });
      }
    });
  }

function createNewTelegramSession(msg, respond) {
    var userTelegram = this.make('userTelegramSession');
    userTelegram.email = msg.email;
    userTelegram.token = msg.token;
    userTelegram.chatId = msg.chatId
    userTelegram.uuid = msg.uuid;
    userTelegram.session = {
      timecreated: moment().format('LLL'),
      code: msg.code
    };
    userTelegram.save$(function (err, user) {
      if (err) {
        respond(err, null);
      } else {
        respond(null, this.util.clean(user), respond(err, {
              succes: true,
              message: "Succesfully started a new telegram session!",
              uuid: user.uuid,
              token: user.token,
              chatId: user.chatId
            }));
      }
    });
  }

  function updateNewTelegramSession(msg, respond) {
    var userTelegram = this.make('userTelegramSession');
        userTelegram.load$({
          email: msg.email
        }, function (err, result) {
          if (!result) {
            respond({
              succes: false,
              message: "User could not be found!"
            });
          }
          if(msg.token== undefined){
            msg.token = result.token;
          }
          if(msg.chatId == undefined){
            msg.chatId = result.chatId;
          }
          result.data$({
            uuid: msg.uuid,
            token: msg.token,
            chatId: msg.chatId,
            session: {
              timeCreated: moment().format('LLL'),
              code: msg.code,
            }
          });
          result.save$(function (err, user) {
            respond(err, {
              succes: true,
              message: "Succesfully started a new telegram session!",
              uuid: user.uuid,
              token: user.token,
              chatId: user.chatId
            })
          });

        })
  }
  

  function updateOrCreateNewTelegramSession(msg, respond) {
    let uuid = msg.uuid
    act("entity:user-telegram,get:email", {
        email: msg.email
      })
      .then((user) => {
        if (user.succes) {
          return act("entity:user-telegram,update:new", {
              token: msg.token,
              chatId: msg.chatId,
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
          return act("entity:user-telegram,create:new", {
              email: msg.email,
              uuid: uuid,
              code: msg.code,
              token: msg.token,
              chatId: msg.chatId,
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