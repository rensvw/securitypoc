var instances = 1;

module.exports = {

  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
    name        : "base0",
    script      : "./base/base.js",
    instances : instances,
    exec_mode : "cluster",
    watch       : "./base",
    env: {
      "NODE_ENV": "development",
      "PORT"  : 39000
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },
  {
    name        : "base1",
    script      : "./base/base.js",
    watch       : "./base",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      "PORT"  : 39001
    },
    env_production : {
       "NODE_ENV": "production"
    }
    },
    // First application
    {
    name        : "api",
    script      : "./api/server-jwt.js",
    watch       : "./api",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }

  },
    // First application
    {
    name        : "auth",
    script      : "./auth/auth/auth-service.js",
    watch       : "./auth/auth",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }

  },{
    name        : "auth-app",
    script      : "./auth/auth-app/auth-app-service.js",
    watch       : "./auth/auth-app",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }

  },{
    name        : "auth-telegram",
    script      : "./auth/auth-telegram/auth-telegram-service.js",
    watch       : "./auth/auth-telegram",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }

  },{
    name        : "auth-email",
    script      : "./auth/auth-email/auth-email-service.js",
    watch       : "./auth/auth-email",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }

  },{
    name        : "auth-sms",
    script      : "./auth/auth-sms/auth-sms-service.js",
    watch       : "./auth/auth-sms",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }

  },{
    name        : "auth-mfa",
    script      : "./auth/auth-mfa/auth-mfa-service.js",
    watch       : "./auth/auth-mfa",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }

  },
    // First application
    {
    name        : "user",
    script      : "./user/user/user-service-mongo.js",
    watch       : "./user/user",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name        : "user-app",
    script      : "./user/user-app/user-app-service-redis.js",
    watch       : "./user/user-app",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name        : "user-telegram",
    script      : "./user/user-telegram/user-telegram-service.js",
    watch       : "./user/user-telegram",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name        : "user-mfa",
    script      : "./user/user-mfa/user-mfa-service.js",
    watch       : "./user/user-mfa",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name        : "user-sms",
    script      : "./user/user-sms/user-sms-service.js",
    watch       : "./user/user-sms",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },{
    name        : "user-email",
    script      : "./user/user-email/user-email-service.js",
    watch       : "./user/user-email",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },
    // First application
    {
    name        : "sms",
    script      : "./sms/sms-service.js",
    watch       : "./sms",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },
    // First application
    {
    name        : "repl",
    script      : "./repl/repl-service.js",
    watch       : "./repl",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },
    // First application
    {
    name        : "email",
    script      : "./email/email-service.js",
    watch       : "./email",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },
    // First application
    {
    name        : "generators",
    script      : "./generators/generators-service.js",
    watch       : "./generators",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
    
  },
    // First application
    {
    name        : "hashing",
    script      : "./hashing/hashing-service.js",
    watch       : "./hashing",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    },
  },
    // First application
    {
    name        : "front",
    script      : "./front/front.js",
    watch       : "./front",
    instances : instances,
    exec_mode : "cluster",
    env: {
      "NODE_ENV": "development",
      
    },
    env_production : {
       "NODE_ENV": "production"
    }
  }
    
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/production",
      "post-deploy" : "npm install && pm2 reload ecosystem.config.js --env production"
    },
    dev : {
      user : "node",
      host : "212.83.163.1",
      ref  : "origin/master",
      repo : "git@github.com:repo.git",
      path : "/var/www/development",
      "post-deploy" : "npm install && pm2 reload ecosystem.config.js --env dev",
      env  : {
        NODE_ENV: "dev"
      }
    }
  }
};
