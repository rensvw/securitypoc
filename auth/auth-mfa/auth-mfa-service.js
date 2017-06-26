var HOST = process.env.HOST || process.argv[2] || "127.0.0.1"
var BASES = (process.env.BASES || process.argv[3] || "127.0.0.1:39000,127.0.0.1:39001").split(",")
var SILENT = process.env.SILENT || process.argv[4] || "true"

require("seneca")({tag: "auth-mfa-service"})
  .use(require("./auth-mfa"))  
  .use("zipkin-tracer", {sampling:1})
  .use("mesh",{
    listen: [
      { 
      pins: [
      "role:auth,mfa:auth", 
      "role:auth,mfa:check",      
      "role:auth,login:email",
      "role:auth,verify:normal",
      "role:auth,login:sms",
      "role:auth,login:app",
      ]
    }],
    bases: BASES,
    host: HOST,
    sneeze: {
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  });