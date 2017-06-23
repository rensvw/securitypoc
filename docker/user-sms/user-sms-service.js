var HOST = process.env.HOST || process.argv[2] || "127.0.0.1"
var BASES = (process.env.BASES || process.argv[3] || "127.0.0.1:39000,127.0.0.1:39001").split(",")
var SILENT = process.env.SILENT || process.argv[4] || "true"

var seneca = require("seneca")({tag: "user-sms-mongo-service"})
seneca
  .use("entity")
  .use("basic")
  .use(require("./user-sms"))
  .use("mongo-store", {
  uri: "mongodb://rensvanw:zb74jt3bzn.@ds157439.mlab.com:57439/qnh"
  //uri: "mongodb://172.17.0.2:27017/QNHSecurityPoC"
})
.use("zipkin-tracer", {sampling:1})
  .use("mesh",{
      listen: [
      {
        pins: [
          "entity:user-sms,create:new",
          "entity:user-sms,update:new",
          "entity:user-sms,get:user",
          "entity:user-sms,get:uuid",          
          "entity:user-sms,get:phoneNumber",          
          "entity:user-sms,crud:user",]
      }],
        host:HOST,
        bases:BASES,
        sneeze: {
        silent: JSON.parse(SILENT),
        swim: {interval: 1111}
      }
    })

