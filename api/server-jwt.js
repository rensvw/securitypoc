var PORT = process.env.PORT || process.argv[2] || 3000;
var HOST = process.env.HOST || process.argv[2] || "127.0.0.1";
var BASES = (process.env.BASES || process.argv[3] || "127.0.0.1:39000,127.0.0.1:39001").split(",");
var SILENT = process.env.SILENT || process.argv[4] || "true";

const Chairo = require("chairo");
const Seneca = require("seneca");
const tag = "api";
const Joi = require("joi");
const Hapi = require("hapi");
const Handlebars = require("handlebars");
const Boom = require("boom");
const Bcrypt = require("bcrypt");
const CookieAuth = require("hapi-auth-cookie");
const Rif = require("rif");
const Inert = require("inert");
const HapiSwagger = require("hapi-swagger");
const Good = require("good");
const Vision = require("vision");
const jsonwebtoken = require("hapi-auth-jwt");
const Promise = require("bluebird");
const secret = "fsdhfjiashjkfjasdijfasljfuiwhcfweahfuihahfksdh";
const jwt = require("jsonwebtoken");

const options = {
    info: {
            "title": "SecurityPoC API Documentation",
            "version": "1",
        }
    };

// create new server instance
const server = new Hapi.Server();
var rif = Rif()

var host = rif(HOST) || HOST

// add server’s connection information
server.connection({
  port: PORT,
  host: host
});

// register plugins to server instance

server.register([
  {
    register: Inert
  },{
    register: jsonwebtoken
  },
    {
      register: Vision
    },
    {
        register: HapiSwagger,
        options: options
    },
 
  {
    register: Good,
    options: {
      ops: {
        interval: 10000
      },
      reporters: {
        console: [
          {
            module: "good-squeeze",
            name: "Squeeze",
            args: [ { log: "*", response: "*", request: "*" } ]
          },
          {
            module: "good-console"
          },
          "stdout"
        ]
      }
    }
  },
 
  { register: Chairo,
    options: {
        seneca: Seneca({
            tag: tag,
            internal: {
                logger: require("seneca-demo-logger")
            },
            debug: {
                short_logs: true
            }
        })
        .use("zipkin-tracer", {sampling:1})
    }
},
{
  register: require("wo"),
  options:{
    bases: BASES,
    route: [
        {path: "/api/", method: "get"},      
        {path: "/documentation", method: "get"},      
        {path: "/api/login", method: "post"},
        {path: "/api/login/email", method: "post"},
        {path: "/api/login/sms", method: "post"},
        {path: "/api/login/app", method: "post"},
        {path: "/api/login/telegram", method: "post"},
        {path: "/api/settings/change-password", method: "post"},
        {path: "/api/logout", method: "get"},
        {path: "/api/signup/email", method: "post"},
        {path: "/api/signup/app/create/uri", method: "get"},
        {path: "/api/signup/sms", method: "post"},
        {path: "/api/signup/telegram", method: "post"},
        {path: "/api/verify/email", method: "post"},
        {path: "/api/verify/sms", method: "post"},
        {path: "/api/verify/app", method: "post"},
        {path: "/api/verify/telegram", method: "post"},
        {path: "/api/signup/verify/email", method: "post"},
        {path: "/api/signup/verify/app", method: "post"},
        {path: "/api/signup/verify/sms", method: "post"},
        {path: "/api/signup/verify/telegram", method: "post"},
        {path: "/api/signup/send/telegram", method: "post"},
      
        
        
    ],
    sneeze: {
      host: host,
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  }
}], function (err) {
  if (err) {
    server.log("error", "failed to install plugins");
    throw err;
  }

  server.log("info", "Plugins registered");


  server.auth.strategy("jwt", "jwt",
    { key: secret,          // Never Share your secret key 
      verifyOptions: { algorithms: [ "HS256" ] } // pick a strong algorithm 
    });

server.log("info", "Registered auth strategy: jwt auth")


function createToken(user) {
  return jwt.sign({ email: user.email, fullName: user.fullName }, secret, { algorithm: "HS256", expiresIn: "1h" } );
}


// Tests if user is logged in!
const testAuth = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      auth: "yessss"
    });
  }
  return reply({
    auth: "nooooo"
  });
}


