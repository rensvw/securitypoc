module.exports = function authenticatorAppAuth(option) {

    const authenticator = require("authenticator");
    const Promise = require("bluebird");

    var act = Promise.promisify(this.act, {
        context: this
    });

    

    "use strict";

    function authenticate(msg, respond) {
        let email = msg.email;
        let password = msg.password;
        act("role:userapp,cmd:get,type:totp", {
                email: email
            })
            .then((key) => {
                if (!key.succes) {
                    return respond({
                        succes: false,
                        message: "Please first connect the authenticator app to your account!"
                    })
                } else {
                    return act("role:user,cmd:get", {
                            email: email
                        })
                        .then((user) => {
                            if (user.succes) {
                                act("role:hash,cmd:comparePasswords", {
                                        password: password,
                                        hash: user.password
                                    })
                                    .then((authenticated) => {
                                        if (authenticated.succes) {
                                            return act("role:user,cmd:update,param:uuid", {
                                                    email: email
                                                })
                                                .then((result) => {
                                                    return respond({
                                                        succes: true,
                                                        uuid: result.uuid,
                                                        message: "Username and password are correct, please fill in the code from the app!"
                                                    });
                                                })
                                                .catch((err) => {
                                                    return respond(err);
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

    function authenticateAppAndSetFlags(msg, respond) {
    let seneca = this;
    act("entity:user,get:email", {
        email: msg.email
      })
      .then((user) => {
        this.user = user;
        if (!user.succes) {
          return respond({
            succes: false,
            message: "User could not been found!"
          });
        } else {
          return act("entity:user-mfa,crud:user", {email: this.user.email,mail: msg.mail,sms: msg.sms,app: msg.app,normal: msg.normal,telegram: msg.telegram})
              .then((userMFASession) => {
                return respond({succes: true,message: "Authenticator app session started!",uuid: userMFASession.uuid,redirectTo: "verifyAppPage"});
              })
            .catch((err) => {
              return respond(err);
            })
        }})
        .catch((err) => {
        return respond(err);
      });   
  }

    function verifyToken(msg, respond) {
        let uuid = msg.uuid;
        let code = msg.code;
        let seneca = this;
        act("entity:user,get:uuid", {
                uuid: uuid
            })
            .then((user) => {
                this.user = user;
                if (!user) {
                    respond(user);
                } else if (user) {
                    act("entity:user-app,get:key", {
                            email: user.email
                        })
                        .then((data) => {
                            if (!data.succes) {
                                return respond({
                                    succes: false,
                                    message: "Please first connect the authenticator app to your account!"
                                })
                            } else {
                                let verify = authenticator.verifyToken(data.key.toString(), code.toString());
                                if (verify === null) {
                                    return respond({
                                        succes: false,
                                        message: "Code is incorrect!"
                                    });
                                } else if (verify.delta === 0) {
                                    return respond({
                                        succes: true,
                                        user: {
                                            email: this.user.email,
                                            fullName: this.user.fullName
                                        },
                                        message: "Code is correct, welcome!"
                                    });
                                } else if (verify.delta === -1) {
                                    return respond({
                                        succes: false,
                                        message: "You are to late!"
                                    });
                                }
                            }
                        })
                        .catch(function (err) {
                            respond(err);
                        })
                }

            }).catch((err) => {
                respond(err);
            })

    }


    function createUri(msg, respond) {
        act("role:generate,cmd:totp-key")
            .then((data) => {
                return act("role:generate,cmd:totp-uri", {
                        email: msg.email,
                        key: data.key
                    })
                    .then((result) => {
                        respond({
                            uri: result.uri,
                            key: data.key,
                            email: msg.email
                        });
                    })
                    .catch((err) => {
                        respond(err);
                    });
            })
            .catch((err) => {
                respond(err);
            });
    }

    function verifyUriAndSaveToAccount(msg, respond) {
        let code = msg.code.toString();
        let secret = msg.secret.toString();
        let password = msg.password;
        let email = msg.email;
        return act("entity:user,get:email", {
                email: email
            })
            .then((user) => {
                if (user.succes) {
                    act("role:hash,cmd:comparePasswords", {
                            password: password,
                            hash: user.password
                        })
                        .then((authenticated) => {
                            if (authenticated.succes) {
                                let verify = authenticator.verifyToken(secret, code);
                                if (verify === null) {
                                    return respond({
                                        succes: false,
                                        message: "Code is incorrect!"
                                    });
                                } else if (verify.delta === 0) {
                                    act("entity:user-app,crud:user", {
                                            email: msg.email,
                                            key: secret
                                        })
                                        .then((result) => {
                                             return act("entity:user,update:flags", {email: result.email,app: 1})
                                                .then((response)=>{
                                                    return respond({
                                                    succes: true,
                                                    returnToken: true,
                                                    user: {
                                                        email: response.email,
                                                    },
                                                    message: "All codes are correct, welcome!"
                                                    });
                                                })
                                        .catch((err) => {
                                            respond(err);
                                        })})}
                                 else if (verify.delta === -1) {
                                    return respond({
                                        succes: false,
                                        message: "You are to late!"
                                    });
                                }

                            } else {

                            }
                        })
                        .catch((err) => {
                            return respond(err);
                        })
                }
            }).catch((err) => {
                return respond(err);
            })
    }

    function verifyAppCode(msg, respond) {
        let uuid = msg.uuid;
        let code = msg.code;
        let seneca = this;
        act("entity:user-mfa,get:uuid", {
                uuid: uuid
            })
            .then((user) => {
                if (!user) {
                    return respond(null, user);
                } else if (user) {
                    act("entity:user-app,get:key", {
                            email: user.email
                        })
                        .then((data) => {
                            if (!data.succes) {
                                return respond({
                                    succes: false,
                                    message: "Please first connect the authenticator app to your account!"
                                })
                            } else {
                                let verify = authenticator.verifyToken(data.key.toString(), code.toString());
                                if (verify === null) {
                                    return respond({
                                        succes: false,
                                        message: "Code is incorrect!"
                                    });
                                } else if (verify.delta === 0) {
                                    return act("entity:user-mfa,change:flags", {
                                            uuid: msg.uuid,
                                            app: 1
                                        })
                                        .then((data) => {
                                            if (data.succes) {
                                                act('role:auth,mfa:check', {
                                                        uuid: msg.uuid
                                                    })
                                                    .then((check) => {
                                                        return respond(check);
                                                    })
                                                    .catch((err) => {
                                                        return respond(err);
                                                    });
                                            } else {
                                                return respond({
                                                    succes: false,
                                                    message: "Something wen't wrong in the database!"
                                                });
                                            }
                                        })
                                        .catch((err) => {
                                            respond(err);
                                        })
                                } else if (verify.delta === -1) {
                                    return respond({
                                        succes: false,
                                        message: "You are to late!"
                                    });
                                }
                            }
                        })
                        .catch(function (err) {
                            respond(err);
                        })
                }
            }).catch((err) => {
                respond(err);
            })
    }


    this.add({role: "auth",cmd: "authenticate",mfa: "app"}, authenticate);
    this.add({role: "auth",app: "verify"}, verifyAppCode);
    this.add({role: "auth",create: "uri"}, createUri);
    this.add({role: "auth",verify: "uri"}, verifyUriAndSaveToAccount);
    this.add({role:"auth",login:"app"}, authenticateAppAndSetFlags);

}