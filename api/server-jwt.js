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
      
      
        {path: "/api/logout", method: "get"},
        {path: "/api/signup", method: "post"},
        {path: "/api/verify-email", method: "post"},
        {path: "/api/verify-sms", method: "post"},
        {path: "/api/verify-app", method: "post"},
        
        
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
  server.seneca.act("role:auth,mfa:auth", {
    password: password,
    email: email,
    sms: sms,
    mail: mail,
    app: app
  }, function (err, respond) {
    if (err) {
      return reply("yolo");
    } else if (respond.succes) {
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
          token: createToken(respond.user)
        });
      }
      else{
        return reply({
          succes: respond.succes,
          message: respond.message,
          redirectTo: respond.redirectTo,
          uuid: respond.uuid
        });
      }
    } else if (!respond.succes) {
      return reply(Boom.unauthorized("Username or password is wrong!"));
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
const signUp = (request, reply) => {
  let email = request.payload.email;
  let fullName = request.payload.fullName;
  let password = request.payload.password;
  server.seneca.act("role:auth,cmd:signup", {
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
      if(respond.returnToken){
        return reply({
          succes: respond.succes,
          message: respond.message,
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
          }
        },
        handler: loginWithMFA,
      }
    }, {
      method: "POST",
      path: "/api/verify-sms",
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
    }, 
   {
      method: "POST",
      path: "/api/verify-email",
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
      path: "/api/verify-app",
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
      method: "POST",
      path: "/api/signup",
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
        handler: signUp,
        
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



