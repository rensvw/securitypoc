module.exports = function auth(options) {

  let moment = require("moment");
  const Promise = require("bluebird");
  const randomID = require("random-id");

  var act = Promise.promisify(this.act, {context: this});

  function signup(msg, respond) {
    let email = msg.email;
    let fullName = msg.fullName;
    let password = msg.password;
    act("role:hash,cmd:newHash", { password: password })
    .then((hash) => {
      return act("entity:user,create:new", {
        email: email,
        fullName: fullName,
        password: hash.password,
      });
    })
    .then((user) => {
      respond(user);
    })
    .catch((err) => {
      respond(err);
    })
      
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
            message: "Username or password is incorrect!"
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

  function checkVerifiedAuthMethods(msg,respond){
    let email = msg.email;
    let sms = msg.sms;
    let app = msg.app;
    let mail = msg.mail;
    let array = [];
    act("entity:user,get:email", {email: msg.email })
    .then((user)=>{
      console.log(user)
      if(user.verified.sms !== msg.sms){
        return respond({succes:false,message:"You didn't register a phone number to your account!"})
      }
      else if(user.verified.app !== msg.app){
        return respond({succes:false,message:"You didn't register an authenticator app to your account!"})
      }
      else if(user.verified.mail !== msg.mail){
        return respond({succes:false,message:"You didn't verify your email adres!"})        
      }
      else{
        return respond({succes:true,message:"All methods can be used!"});
      }
    })
    .catch((err)=>{
      return respond(err,null);
    })
  }


  this.add({role:"auth",check:"verified"}, checkVerifiedAuthMethods);
  this.add({role:"auth",cmd:"authenticate",mfa:"none"}, authenticate);

  };