// Function for logging in!
const loginWithMFA = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let email = request.payload.email;
  let password = request.payload.password;
  let sms = request.payload.sms;
  let mail = request.payload.mail;
  let app = request.payload.app;
  let telegram = request.payload.telegram;
  let mfa = request.payload.mfa;
  let normal = request.payload.normal;
  server.seneca.act("role:auth,mfa:auth", {
    password: password,
    email: email,
    sms: sms,
    mail: mail,
    app: app,
    normal:normal,
    telegram: telegram,
    mfa:mfa
  }, function (err, respond) {
    if (err) {
      return reply("yolo");
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: "Welcome!",
          redirectTo: 'home',
          email: respond.user.email,
          fullName: respond.user.fullName,
          
          token: createToken(respond.user)
        });
      }
      else{
        return reply({
          succes: respond.succes,
          message: "First step succeeded, lets go to the next one!",
          redirectTo: respond.redirectTo,
          uuid: respond.uuid
        });
      }
    } else if (!respond.succes) {
      return reply(Boom.unauthorized("Username or password is wrong, or you didn't verify the authentication type!"));
    }
  });
};

const loginWithEmail = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let email = request.payload.email;
  let mfa = request.payload.mfa;
  let sms = request.payload.sms;
  let mail = request.payload.mail;
  let app = request.payload.app;
  let telegram = request.payload.telegram;
  let normal = request.payload.normal;
  server.seneca.act("role:auth,login:email", {
    email: email,
    sms: sms,
    mail: mail,
    app: app,
    normal: normal,
    telegram: telegram,    
    mfa: mfa
  }, function (err, respond) {
    if (err) {
      return reply("yolo");
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: "Welcome!",
          redirectTo: 'home',
          email: respond.user.email,
          fullName: respond.user.fullName,
          token: createToken(respond.user)
        });
      }
      else{
        return reply({
          succes: respond.succes,
          message: "First step succeeded, lets go to the next one!",
          redirectTo: respond.redirectTo,
          uuid: respond.uuid
        });
      }
    } else if (!respond.succes) {
      return reply(Boom.unauthorized("Username or password is wrong, or you didn't verify the authentication type!"));
    }
  });
};

const loginWithSMS = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let phoneNumber = request.payload.phoneNumber;
  let mfa = request.payload.mfa;
  let sms = request.payload.sms;
  let mail = request.payload.mail;
  let app = request.payload.app;
  let telegram = request.payload.telegram;
  let normal = request.payload.normal;
  server.seneca.act("role:auth,login:sms", {
    phoneNumber: phoneNumber,
    sms: sms,
    mail: mail,
    app: app,
    normal: normal,
    telegram: telegram,    
    mfa: mfa
  }, function (err, respond) {
    if (err) {
      return reply("yolo");
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: "Welcome!",
          redirectTo: 'home',
          email: respond.user.email,
          fullName: respond.user.fullName,
          token: createToken(respond.user)
        });
      }
      else{
        return reply({
          succes: respond.succes,
          message: "First step succeeded, lets go to the next one!",
          redirectTo: respond.redirectTo,
          uuid: respond.uuid
        });
      }
    } else if (!respond.succes) {
      return reply(Boom.unauthorized("Username or password is wrong, or you didn't verify the authentication type!"));
    }
  });
};

const loginWithTelegram = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let email = request.payload.email;
  let mfa = request.payload.mfa;
  let sms = request.payload.sms;
  let mail = request.payload.mail;
  let app = request.payload.app;
  let normal = request.payload.normal;
  let telegram = request.payload.telegram;
  server.seneca.act("role:auth,login:telegram", {
    email: email,
    sms: sms,
    mail: mail,
    app: app,
    normal: normal,
    mfa: mfa,
    telegram: telegram
  }, function (err, respond) {
    if (err) {
      return reply("yolo");
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: "Welcome!",
          redirectTo: 'home',
          email: respond.user.email,
          fullName: respond.user.fullName,
          token: createToken(respond.user)
        });
      }
      else{
        return reply({
          succes: respond.succes,
          message: "First step succeeded, lets go to the next one!",
          redirectTo: respond.redirectTo,
          uuid: respond.uuid
        });
      }
    } else if (!respond.succes) {
      return reply(Boom.unauthorized("Username or password is wrong, or you didn't verify the authentication type!"));
    }
  });
};

