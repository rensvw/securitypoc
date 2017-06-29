module.exports = function user( options ) {

this.add({"entity":"user","get":"uuid"}, getUserByUuid);
this.add({"entity":"user","get":"email"}, getUser);
this.add({"entity":"user","get":"phoneNumber"}, getUserByPhoneNumber);
this.add({"entity":"user","get":"verified"}, checkIfUserIsVerified);

this.add({"entity":"user","create":"new"}, createUserWhileCheckingForExistingUser);
this.add({"entity":"user","update":"flags"}, updateVerifiedFlags);
this.add({"entity":"user","change":"password"}, changePassword);

this.add({entity:"user",create:"phone"}, createNewPhoneNumber);
this.add({entity:"user",update:"phone"}, updatePhoneNumber);
this.add({"entity":"user","crud":"phone"}, updateOrCreateNewPhoneNumber);
  

 const Promise = require("bluebird");
  var act = Promise.promisify(this.act, {context: this});

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

function getUserByPhoneNumber(msg, respond) {
  var user = this.make$("user");
  var email = msg.email;
  user.load$({ phoneNumber: msg.phoneNumber }, function (err, user) {
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
        phoneNumber: user.phoneNumber,
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

  function createNewPhoneNumber(msg, respond) {
    var user = this.make$("user");
    user.phoneNumber = msg.phoneNumber
    user.save$(function (err, user) {
      if (err) {
        respond(err, null);
      } else {
        respond(null, this.util.clean(user), respond(err, {
              succes: true,
              message: "Phone number added!",
              email: user.email,
              fullName: user.fullName
            }));
      }
    });
  }

  function updatePhoneNumber(msg, respond) {
    var user = this.make$("user");
        user.load$({
          email: msg.email
        }, function (err, result) {
          if (!result) {
            respond({succes: false,message: "User could not be found!"});
          }
          result.data$({
            phoneNumber: msg.phoneNumber,
          });
          result.save$(function (err, user) {
            respond(err, {
              succes: true,
              message: "Succesfully changed the phone number!",
              email: user.email,
              fullName: user.fullName              
            })
          });

        })
  }
  

  function updateOrCreateNewPhoneNumber(msg, respond) {
    act("entity:user,get:email", {
        email: msg.email,
      })
      .then((user) => {
        if (user.succes) {
          return act("entity:user,update:phone", {email: msg.email,phoneNumber:msg.phoneNumber})
            .then((data) => {return respond(null, data);})
            .catch((err) => {return respond(err, null)})
        } else if (!user.succes) {
          return act("entity:user,create:phone", {email: msg.email,phoneNumber:msg.phoneNumber})
            .then((data) => {return respond(null, data);})
            .catch((err) => {return respond(err, null)})
        }
      })
      .catch((err) => {respond(err, null);});
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

 