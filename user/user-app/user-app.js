module.exports = function userApp( options ) {

const Promise = require("bluebird");
var act = Promise.promisify(this.act, {context: this});

function getUserWithKey(msg, respond) {
  var userApp = this.make$("userApp");
  var email = msg.email;
  userApp.load$({email: email}, function (err, user) {
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
        key: user.key
      });
    }
  });
}

//Creates an user, but first checks of an user already exists with the same email.
function createUserWithKeyWhileCheckingForExistingUser(msg, respond) {
  var userApp = this.make$("userApp");
  userApp.email = msg.email;
  this.act("entity:user-app,get:key", {email: userApp.email}, function (err, newUser) {
    if (err) {
      respond(err, null);
    } else if (newUser.succes) {
      respond(null, {
        succes: false,
        message: "Email does already exist!"
      });
    } else if (!newUser.succes) {
          userApp.key = msg.key;
          userApp.save$((err, user) => {
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

this.add({entity:"user-app",create:"user"}, createUserWithKeyWhileCheckingForExistingUser);
this.add({entity:"user-app",get:"key"}, getUserWithKey);



};

 