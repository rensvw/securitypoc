module.exports = function user( options ) {

this.add({"entity":"user","get":"uuid"}, getUserByUuid);
this.add({"entity":"user","get":"email"}, getUser);
this.add({"entity":"user","get":"verified"}, checkIfUserIsVerified);

this.add({"entity":"user","create":"new"}, createUserWhileCheckingForExistingUser);
this.add({"entity":"user","update":"flags"}, updateVerifiedFlags);
this.add({"entity":"user","change":"password"}, changePassword);


const moment = require("moment");
const uuidV4 = require("uuid/v4");

function checkIfUserIsVerified(msg,respond){
  var user = this.make$("user");
  var email = msg.email;
  user.load$({ email: email }, function (err, user) {
    if (err) {
      respond(err, null);
    }
    if (!user) {
      respond({
        succes: false,
        message: "User could not be found!"
      });
    }
    if (user) {
      respond(err, {
        succes: true,
        email: user.email,
        verified: user.verified
      });
    }
  });
}

function getUser(msg, respond) {
  var user = this.make$("user");
  var email = msg.email;
  user.load$({ email: email }, function (err, user) {
    if (err) {
      respond(err, null);
    }
    if (!user) {
      respond({
        succes: false,
        message: "User could not be found!"
      });
    }
    if (user) {
      respond(err, {
        succes: true,
        email: user.email,
        password: user.password,
        verified: user.verified,
        fullName: user.fullName,
      });
    }
  });
}

function getUserByUuid(msg, respond) {
  let user = this.make$("user");
  let uuid = msg.uuid;
  user.load$({ uuid: uuid }, function (err, user) {
    if (err) {
      respond(err, null);
    }
    if (!user) {
      respond({
        succes: false,
        message: "User could not be found!"
      });
    }
    if (user) {
      respond(err, {
        email: user.email,
        password: user.password,
        fullName: user.fullName,
      });
    }
  });
}



//working
function createUser(msg, respond) {
  var user = this.make$("user");
  user.email = msg.email;
  user.fullName = msg.fullName;
  user.password = msg.password;
  user.verified = {
    mail: 0,
    sms: 0,
    app: 0
  };
  user.save$((err, user) => {
    if (err) {
      respond(err, null);
    }
    if (user) {
      respond(err, {
        message: "Account created!",
        succes: true,
        email: user.email
      });
    }
  });
}

//Creates an user, but first checks of an user already exists with the same email.
function createUserWhileCheckingForExistingUser(msg, respond) {
  var user = this.make$("user");
  user.email = msg.email;
  user.fullName = msg.fullName;
  user.password = msg.password;
  user.verified = {
    mail: 0,
    sms: 0,
    app: 0
  };
  this.act("entity:user,get:email", {email: user.email }, function (err, newUser) {
    if (err) {
      respond(err, null);
    } else if (newUser.succes) {
      respond(null, {
        succes: false,
        message: "Email does already exist!"
      });
    } else if (!newUser.succes) {
      user.save$((err, user) => {
        if (err) {
          respond(err, null);
        }
        if (user) {
          respond(err, {
            message: "Account created!",
            succes: true,
            email: user.email
          });
        }
      });
    }
  });
}

 function updateVerifiedFlags(msg, respond) {
    var user = this.make('user');
        user.load$({email: msg.email}, function (err, result) {
          if (!result) {
            respond({
              succes: false,
              message: "User could not be found!"
            });
          }
          if (msg.sms == undefined){
            var sms = result.verified.sms;
          }
          if (msg.mail == undefined){
            var mail = result.verified.mail;
          }
          if (msg.app == undefined){
            var app = result.verified.app;
          } 
          result.data$({
            verified: {
              sms: sms || msg.sms,
              mail: mail || msg.mail,
              app: app || msg.app
            }
          });
          result.save$(function (err, user) {
            respond(err, {
              succes: true,
              message: "Succesfully started the verification session!",
              uuid: user.uuid,
            })
          });
        })
  }

  function changePassword(msg, respond) {
    var user = this.make('user');
        user.load$({email: msg.email}, function (err, result) {
          if (!result) {
            respond({
              succes: false,
              message: "User could not be found!"
            });
          }
          result.data$({
            password: msg.password
          });
          result.save$(function (err, user) {
            respond(err, {
              succes: true,
              message: "Succesfully changed the password!",
              uuid: user.uuid,
            })
          });
        })
  }



};

 