var HOST = process.env.HOST || process.argv[2] || "127.0.0.1"
var BASES = (process.env.BASES || process.argv[3] || "127.0.0.1:39000,127.0.0.1:39001").split(",")
var SILENT = process.env.SILENT || process.argv[4] || "true"

require("seneca")({tag: "auth-telegram-service"})
  .use(require("./auth-telegram"))  
  .use("zipkin-tracer", {sampling:1})
  .use("mesh",{
    listen: [
      { 
      pins: [
      "role:bot,save:token", 
      "role:bot,send:message", 
      "role:auth,login:telegram", 
      "role:auth,verify:telegram", 
      "role:bot,send:message,with:code", 
      ]
    }],
    bases: BASES,
    host: HOST,
    sneeze: {
      silent: JSON.parse(SILENT),
      swim: {interval: 1111}
    }
  });