const loginWithApp = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let email = request.payload.email;
  let mfa = request.payload.mfa;
  let sms = request.payload.sms;
  let mail = request.payload.mail;
  let app = request.payload.app;
  let normal = request.payload.normal;
  let telegram = request.payload.telegram;
  server.seneca.act("role:auth,login:app", {
    email: email,
    sms: sms,
    mail: mail,
    app: app,
    normal: normal,
    telegram: telegram,    
    mfa: mfa
  }, function (err, respond) {
    if (err) {
      return reply("yolo");
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: "Welcome!",
          redirectTo: 'home',
          email: respond.user.email,
          fullName: respond.user.fullName,
          token: createToken(respond.user)
        });
      }
      else{
        return reply({
          succes: respond.succes,
          message: "First step succeeded, lets go to the next one!",
          redirectTo: respond.redirectTo,
          uuid: respond.uuid
        });
      }
    } else if (!respond.succes) {
      return reply(Boom.unauthorized("Username or password is wrong, or you didn't verify the authentication type!"));
    }
  });
};


const verifySMSCodeAndLogin = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let code = request.payload.code;
  let uuid = request.payload.uuid;
  server.seneca.act("role:auth,sms:verify", {
    code: code,
    uuid: uuid
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
    if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          redirectTo: "home",          
          fullName: respond.user.fullName,
          email: respond.user.email,
          token: createToken(respond.user)
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};

const verifyTelegramCodeAndLogin = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let code = request.payload.code;
  let uuid = request.payload.uuid;
  server.seneca.act("role:auth,verify:telegram", {
    code: code,
    uuid: uuid
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
    if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          redirectTo: "home",          
          fullName: respond.user.fullName,
          email: respond.user.email,
          token: createToken(respond.user)
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};


//Function for logging out!
const logout = (request, reply) => {
  request.cookieAuth.clear();
  return reply("You are logged out!");
}

// Function for registering!
const signUpEmail = (request, reply) => {
  let email = request.payload.email;
  let fullName = request.payload.fullName;
  let password = request.payload.password;
  server.seneca.act("role:auth,signup:email", {
    email: email,
    fullName: fullName,
    password: password,
  }, function (err, respond) {
    if (err) {
      return reply(Boom.badRequest(respond(err, null)));
    } else {
      return reply(respond);
    }
  });
};

const signUpSMS = (request, reply) => {
  let email = request.payload.email;
  let phoneNumber = request.payload.phoneNumber;
  let countryCode = request.payload.countryCode;
  let password = request.payload.password;
  server.seneca.act("role:auth,signup:sms", {
    countryCode: countryCode,
    phoneNumber: phoneNumber,
    email: email,
    password: password
  }, function (err, respond) {
    if (err) {
      return reply(Boom.badRequest(respond(err, null)));
    } else {
      return reply(respond);
    }
  });
};

const signUpTelegram = (request, reply) => {
  let email = request.payload.email;
  let token = request.payload.token;
  let password = request.payload.password;
  server.seneca.act("role:auth,signup:telegram", {
    token: token,
    email: email,
    password: password
  }, function (err, respond) {
    if (err) {
      return reply(Boom.badRequest(respond(err, null)));
    } else {
      return reply(respond);
    }
  });
};

const signupVerifyTelegram = (request, reply) => {
  let uuid = request.payload.uuid;
  let code = request.payload.code;
  server.seneca.act("role:auth,signup:verify-telegram", {
    uuid: uuid,
    code: code
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          email: respond.user.email,
          redirectTo: "home",
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};


const createUriApp = (request,reply) => {
  
   server.seneca.act("role:auth,create:uri", {
    email: request.query.email
  }, function (err, respond) {
    if (err) {
      return reply(Boom.badRequest(respond(err, null)));
    } else {
      return reply(respond);
    }
  });

}

const verifyEmailCodeAndLogin = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let code = request.payload.code;
  let uuid = request.payload.uuid;
  server.seneca.act("role:auth,email:verify", {
    code: code,
    uuid: uuid
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
      console.log(respond);
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          redirectTo: "home",
          fullName: respond.user.fullName,
          email: respond.user.email,
          token: createToken(respond.user)

        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};


const verifyTOTPCodeAndLogin = (request, reply) => {
  if (request.auth.isAuthenticated) {
    return reply({
      message: "you're already authenticated!"
    });
  }
  let code = request.payload.code;
  let uuid = request.payload.uuid;
  server.seneca.act("role:auth,app:verify", {
    code: code,
    uuid: uuid
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          redirectTo: "home",         
          fullName: respond.user.fullName,
          email: respond.user.email, 
          token: createToken(respond.user)
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};

const signupVerifyEmail = (request, reply) => {
  let uuid = request.payload.uuid;
  let code = request.payload.code;
  server.seneca.act("role:auth,signup:verify-email", {
    uuid: uuid,
    code: code
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          email: respond.user.email,
          redirectTo: "home",          
          token: createToken(respond.user)
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};

const signupVerifyApp = (request, reply) => {
  let email = request.payload.email;
  let code = request.payload.code;
  let password = request.payload.password;
  let secret = request.payload.secret;
  
  server.seneca.act("role:auth,verify:uri", {
    email: email,
    code: code,
    password: password,
    secret: secret
    
    
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          email: respond.user.email,
          redirectTo: "home",          
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};

const signupVerifySMS = (request, reply) => {
  let uuid = request.payload.uuid;
  let code = request.payload.code;
  server.seneca.act("role:auth,sms:verify-signup", {
    uuid: uuid,
    code: code
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          email: respond.user.email,
          redirectTo: "home",
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};

const sendTelegramMessage = (request, reply) => {
  let email = request.payload.email;
  server.seneca.act("role:telegram,send:message", {
    email: email,
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          email: respond.user.email,
          redirectTo: "home",
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};

const verifyNormalLogin = (request, reply) => {
  let uuid = request.payload.uuid;
  let email = request.payload.email;
  let password = request.payload.password;
  
  server.seneca.act("role:auth,verify:normal", {
    uuid: uuid,
    email: email,
    password: password
  }, function (err, respond) {
    if (err) {
      reply(err);
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          fullName: respond.user.fullName,
          email: respond.user.email,
          redirectTo: "home",
          token: createToken(respond.user)
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
};

const changePassword = (request, reply) => {
  let oldPassword= request.payload.oldPassword;
  let newPassword1= request.payload.newPassword1;
  let newPassword2= request.payload.newPassword2;
  let email= request.payload.email;
  server.seneca.act("role:auth,change:password", {
    oldPassword: oldPassword,
    newPassword1: newPassword1,
    newPassword2: newPassword2,
    email: email
  }, function(err,respond){
    if (err) {
      reply(err);
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          redirectTo: "home",
        });
      }
      else{
        return reply(respond);
      }
    } else if (!respond.succes) {
     reply({succes:respond.succes,
      message: respond.message})
    }
  });
}

  // Routes
  server.route([{
      method: "GET",
      path: "/api",
      config: {
        description: "Checks if the user is currently logged in!",
        notes: "Returns auth:yesss if the user is authenticated!",
        tags: ["api"],
        auth: {
            strategy: "jwt"
        },
        handler: testAuth
      }
    },{
      method: "POST",
      path: "/api/signup/verify/email",
      config: {
        description: "After the email is verified, creates the user!",
        notes: "User created!",
        tags: ["api"],
        validate: {
          payload: {
            uuid: Joi.string().required(),
            code: Joi.string().required() 
          }
        },
        handler: signupVerifyEmail
      }
    },{
      method: "POST",
      path: "/api/signup/verify/app",
      config: {
        description: "After the authenticater app code is verified, adds this function to the account!",
        notes: "Authenticator app added if true",
        tags: ["api"],
        
        validate: {
          payload: {
            email: Joi.string().required(),
            code: Joi.string().required(),
            password: Joi.string().required(),
            secret: Joi.string().required()            

          }
        },
        handler: signupVerifyApp
      }
    },{
      method: "POST",
      path: "/api/settings/change-password",
      config: {
        description: "Changes the password",
        notes: "Change the password",
        tags: ["api"],
        validate: {
          payload: {
            email: Joi.string().required(),
            oldPassword: Joi.string().min(6).required(),
            newPassword1: Joi.string().min(8).required(),
            newPassword2: Joi.string().min(8).required()            
          }
        },
        handler: changePassword
      }
    },{
      method: "POST",
      path: "/api/signup/verify/sms",
      config: {
        description: "After the sms is verified, creates the user!",
        notes: "SMS User created!",
        tags: ["api"],
        auth: {
            strategy: "jwt"
        },
        validate: {
          payload: {
            uuid: Joi.string().required(),
            code: Joi.string().required() 
          }
        },
        handler: signupVerifySMS
      }
    },{
      method: "POST",
      path: "/api/signup/verify/telegram",
      config: {
        description: "After the telegram message is verified, verifies the telegram account!",
        notes: "Telegram User created!",
        tags: ["api"],
        auth: {
            strategy: "jwt"
        },
        validate: {
          payload: {
            uuid: Joi.string().required(),
            code: Joi.string().required() 
          }
        },
        handler: signupVerifyTelegram
      }
    },{
      method: "POST",
      path: "/api/signup/send/telegram",
      config: {
        description: "Send a telegram message!",
        notes: "Send a telegram message!",
        tags: ["api"],

        validate: {
          payload: {
            email: Joi.string().required(),
          }
        },
        handler: sendTelegramMessage
      }
    }, {
      method: "POST",
      path: "/api/login",
      config: {
        description: "Login route",
        notes: "Returns true if correctly logged in",
        tags: ["api"],
        validate: {
          payload: {
            email: Joi.string().email().required(),
            password: Joi.string().min(2).max(200).required(),
            sms: Joi.number().integer().min(0).max(1).default(1),
            mail: Joi.number().integer().min(0).max(1).default(1),
            app: Joi.number().integer().min(0).max(1).default(1),  
            telegram: Joi.number().integer().min(0).max(1).default(1),  
            normal: Joi.number().integer().min(0).max(1).default(1),  
            mfa: Joi.array()            
          }
        },
        handler: loginWithMFA,
      }
    },{
      method: "POST",
      path: "/api/login/email",
      config: {
        description: "Login route",
        notes: "Returns true if correctly logged in",
        tags: ["api"],
        validate: {
          payload: {
            email: Joi.string().email().required(),
            sms: Joi.number().integer().min(0).max(1).default(1),
            mail: Joi.number().integer().min(0).max(1).default(1),
            app: Joi.number().integer().min(0).max(1).default(1),  
            telegram: Joi.number().integer().min(0).max(1).default(1),  
            normal: Joi.number().integer().min(0).max(1).default(1),  
            mfa: Joi.array()
          }
        },
        handler: loginWithEmail,
      }
    },{
      method: "POST",
      path: "/api/login/app",
      config: {
        description: "Login route",
        notes: "Returns true if correctly logged in",
        tags: ["api"],
        validate: {
          payload: {
            email: Joi.string().email().required(),
            sms: Joi.number().integer().min(0).max(1).default(1),
            mail: Joi.number().integer().min(0).max(1).default(1),
            app: Joi.number().integer().min(0).max(1).default(1),  
            telegram: Joi.number().integer().min(0).max(1).default(1),  
            normal: Joi.number().integer().min(0).max(1).default(1),  
            mfa: Joi.array()
          }
        },
        handler: loginWithApp,
      }
    },{
      method: "POST",
      path: "/api/login/sms",
      config: {
        description: "Login route",
        notes: "Returns true if correctly logged in",
        tags: ["api"],
        validate: {
          payload: {
            phoneNumber: Joi.string().required(),
            sms: Joi.number().integer().min(0).max(1).default(1),
            mail: Joi.number().integer().min(0).max(1).default(1),
            app: Joi.number().integer().min(0).max(1).default(1),  
            telegram: Joi.number().integer().min(0).max(1).default(1),  
            normal: Joi.number().integer().min(0).max(1).default(1),  
            mfa: Joi.array()
          }
        },
        handler: loginWithSMS,
      }
    },{
      method: "POST",
      path: "/api/login/telegram",
      config: {
        description: "Login route for telegram",
        notes: "Returns true if correctly logged in",
        tags: ["api"],
        validate: {
          payload: {
            email: Joi.string().required(),
            sms: Joi.number().integer().min(0).max(1).default(1),
            mail: Joi.number().integer().min(0).max(1).default(1),
            app: Joi.number().integer().min(0).max(1).default(1),  
            normal: Joi.number().integer().min(0).max(1).default(1),  
            telegram: Joi.number().integer().min(0).max(1).default(1),  
            mfa: Joi.array()
          }
        },
        handler: loginWithTelegram,
      }
    },{
      method: "POST",
      path: "/api/verify/telegram",
      config: {
        description: "Verify your telegram code when logging in",
        notes: "Returns a cookie session if authorised",
        tags: ["api"],
        validate: {
          payload: {
            uuid: Joi.string().required(),
            code: Joi.string().required()
          }
        },
        handler: verifyTelegramCodeAndLogin,
        
      }
    }, {
      method: "POST",
      path: "/api/verify/sms",
      config: {
        description: "Verify your sms code when logging in",
        notes: "Returns a cookie session if authorised",
        tags: ["api"],
        validate: {
          payload: {
            uuid: Joi.string().required(),
            code: Joi.string().required()
          }
        },
        handler: verifySMSCodeAndLogin,
        
      }
    },{
      method: "POST",
      path: "/api/verify/normal",
      config: {
        description: "Verify your sms code when logging in",
        notes: "Returns a cookie session if authorised",
        tags: ["api"],
        validate: {
          payload: {
            uuid: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(2).max(200).required(),
          }
        },
        handler: verifyNormalLogin,
        
      }
    }, 
   {
      method: "POST",
      path: "/api/verify/email",
      config: {
        description: "Verify your email code when logging in",
        notes: "Returns a cookie session if authorised",
        tags: ["api"],
        validate: {
          payload: {
            uuid: Joi.string().required(),
            code: Joi.string().required()
          }
        },
        handler: verifyEmailCodeAndLogin,

      }
    }, {
      method: "POST",
      path: "/api/verify/app",
      config: {
        description: "Verify your TOTP code when logging in",
        notes: "Returns a cookie session if authorised",
        tags: ["api"],
        validate: {
          payload: {
            uuid: Joi.string().required(),
            code: Joi.string().required()
          }
        },
        handler: verifyTOTPCodeAndLogin,
      }
    },
    {
      method: "GET",
      path: "/api/logout",
      config: {
        description: "Logout route",
        notes: "Logs the user out",
        tags: ["api"],
        handler: logout
      }
    },
    {
      method: "GET",
      path: "/api/signup/app/create/uri",
      config: {
        description: "Create the uri for an authenticator app",
        notes: "Create the uri for an authenticator app",
        tags: ["api"],
        validate:{
          query: {
            email: Joi.string().email().required()
          }
        },
        handler: createUriApp
      }
    },
    {
      method: "POST",
      path: "/api/signup/email",
      config: {
        description: "Registers a new user",
        notes: "Returns true if user is created and saved to database",
        tags: ["api"],
        validate: {
          payload: {
            email: Joi.string().email().required(),
            password: Joi.string().min(2).max(200).required(),
            fullName: Joi.string().min(2).max(200).required()
          }
        },
        handler: signUpEmail,
      }
    },
    {
      method: "POST",
      path: "/api/signup/sms",
      config: {
        description: "Registers a new phonenumber to the user",
        notes: "Returns true if the phonenumber is created and saved to database",
        tags: ["api"],
        validate: {
          payload: {
            countryCode: Joi.string().required(),
            phoneNumber: Joi.string().min(2).max(200).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
          }
        },
        handler: signUpSMS,
      }
    },{
      method: "POST",
      path: "/api/signup/telegram",
      config: {
        description: "Registers a new telegram account to the user",
        notes: "Returns true if the account is created and saved to database",
        tags: ["api"],
        validate: {
          payload: {
            token: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required()
          }
        },
        handler: signUpTelegram,
      }
    }
  ]);

  server.log("info", "Routes registered");


// Set up mesh network
server.seneca
  .use("mesh", {
    host: host,
    bases: BASES,
    sneeze: {
      silent: JSON.parse(SILENT),
      swim: {
        interval: 1111
      }
    }
  });

  // start your server after plugin registration
  server.start(function (err) {
    if (err) {
      server.log("error", "failed to start server")
      server.log("error", err);

      throw err
    }
    server.log("info", "Server running at: " + server.info.uri)
  });
});



